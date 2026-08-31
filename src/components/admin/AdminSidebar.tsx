import React from 'react';
import { LayoutDashboard, Car, Calendar, Settings, ExternalLink, ShieldAlert, Sparkles, LogOut, Layers, MapPin } from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onExitAdmin,
}) => {
  const { cars, bookings, settings, spots } = useAdminData();

  const availableCount = cars.filter((c) => c.available).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'en_attente').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'cars',
      label: 'Gestion de la Flotte',
      icon: Car,
      badge: `${availableCount}/${cars.length} dispo`,
    },
    {
      id: 'bookings',
      label: 'Réservations',
      icon: Calendar,
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount} nouvelle(s)` : null,
      badgeColor: 'bg-[#ff2e4d]',
    },
    {
      id: 'spots',
      label: 'Où Rouler (Lieux)',
      icon: MapPin,
      badge: `${spots.length} lieux`,
    },
    {
      id: 'settings',
      label: 'Paramètres Agence',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col justify-between shrink-0 min-h-screen p-4 sm:p-5">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 p-2 bg-[#12121b] rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2e4d] to-[#99001a] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,46,77,0.4)]">
            <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
              <Car className="w-5 h-5 text-[#ff2e4d]" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-white text-base tracking-wider font-serif truncate">
                {settings.name.toUpperCase()}
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-[#ff2e4d]/20 text-[#ff2e4d] border border-[#ff2e4d]/30">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-gray-400 truncate">Panneau de Contrôle Agence</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Navigation Principale
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff2e4d] to-[#d60029] text-white shadow-[0_0_15px_rgba(255,46,77,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-[#151520]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#ff2e4d]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-black/40 text-white'
                        : item.badgeColor
                        ? 'bg-[#ff2e4d] text-white animate-pulse'
                        : 'bg-[#181824] text-gray-300 border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Exit to Public Site */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="bg-[#12121b] p-3 rounded-xl border border-white/5 space-y-1 text-xs">
          <div className="flex items-center text-emerald-400 font-bold space-x-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Serveur Local Synchronisé</span>
          </div>
          <p className="text-[10px] text-gray-400">LocalStorage actif • Aucune coupure</p>
        </div>

        <button
          onClick={onExitAdmin}
          className="w-full py-3 px-4 bg-[#181822] hover:bg-[#ff2e4d]/20 text-gray-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 hover:border-[#ff2e4d]/50 flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4 text-[#ff2e4d]" />
          <span>Voir le Site Public</span>
        </button>
      </div>
    </aside>
  );
};
