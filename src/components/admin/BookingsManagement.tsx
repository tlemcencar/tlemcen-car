import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookingRequest } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/currency';
import { AGENCY_DETAILS } from '../../utils/constants';
import { ConfirmModal } from './ConfirmModal';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  Trash2,
  DollarSign
} from 'lucide-react';
import { getWhatsAppBookingUrl } from '../../utils/whatsapp';

export const BookingsManagement: React.FC = () => {
  const { bookings, updateBookingStatus, deleteBooking, cars } = useAdminData();
  const { currency } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteModalBooking, setDeleteModalBooking] = useState<BookingRequest | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      b.carName.toLowerCase().includes(query) ||
      b.driverInfo.fullName.toLowerCase().includes(query) ||
      b.driverInfo.phone.toLowerCase().includes(query) ||
      b.driverInfo.email.toLowerCase().includes(query) ||
      b.id?.toLowerCase().includes(query);

    const matchStatus = filterStatus === 'all' || b.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center">
            <Calendar className="w-5 h-5 text-[#ff2e4d] mr-2" />
            Gestion des Réservations Client ({bookings.length})
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Consultez et validez les demandes de réservation reçues.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0e0e14] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par client, téléphone, véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
          />
        </div>

        <div className="flex bg-[#14141e] p-1 rounded-xl border border-white/10 text-xs w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `Toutes (${bookings.length})` },
            { id: 'en_attente', label: `En attente (${bookings.filter((b) => b.status === 'en_attente').length})` },
            { id: 'confirmee', label: `Confirmées (${bookings.filter((b) => b.status === 'confirmee').length})` },
            { id: 'terminee', label: `Terminées (${bookings.filter((b) => b.status === 'terminee').length})` },
            { id: 'annulee', label: `Annulées (${bookings.filter((b) => b.status === 'annulee').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.id ? 'bg-[#ff2e4d] text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const car = cars.find((c) => c.id === b.carId);
          const rate = AGENCY_DETAILS.exchangeRateEURtoDZD || 273;
          const priceFormatted = formatPrice(
            b.currency === 'DZD' ? b.totalPrice : b.totalPrice * rate,
            b.currency === 'EUR' ? b.totalPrice : Math.round(b.totalPrice / rate),
            currency
          );

          // WhatsApp direct client reply message
          const clientWhatsappMsg = `Bonjour ${b.driverInfo.fullName}, concernant votre réservation de la ${b.carName} du ${b.pickupDate} au ${b.returnDate} chez Tlemcen Car.`;
          const whatsappClientUrl = `https://wa.me/${b.driverInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(clientWhatsappMsg)}`;

          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0e0e14] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-4 hover:border-white/20 transition-all"
            >
              {/* Top Row: Ref, Vehicle, Status */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={b.carImage || car?.image || 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop'}
                    alt={b.carName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 object-cover rounded-xl border border-white/10"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#ff2e4d]">{b.id}</span>
                      <span className="text-[10px] text-gray-400">• Créé le {new Date(b.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-serif">{b.carName}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b.id!, e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                      b.status === 'en_attente'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : b.status === 'confirmee'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : b.status === 'terminee'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    <option value="en_attente" className="bg-[#0e0e14] text-amber-300">⏳ En Attente</option>
                    <option value="confirmee" className="bg-[#0e0e14] text-emerald-400">✓ Confirmée</option>
                    <option value="terminee" className="bg-[#0e0e14] text-blue-300">🏁 Terminée</option>
                    <option value="annulee" className="bg-[#0e0e14] text-red-400">✕ Annulée</option>
                  </select>

                  <button
                    onClick={() => setDeleteModalBooking(b)}
                    className="p-2 bg-[#181824] hover:bg-[#ff2e4d] text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors"
                    title="Supprimer la réservation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid Content: Driver Info, Dates, Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Driver Info */}
                <div className="bg-[#14141e] p-4 rounded-xl border border-white/5 space-y-2">
                  <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[10px] flex items-center text-[#ff2e4d]">
                    <User className="w-3.5 h-3.5 mr-1" />
                    Conducteur Principal
                  </h4>
                  <div className="font-bold text-white text-sm">{b.driverInfo.fullName}</div>
                  <div className="text-gray-300 space-y-1 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                      <a href={`tel:${b.driverInfo.phone}`} className="hover:text-[#ff2e4d]">
                        {b.driverInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{b.driverInfo.email}</span>
                    </div>
                    <div className="text-gray-400 pt-1">
                      Permis: <span className="text-white font-semibold">{b.driverInfo.driverLicenseNumber}</span> | CNI/Pass: <span className="text-white font-semibold">{b.driverInfo.passportOrId}</span>
                    </div>
                  </div>
                </div>

                {/* Dates & Pickup Location */}
                <div className="bg-[#14141e] p-4 rounded-xl border border-white/5 space-y-2">
                  <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[10px] flex items-center text-[#ff2e4d]">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    Lieu & Dates de Restitution
                  </h4>
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div>
                      Prise: <span className="font-bold text-white">{b.pickupDate} à {b.pickupTime}</span>
                    </div>
                    <div>
                      Retour: <span className="font-bold text-white">{b.returnDate} à {b.returnTime}</span> ({b.totalDays} jours)
                    </div>
                    <div className="text-gray-400 pt-1 truncate">
                      Lieu: <span className="text-white">{b.pickupLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Quick Contact */}
                <div className="bg-[#14141e] p-4 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[10px] flex items-center text-[#ff2e4d]">
                      <DollarSign className="w-3.5 h-3.5 mr-1" />
                      Total & Règlement
                    </h4>
                    <div className="text-xl font-black text-white font-serif mt-1">{priceFormatted}</div>
                    <div className="text-[11px] text-gray-400">Caution: {b.depositAmount} {b.currency}</div>
                  </div>

                  <a
                    href={whatsappClientUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white font-bold text-xs rounded-xl border border-[#25D366]/40 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current stroke-none" />
                    <span>Contacter le client sur WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Special Requests */}
              {b.driverInfo.specialRequests && (
                <div className="bg-[#12121c] p-3 rounded-xl border border-white/5 text-xs text-amber-300">
                  <span className="font-bold text-amber-400">Demande particulière :</span> "{b.driverInfo.specialRequests}"
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="text-center py-16 bg-[#0e0e14] rounded-2xl border border-white/10 space-y-3">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Aucune réservation trouvée</h3>
            <p className="text-xs text-gray-400">Les demandes envoyées par les clients apparaîtront ici.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteModalBooking}
        title="Supprimer la Réservation ?"
        message={`Voulez-vous vraiment supprimer la réservation ${deleteModalBooking?.id} de ${deleteModalBooking?.driverInfo.fullName} ?`}
        confirmLabel="Oui, Supprimer"
        onConfirm={() => {
          if (deleteModalBooking?.id) {
            deleteBooking(deleteModalBooking.id);
            setDeleteModalBooking(null);
          }
        }}
        onCancel={() => setDeleteModalBooking(null)}
      />
    </div>
  );
};
