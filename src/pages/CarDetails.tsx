import React from 'react';
import { motion } from 'motion/react';
import { Car } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/currency';
import { useBooking } from '../context/BookingContext';
import { CarPhotoSlider } from '../components/fleet/CarPhotoSlider';
import { ReservationFrame } from '../components/booking/ReservationFrame';
import { getWhatsAppBookingUrl } from '../utils/whatsapp';
import {
  Gauge,
  Fuel,
  Users,
  DoorOpen,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Award,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Clock,
  Lock
} from 'lucide-react';
import { AGENCY_DETAILS } from '../utils/constants';
import { useSettings } from '../context/SettingsContext';

interface CarDetailsProps {
  car: Car;
  onBack: () => void;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ car, onBack }) => {
  const { currency } = useCurrency();
  const { settings } = useSettings();
  const { openBookingModal } = useBooking();

  const priceFormatted = formatPrice(car.priceDZD, car.priceEUR, currency);
  const depositFormatted = formatPrice(car.depositDZD, car.depositEUR, currency);
  const whatsappUrl = getWhatsAppBookingUrl(car, undefined, undefined, currency, settings.whatsapp, settings.name);

  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#ff2e4d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la Flotte</span>
        </motion.button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & Description (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Interactive Photo Slider & Lightbox */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0f]">
              <CarPhotoSlider
                images={car.gallery && car.gallery.length > 0 ? car.gallery : [car.image]}
                title={car.name}
                aspectRatio="h-96 md:h-[420px]"
              />

              {/* Status & Rating Overlays */}
              <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
                <span className="px-3.5 py-1.5 bg-[#ff2e4d] text-white text-xs font-bold uppercase rounded-full shadow-[0_0_15px_rgba(255,46,77,0.6)]">
                  {car.category}
                </span>
                <span className="px-3.5 py-1.5 bg-black/80 backdrop-blur-md text-amber-400 text-xs font-bold rounded-full border border-amber-400/30 flex items-center">
                  <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                  {car.rating} ({car.reviewCount} avis)
                </span>
              </div>

              {/* Availability Badge top right */}
              <div className="absolute top-4 right-12 z-10 pointer-events-none">
                {car.available ? (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                    Disponible Immédiatement
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    En Location
                  </span>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white border-l-3 border-[#ff2e4d] pl-3">
                Présentation & Historique du Véhicule
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Features & Equipment */}
            <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white border-l-3 border-[#ff2e4d] pl-3">
                Équipements & Options VIP Incluses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                {car.features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-2.5 bg-[#14141e] p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff2e4d] shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Specs & Reservation Pricing Box (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-[#0e0e14]/95 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/10 space-y-6 sticky top-28 shadow-2xl">
              <div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-widest">
                  {car.brand} • Modèle {car.year}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-serif">{car.name}</h1>
              </div>

              {/* Price Banner */}
              <div className="bg-gradient-to-r from-[#14141e] to-[#1a1a28] p-4 sm:p-5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Tarif journalier</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#ff2e4d] font-serif">{priceFormatted}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-medium">Caution requise</span>
                  <div className="text-sm font-bold text-white">{depositFormatted}</div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#14141c] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center">
                    <Zap className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
                    Puissance Moteur
                  </div>
                  <div className="font-bold text-white">{car.powerHP} CH ({car.acceleration})</div>
                </div>

                <div className="bg-[#14141c] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center">
                    <Gauge className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
                    Transmission
                  </div>
                  <div className="font-bold text-white">{car.transmission}</div>
                </div>

                <div className="bg-[#14141c] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center">
                    <Fuel className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
                    Motorisation
                  </div>
                  <div className="font-bold text-white">{car.fuel}</div>
                </div>

                <div className="bg-[#14141c] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center">
                    <Users className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
                    Capacité
                  </div>
                  <div className="font-bold text-white">{car.seats} Places • {car.doors} Portes</div>
                </div>
              </div>

              {/* Reservation Calendar Frame */}
              <ReservationFrame
                reservationUrl={car.reservationUrl}
                carId={car.carId || car.id}
                onReserve={() => openBookingModal(car)}
                reserveButtonText="Réserver ce véhicule maintenant"
              />

              {/* Key Guarantees */}
              <div className="space-y-2.5 text-xs text-gray-300 bg-[#12121c] p-4 rounded-xl border border-white/5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Livraison VIP offerte à l'Aéroport Messali Hadj (Zenata)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Assurance Tous Risques & Kilométrage adaptable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nettoyage & Désinfection hygiénique intégrale</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={!car.available}
                  onClick={() => car.available && openBookingModal(car)}
                  className={`w-full py-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    car.available
                      ? 'bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white shadow-[0_0_25px_rgba(255,46,77,0.4)] cursor-pointer'
                      : 'bg-gray-800/80 text-gray-500 border border-white/5 cursor-not-allowed opacity-70'
                  }`}
                >
                  {car.available ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Réserver en Ligne</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span>En Location</span>
                    </>
                  )}
                </button>

                {car.available ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white font-bold text-xs rounded-xl border border-[#25D366]/40 flex items-center justify-center space-x-2 transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                  >
                    <MessageSquare className="w-4 h-4 fill-current stroke-none" />
                    <span>Réserver via WhatsApp Directement</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 bg-gray-800/60 text-gray-500 font-bold text-xs rounded-xl border border-white/5 flex items-center justify-center space-x-2 cursor-not-allowed opacity-70"
                  >
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>WhatsApp Verrouillé (Véhicule en location)</span>
                  </button>
                )}

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 font-semibold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#ff2e4d]" />
                  <span>Appeler notre Concierge ({settings.phoneFormatted || settings.phone})</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
