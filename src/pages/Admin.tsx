import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminTab } from '../types/admin';
import { Car } from '../types';
import { useAdminData } from '../context/AdminDataContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { CarManagement } from '../components/admin/CarManagement';
import { BookingsManagement } from '../components/admin/BookingsManagement';
import { AgencySettingsView } from '../components/admin/AgencySettingsView';
import { CarFormModal } from '../components/admin/CarFormModal';
import { ToastContainer } from '../components/admin/ToastContainer';

interface AdminPageProps {
  onNavigateToClient: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToClient }) => {
  const { addCar, updateCar } = useAdminData();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Modal State for Car Form (Add / Edit)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleOpenAddCarModal = () => {
    setEditingCar(null);
    setIsCarModalOpen(true);
  };

  const handleOpenEditCarModal = (car: Car) => {
    setEditingCar(car);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (carData: Omit<Car, 'id'> | Partial<Car>): Promise<{ success: boolean; error?: string }> => {
    if (editingCar) {
      return await updateCar(editingCar.id, carData);
    } else {
      const res = await addCar(carData as Omit<Car, 'id'>);
      return { success: res.success, error: res.error };
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col lg:flex-row font-sans">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExitAdmin={onNavigateToClient}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#07070a]">
        <AdminHeader activeTab={activeTab} onExitAdmin={onNavigateToClient} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  onNavigateToCars={() => setActiveTab('cars')}
                  onNavigateToBookings={() => setActiveTab('bookings')}
                  onOpenAddCarModal={handleOpenAddCarModal}
                />
              )}

              {activeTab === 'cars' && (
                <CarManagement
                  onOpenAddModal={handleOpenAddCarModal}
                  onOpenEditModal={handleOpenEditCarModal}
                />
              )}

              {activeTab === 'bookings' && <BookingsManagement />}

              {activeTab === 'settings' && <AgencySettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Car Form Modal (Add / Edit) */}
      <CarFormModal
        isOpen={isCarModalOpen}
        car={editingCar}
        onSave={handleSaveCar}
        onClose={() => setIsCarModalOpen(false)}
      />
    </div>
  );
};
