import React from 'react';
import { motion } from 'motion/react';
import { Car, CheckCircle2, Clock, Calendar, DollarSign, TrendingUp, Plus, ArrowUpRight, Sparkles, User, ShieldCheck, MapPin } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/currency';

interface DashboardOverviewProps {
  onNavigateToCars: () => void;
  onNavigateToBookings: () => void;
  onOpenAddCarModal: () => void;
  onNavigateToSpots?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToCars,
  onNavigateToBookings,
  onOpenAddCarModal,
  onNavigateToSpots,
}) => {
  const { cars, bookings, spots } = useAdminData();
  const { currency } = useCurrency();

  // Metrics calculations
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.available).length;
  const rentedCars = cars.filter((c) => !c.available).length;
  const todayBookings = bookings.filter((b) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return b.createdAt.startsWith(todayStr) || b.pickupDate === todayStr;
  }).length;

  // Revenue forecast (Sum of confirmed / active booking prices)
  const totalRevenueDZD = bookings
    .filter((b) => b.status !== 'annulee')
    .reduce((acc, b) => {
      if (b.currency === 'EUR') {
        return acc + b.totalPrice * 215;
      }
      return acc + b.totalPrice;
    }, 0);

  const revenueFormatted = formatPrice(
    totalRevenueDZD,
    Math.round(totalRevenueDZD / 215),
    currency
  );

  const statCards = [
    {
      title: 'Total Véhicules',
      value: totalCars,
      label: 'Dans la flotte VIP',
      icon: Car,
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
      action: onNavigateToCars,
    },
    {
      title: 'Voitures Disponibles',
      value: availableCars,
      label: `${Math.round((availableCars / (totalCars || 1)) * 100)}% prêts à louer`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      action: onNavigateToCars,
    },
    {
      title: 'Voitures Louées',
      value: rentedCars,
      label: 'Actuellement en circulation',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      action: onNavigateToCars,
    },
    {
      title: 'Réservations du Jour',
      value: todayBookings,
      label: `${bookings.length} au total enregistrées`,
      icon: Calendar,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      action: onNavigateToBookings,
    },
    {
      title: 'Chiffre d\'Affaires Prévu',
      value: revenueFormatted,
      label: 'Revenus des réservations actives',
      icon: DollarSign,
      color: 'from-[#ff2e4d]/20 to-[#ff2e4d]/5 text-[#ff2e4d] border-[#ff2e4d]/30',
      isRevenue: true,
      action: onNavigateToBookings,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#12121d] via-[#171726] to-[#0e0e14] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-[#ff2e4d]/20 text-[#ff2e4d] text-[10px] font-bold uppercase tracking-wider border border-[#ff2e4d]/30">
              Aperçu en Temps Réel
            </span>
            <span className="text-xs text-gray-400">• Tlemcen, Algérie</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 font-serif">
            Tableau de Bord & Performance
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Gérez votre parc automobile de prestige, vos réservations et vos revenus.
          </p>
        </div>

        <button
          onClick={onOpenAddCarModal}
          className="px-5 py-3 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Véhicule</span>
        </button>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={card.action}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${card.color} hover:border-[#ff2e4d]/50 transition-all cursor-pointer shadow-xl group relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-black/40 backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className={`font-black font-serif text-white mb-1 ${card.isRevenue ? 'text-xl' : 'text-3xl'}`}>
                {card.value}
              </div>

              <div className="text-[11px] text-gray-400 font-light flex items-center justify-between">
                <span>{card.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fleet Quick Status Bar & Recent Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Bookings Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white font-serif">Réservations Récentes</h3>
              <p className="text-xs text-gray-400">Demandes de location et réservations clients</p>
            </div>
            <button
              onClick={onNavigateToBookings}
              className="text-xs font-bold text-[#ff2e4d] hover:underline flex items-center"
            >
              <span>Tout voir ({bookings.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => {
              const car = cars.find((c) => c.id === booking.carId);
              const isPending = booking.status === 'en_attente';

              return (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl bg-[#14141e] border border-white/5 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={booking.carImage || car?.image || 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop'}
                      alt={booking.carName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-10 object-cover rounded-lg border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{booking.carName}</div>
                      <div className="text-[11px] text-gray-400 flex items-center space-x-2 mt-0.5">
                        <User className="w-3 h-3 text-[#ff2e4d]" />
                        <span>{booking.driverInfo.fullName} ({booking.driverInfo.phone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 text-xs">
                    <div>
                      <div className="text-gray-400 text-[10px]">Dates</div>
                      <div className="font-semibold text-white">
                        {booking.pickupDate} → {booking.returnDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                            : booking.status === 'confirmee'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-gray-800 text-gray-400 border-white/10'
                        }`}
                      >
                        {booking.status === 'en_attente'
                          ? 'En attente'
                          : booking.status === 'confirmee'
                          ? 'Confirmée'
                          : booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Fleet Distribution & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fleet Status Breakdown Card */}
          <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-serif">Répartition de la Flotte</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Disponibles</span>
                  <span className="font-bold text-emerald-400">{availableCars} véhicules</span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${(availableCars / (totalCars || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Louées / Réservées</span>
                  <span className="font-bold text-amber-400">{rentedCars} véhicules</span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all"
                    style={{ width: `${(rentedCars / (totalCars || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={onNavigateToCars}
                className="w-full py-2.5 bg-[#161622] hover:bg-[#20202e] text-white font-semibold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-2 transition-colors"
              >
                <Car className="w-4 h-4 text-[#ff2e4d]" />
                <span>Gérer les véhicules ({totalCars})</span>
              </button>

              {onNavigateToSpots && (
                <button
                  onClick={onNavigateToSpots}
                  className="w-full py-2.5 bg-[#161622] hover:bg-[#ff2e4d]/20 text-gray-300 hover:text-white font-semibold text-xs rounded-xl border border-white/10 hover:border-[#ff2e4d]/40 flex items-center justify-center space-x-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#ff2e4d]" />
                  <span>Modifier les lieux « Où Rouler » ({spots.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
