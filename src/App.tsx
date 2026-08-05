import React, { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { SettingsProvider } from './context/SettingsContext';
import { BookingProvider } from './context/BookingContext';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { BookingModal } from './components/booking/BookingModal';
import { Home } from './pages/Home';
import { Fleet } from './pages/Fleet';
import { CarDetails } from './pages/CarDetails';
import { Services } from './pages/Services';
import { Reviews } from './pages/Reviews';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { Privacy } from './pages/Privacy';
import { AdminPage } from './pages/Admin';
import { Car } from './types';

import { ReservationFrame } from './components/booking/ReservationFrame';

export function AppContent() {
  const { cars } = useAdminData();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedDetailCar, setSelectedDetailCar] = useState<Car | null>(cars[0] || null);

  const isEmbed = typeof window !== 'undefined' && (
    window.location.search.includes('embed=true') ||
    window.location.pathname.includes('/embed')
  );

  const urlCarId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('carId')
    : null;

  useEffect(() => {
    // Check path or hash for /admin or #admin routing
    if (
      window.location.pathname.includes('/admin') ||
      window.location.hash.includes('admin')
    ) {
      setCurrentPage('admin');
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCarDetails = (car: Car) => {
    setSelectedDetailCar(car);
    setCurrentPage('car-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return <AdminPage onNavigateToClient={() => handleNavigate('home')} />;
  }

  if (isEmbed) {
    const carToEmbed = urlCarId
      ? cars.find((c) => c.carId === urlCarId || c.id === urlCarId) || cars[0]
      : cars[0];

    return (
      <div className="min-h-screen bg-[#07070a] text-white p-4 flex flex-col justify-center selection:bg-[#ff2e4d]">
        <ReservationFrame
          reservationUrl={carToEmbed?.reservationUrl}
          carId={carToEmbed?.carId || carToEmbed?.id || urlCarId || undefined}
          reserveButtonText="Réserver ce véhicule"
        />
        <BookingModal onNavigateToFleet={() => handleNavigate('fleet')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col font-sans selection:bg-[#ff2e4d] selection:text-white">
      {/* Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Page Routing rendering */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectCar={(car) => setSelectedDetailCar(car)}
            onViewCarDetails={handleViewCarDetails}
          />
        )}

        {currentPage === 'fleet' && (
          <Fleet
            onSelectCar={(car) => setSelectedDetailCar(car)}
            onViewCarDetails={handleViewCarDetails}
          />
        )}

        {currentPage === 'car-details' && (selectedDetailCar || cars[0]) && (
          <CarDetails
            car={selectedDetailCar || cars[0]}
            onBack={() => handleNavigate('fleet')}
          />
        )}

        {currentPage === 'services' && (
          <Services
            onNavigateToFleet={() => handleNavigate('fleet')}
            onNavigateToContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'reviews' && <Reviews />}

        {currentPage === 'faq' && <FAQ />}

        {currentPage === 'contact' && <Contact />}

        {currentPage === 'legal' && <Legal />}

        {currentPage === 'privacy' && <Privacy />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Global Interactive Booking Modal */}
      <BookingModal onNavigateToFleet={() => handleNavigate('fleet')} />
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <SettingsProvider>
        <AdminDataProvider>
          <BookingProvider>
            <AppContent />
          </BookingProvider>
        </AdminDataProvider>
      </SettingsProvider>
    </CurrencyProvider>
  );
}
