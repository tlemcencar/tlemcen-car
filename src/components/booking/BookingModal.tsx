import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Car as CarIcon,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/currency';
import { bookingService } from '../../services/bookingService';
import { TLEMCEN_LOCATIONS } from '../../utils/constants';
import { ReservationFrame } from './ReservationFrame';

interface BookingModalProps {
  onNavigateToFleet?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ onNavigateToFleet }) => {
  const { settings } = useSettings();
  const locations = settings.locations && settings.locations.length > 0 ? settings.locations : TLEMCEN_LOCATIONS;
  const {
    isModalOpen,
    closeBookingModal,
    selectedCar,
    searchState,
    setSearchState,
    options,
    setOptions,
    addBooking,
  } = useBooking();

  const { currency } = useCurrency();

  const handleClose = () => {
    closeBookingModal();
  };

  const handleBackToFleet = () => {
    closeBookingModal();
    if (onNavigateToFleet) {
      onNavigateToFleet();
    }
  };

  if (!isModalOpen || !selectedCar) return null;

  const totalDays = bookingService.calculateTotalDays(
    searchState.pickupDate,
    searchState.returnDate
  );

  const priceCalc = bookingService.calculatePrice(
    selectedCar.priceDZD,
    selectedCar.priceEUR,
    totalDays,
    options,
    currency
  );

  const depositFormatted = formatPrice(
    selectedCar.depositDZD,
    selectedCar.depositEUR,
    currency
  );

  // Helper to format YYYY-MM-DD to DD/MM/YYYY
  const formatFrDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleSendWhatsAppBooking = () => {
    const brand = selectedCar.brand ? selectedCar.brand.trim() : '';
    const name = selectedCar.name ? selectedCar.name.trim() : '';
    const year = selectedCar.year ? `${selectedCar.year}` : '';
    
    // e.g. "Suzuki Swift 2023" or "SWIFT"
    let carFullName = `${brand} ${name} ${year}`.trim().replace(/\s+/g, ' ');
    if (!carFullName) carFullName = selectedCar.name;

    const startDate = formatFrDate(searchState.pickupDate);
    const endDate = formatFrDate(searchState.returnDate);
    const pickupLoc = searchState.pickupLocation || 'Aéroport Tlemcen Zenata (Messali Hadj)';
    const returnLoc = searchState.returnLocation || 'Aéroport Tlemcen Zenata (Messali Hadj)';
    const additionalDriverText = options.additionalDriver ? 'Oui' : 'Non';
    const childSeatText = options.childSeat ? 'Oui' : 'Non';
    const totalFormatted = currency === 'EUR'
      ? `${priceCalc.totalEUR} €`
      : `${priceCalc.totalDZD.toLocaleString('fr-FR')} DA`;

    const message = `Bonjour Tlemcen Car 👋

Je souhaite réserver ce véhicule.

🚗 Véhicule : ${carFullName}
📅 Date de début : ${startDate}
📅 Date de fin : ${endDate}
📍 Lieu de prise : ${pickupLoc}
📍 Lieu de retour : ${returnLoc}
👤 Conducteur additionnel : ${additionalDriverText}
👶 Siège bébé : ${childSeatText}
💰 Total : ${totalFormatted}

Merci de me confirmer la disponibilité et ma réservation.`;

    // Add booking to local state history
    addBooking({
      id: `TC-${Date.now().toString().slice(-6)}`,
      carId: selectedCar.id,
      carName: selectedCar.name,
      carImage: selectedCar.image,
      pickupLocation: pickupLoc,
      returnLocation: returnLoc,
      pickupDate: searchState.pickupDate,
      pickupTime: searchState.pickupTime,
      returnDate: searchState.returnDate,
      returnTime: searchState.returnTime,
      options,
      driverInfo: {
        fullName: 'Client WhatsApp',
        email: '',
        phone: '',
        driverLicenseNumber: '',
        passportOrId: '',
        specialRequests: '',
      },
      totalDays,
      currency,
      totalPrice: priceCalc.currentTotal,
      depositAmount: currency === 'EUR' ? selectedCar.depositEUR : selectedCar.depositDZD,
      status: 'en_attente',
      createdAt: new Date().toISOString(),
    });

    const phone = settings.whatsapp || '213554708866';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence mode="wait">
      {isModalOpen && selectedCar && (
        <motion.div
          key="booking-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            key="booking-modal-content"
            initial={{ opacity: 0, scale: 0.93, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-3xl bg-[#0c0c12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header Bar - Sticky top with close button (X) */}
            <div className="sticky top-0 z-40 bg-[#12121a]/95 backdrop-blur-xl border-b border-white/10 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-lg">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#ff2e4d]/20 border border-[#ff2e4d]/30 flex items-center justify-center text-[#ff2e4d] shrink-0">
                  <CarIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white truncate">Réservation de Prestige</h2>
                  <p className="text-xs text-gray-400 truncate">{selectedCar.name}</p>
                </div>
              </div>

              {/* Top-Right Sticky Close Button (X) */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Fermer la fenêtre de réservation"
                className="flex items-center space-x-2 px-3 sm:px-3.5 py-2 rounded-xl bg-[#ff2e4d]/20 hover:bg-[#ff2e4d] text-white border border-[#ff2e4d]/40 shadow-[0_0_15px_rgba(255,46,77,0.3)] transition-all duration-200 cursor-pointer group active:scale-95 shrink-0"
              >
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">Fermer</span>
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Car Banner Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#14141e] p-4 rounded-xl border border-white/10">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 h-24 object-cover rounded-lg border border-white/10"
                />
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-xs uppercase font-bold text-[#ff2e4d]">
                    {selectedCar.category} • {selectedCar.powerHP} CH
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedCar.name}</h3>
                </div>
              </div>

              {/* Embedded Calendar Reservation Frame */}
              <ReservationFrame
                reservationUrl={selectedCar.reservationUrl}
                carId={selectedCar.carId || selectedCar.id}
                showReserveButton={false}
              />

              {/* Dates & Locations inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Lieu de prise</label>
                  <select
                    value={searchState.pickupLocation}
                    onChange={(e) => setSearchState({ ...searchState, pickupLocation: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Lieu de retour</label>
                  <select
                    value={searchState.returnLocation}
                    onChange={(e) => setSearchState({ ...searchState, returnLocation: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Date de début</label>
                  <input
                    type="date"
                    required
                    value={searchState.pickupDate}
                    onChange={(e) => setSearchState({ ...searchState, pickupDate: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Date de fin</label>
                  <input
                    type="date"
                    required
                    value={searchState.returnDate}
                    onChange={(e) => setSearchState({ ...searchState, returnDate: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              {/* Extra Options Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Options complémentaires
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${options.additionalDriver ? 'bg-[#ff2e4d]/10 border-[#ff2e4d]' : 'bg-[#14141c] border-white/5'}`}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.additionalDriver}
                        onChange={(e) => setOptions({ ...options, additionalDriver: e.target.checked })}
                        className="accent-[#ff2e4d]"
                      />
                      <span className="text-xs text-white font-medium">Conducteur Additionnel</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      GRATUIT
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${options.childSeat ? 'bg-[#ff2e4d]/10 border-[#ff2e4d]' : 'bg-[#14141c] border-white/5'}`}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.childSeat}
                        onChange={(e) => setOptions({ ...options, childSeat: e.target.checked })}
                        className="accent-[#ff2e4d]"
                      />
                      <span className="text-xs text-white font-medium">Siège Bébé Sécurisé</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      GRATUIT
                    </span>
                  </label>
                </div>
              </div>

              {/* Total Calculation & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="shrink-0">
                  <p className="text-xs text-gray-400">Total pour {totalDays} jour(s)</p>
                  <p className="text-2xl font-black text-white">
                    <span className="text-[#ff2e4d]">
                      {currency === 'EUR' ? `${priceCalc.totalEUR} €` : `${priceCalc.totalDZD.toLocaleString()} DA`}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {/* Return to fleet button */}
                  <button
                    type="button"
                    onClick={handleBackToFleet}
                    className="w-full sm:w-auto px-4 py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md group shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#ff2e4d] group-hover:-translate-x-1 transition-transform" />
                    <span>Retour à la Flotte</span>
                  </button>

                  {/* WhatsApp Booking Button */}
                  <button
                    type="button"
                    disabled={!selectedCar.available}
                    onClick={selectedCar.available ? handleSendWhatsAppBooking : undefined}
                    title={!selectedCar.available ? 'Véhicule actuellement en location : envoi WhatsApp verrouillé' : 'Envoyer Ta réservation sur WhatsApp'}
                    className={`w-full sm:w-auto px-5 py-3.5 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 ${
                      selectedCar.available
                        ? 'bg-gradient-to-r from-[#25D366] to-[#1ebe5d] hover:from-[#20ba5a] hover:to-[#17a34e] text-white shadow-[0_0_25px_rgba(37,211,102,0.45)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] cursor-pointer active:scale-[0.98]'
                        : 'bg-gray-800/80 text-gray-500 border border-white/5 cursor-not-allowed opacity-70'
                    }`}
                  >
                    {selectedCar.available ? (
                      <>
                        <span>🟢</span>
                        <span>Envoyer Ta réservation sur WhatsApp</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span>WhatsApp Verrouillé (En Location)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
