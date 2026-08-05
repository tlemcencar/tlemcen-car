import React from 'react';
import { Bell, ShieldCheck, User, Search, ExternalLink, Sparkles } from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { useAdminData } from '../../context/AdminDataContext';
import { CurrencySelector } from '../common/CurrencySelector';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onExitAdmin: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onExitAdmin }) => {
  const { bookings } = useAdminData();
  const pendingCount = bookings.filter((b) => b.status === 'en_attente').length;

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tableau de Bord & Analytics';
      case 'cars':
        return 'Gestion de la Flotte Automobile';
      case 'bookings':
        return 'Réservations Client & Demandes';
      case 'settings':
        return 'Paramètres de l\'Agence';
      default:
        return 'Administration Tlemcen Car';
    }
  };

  return (
    <header className="bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#ff2e4d]">Espace Agence</span>
          <span className="text-gray-600">•</span>
          <span className="text-[10px] text-gray-400">Tlemcen Luxury Car</span>
        </div>
        <h1 className="text-lg sm:text-xl font-black text-white font-serif mt-0.5">{getTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Currency Switcher */}
        <div className="hidden sm:block">
          <CurrencySelector />
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            className="p-2.5 bg-[#14141e] hover:bg-[#1a1a28] text-gray-300 hover:text-white rounded-xl border border-white/10 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff2e4d] text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_#ff2e4d]">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* User Badge */}
        <div className="hidden md:flex items-center space-x-3 bg-[#14141e] p-1.5 px-3 rounded-xl border border-white/10">
          <div className="w-7 h-7 rounded-lg bg-[#ff2e4d]/20 border border-[#ff2e4d]/30 flex items-center justify-center text-[#ff2e4d]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white leading-none">Admin Tlemcen</div>
            <div className="text-[9px] text-gray-400 leading-none mt-1">Super Utilisateur</div>
          </div>
        </div>

        {/* Exit Admin Button */}
        <button
          onClick={onExitAdmin}
          className="px-3.5 py-2 bg-[#ff2e4d]/20 hover:bg-[#ff2e4d] text-[#ff2e4d] hover:text-white font-bold text-xs rounded-xl border border-[#ff2e4d]/40 flex items-center space-x-1.5 transition-all shadow-md"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quitter</span>
        </button>
      </div>
    </header>
  );
};
