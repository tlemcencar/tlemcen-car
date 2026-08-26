import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  MapPin,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Car as CarIcon,
  CreditCard,
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/currency';
import { bookingService } from '../../services/bookingService';
import { TLEMCEN_LOCATIONS, OPTION_PRICES } from '../../utils/constants';
import { BookingRequest } from '../../types';
import { ReservationFrame } from './ReservationFrame';

interface BookingModalProps {
  onNavigateToFleet?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ onNavigateToFleet }) => {
  const { settings } = useSettings();
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

  const [step, setStep] = useState<'details' | 'driver' | 'confirmation'>('details');
  const [driverInfo, setDriverInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    driverLicenseNumber: '',
    passportOrId: '',
    specialRequests: '',
  });

  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);

  const handleClose = () => {
    closeBookingModal();
    setStep('details');
  };

  const handleBackToFleet = () => {
    closeBookingModal();
    setStep('details');
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

  const handleNextToDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('driver');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: BookingRequest = {
      id: `TC-${Date.now().toString().slice(-6)}`,
      carId: selectedCar.id,
      carName: selectedCar.name,
      carImage: selectedCar.image,
      pickupLocation: searchState.pickupLocation,
      returnLocation: searchState.returnLocation,
      pickupDate: searchState.pickupDate,
      pickupTime: searchState.pickupTime,
      returnDate: searchState.returnDate,
      returnTime: searchState.returnTime,
      options,
      driverInfo,
      totalDays,
      currency,
      totalPrice: priceCalc.currentTotal,
      depositAmount: currency === 'EUR' ? selectedCar.depositEUR : selectedCar.depositDZD,
      status: 'en_attente',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    setSubmittedBooking(newBooking);
    setStep('confirmation');
  };

  const handleOpenWhatsApp = () => {
    if (!submittedBooking) return;
    const msg = bookingService.generateWhatsAppMessage(submittedBooking);
    window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, '_blank');
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
            <div className="flex-1 overflow-y-auto">

          {/* Progress Indicator */}
          <div className="grid grid-cols-3 text-center border-b border-white/10 text-xs font-semibold bg-[#09090d]">
            <div
              className={`py-2.5 transition-colors ${
                step === 'details' ? 'bg-[#ff2e4d]/20 text-[#ff2e4d] border-b-2 border-[#ff2e4d]' : 'text-gray-400'
              }`}
            >
              1. Dates & Options
            </div>
            <div
              className={`py-2.5 transition-colors ${
                step === 'driver' ? 'bg-[#ff2e4d]/20 text-[#ff2e4d] border-b-2 border-[#ff2e4d]' : 'text-gray-400'
              }`}
            >
              2. Informations Conducteur
            </div>
            <div
              className={`py-2.5 transition-colors ${
                step === 'confirmation' ? 'bg-[#ff2e4d]/20 text-[#ff2e4d] border-b-2 border-[#ff2e4d]' : 'text-gray-400'
              }`}
            >
              3. Confirmation VIP
            </div>
          </div>

          {/* Step 1: Dates & Options */}
          {step === 'details' && (
            <form onSubmit={handleNextToDriver} className="p-6 space-y-6">
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
                  <p className="text-xs text-gray-400">
                    Caution exigée à la prise en charge : <span className="text-white font-semibold">{depositFormatted}</span>
                  </p>
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
                    {TLEMCEN_LOCATIONS.map((loc) => (
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
                    {TLEMCEN_LOCATIONS.map((loc) => (
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

              {/* Total Calculation Footer Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-400">Total pour {totalDays} jour(s)</p>
                  <p className="text-2xl font-black text-white">
                    <span className="text-[#ff2e4d]">
                      {currency === 'EUR' ? `${priceCalc.totalEUR} €` : `${priceCalc.totalDZD.toLocaleString()} DA`}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleBackToFleet}
                    className="w-full sm:w-auto px-4 py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md group shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#ff2e4d] group-hover:-translate-x-1 transition-transform" />
                    <span>Retour à la Flotte</span>
                  </button>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                        `Bonjour ${settings.name}, je souhaite réserver la ${selectedCar.name} du ${searchState.pickupDate} au ${searchState.returnDate} (Prise: ${searchState.pickupLocation}). Merci !`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shrink-0"
                    >
                      <MessageSquare className="w-4 h-4 fill-current stroke-none" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="submit"
                      disabled={!selectedCar.carId || selectedCar.carId.trim() === ''}
                      className={`flex-1 sm:flex-none px-6 py-3 font-bold text-sm rounded-xl transition-all ${
                        (selectedCar.carId && selectedCar.carId.trim() !== '')
                          ? 'bg-[#ff2e4d] hover:bg-[#e60026] text-white shadow-[0_0_20px_rgba(255,46,77,0.4)] cursor-pointer'
                          : 'bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {(!selectedCar.carId || selectedCar.carId.trim() === '')
                        ? 'Calendrier indisponible'
                        : 'Continuer en Ligne →'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Step 2: Driver Details */}
          {step === 'driver' && (
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#ff2e4d] pl-3">
                Informations du Conducteur Principal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Nom & Prénom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mohamed Benali"
                    value={driverInfo.fullName}
                    onChange={(e) => setDriverInfo({ ...driverInfo, fullName: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Numéro de Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +213 6 61 23 45 67"
                    value={driverInfo.phone}
                    onChange={(e) => setDriverInfo({ ...driverInfo, phone: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: m.benali@gmail.com"
                    value={driverInfo.email}
                    onChange={(e) => setDriverInfo({ ...driverInfo, email: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">N° Permis de conduire ou Passeport *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 123456789 / DZ"
                    value={driverInfo.passportOrId}
                    onChange={(e) => setDriverInfo({ ...driverInfo, passportOrId: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold">Remarques ou heure d'arrivée de votre vol à Zenata</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Arrivée par le vol AH 1085 à 14h30. Siège enfant orienté dos à la route."
                  value={driverInfo.specialRequests}
                  onChange={(e) => setDriverInfo({ ...driverInfo, specialRequests: e.target.value })}
                  className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-4 py-3 bg-[#1a1a24] hover:bg-[#252535] text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Précédent</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToFleet}
                    className="px-4 py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#ff2e4d]" />
                    <span>Retour à la Flotte</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmer & Obtenir mon devis</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && submittedBooking && (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase px-3 py-1 bg-[#ff2e4d]/20 text-[#ff2e4d] rounded-full border border-[#ff2e4d]/30">
                  Référence : {submittedBooking.id}
                </span>
                <h3 className="text-2xl font-black text-white mt-3">Réservation Pré-Validée !</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                  Merci <strong className="text-white">{submittedBooking.driverInfo.fullName}</strong>. Votre dossier pour la <strong className="text-[#ff2e4d]">{submittedBooking.carName}</strong> a été généré avec succès.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#14141e] p-5 rounded-2xl border border-white/10 text-left text-xs space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Véhicule</span>
                  <span className="text-white font-bold">{submittedBooking.carName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Prise en charge</span>
                  <span className="text-white font-medium">{submittedBooking.pickupDate} ({submittedBooking.pickupLocation})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Restitution</span>
                  <span className="text-white font-medium">{submittedBooking.returnDate} ({submittedBooking.returnLocation})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Montant estimé</span>
                  <span className="text-[#ff2e4d] font-bold text-sm">{submittedBooking.totalPrice} {submittedBooking.currency === 'EUR' ? '€' : 'DA'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Caution (restituée)</span>
                  <span className="text-gray-300 font-semibold">{submittedBooking.depositAmount} {submittedBooking.currency === 'EUR' ? '€' : 'DA'}</span>
                </div>
              </div>

              {/* Call to action */}
              <div className="space-y-3 pt-2 max-w-md mx-auto">
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 fill-white stroke-none" />
                  <span>Envoyer la demande instantanément sur WhatsApp</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 bg-[#181822] hover:bg-[#222230] text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-[#ff2e4d]" />
                    <span>Fermer la fenêtre</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToFleet}
                    className="w-full py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#ff2e4d]" />
                    <span>Retour à la Flotte</span>
                  </button>
                </div>
              </div>
            </div>
          )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
