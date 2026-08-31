import React from 'react';
import { motion } from 'motion/react';
import { Fuel, Gauge, Users, Zap, ShieldAlert, ArrowRight, Star, CheckCircle2, PhoneCall, Clock, Lock } from 'lucide-react';
import { Car } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/currency';
import { useBooking } from '../../context/BookingContext';
import { CarPhotoSlider } from './CarPhotoSlider';
import { getWhatsAppBookingUrl } from '../../utils/whatsapp';

interface CarCardProps {
  car: Car;
  onSelectCar: (car: Car) => void;
  onViewDetails?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onSelectCar, onViewDetails }) => {
  const { currency } = useCurrency();
  const { settings } = useSettings();
  const { openBookingModal } = useBooking();

  const priceFormatted = formatPrice(car.priceDZD, car.priceEUR, currency);
  const depositFormatted = formatPrice(car.depositDZD, car.depositEUR, currency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-[#0e0e14]/95 backdrop-blur-md rounded-2xl border-[1.5px] border-[#ff2e4d] overflow-hidden transition-all duration-500 shadow-[0_0_16px_rgba(255,46,77,0.32)] hover:shadow-[0_0_28px_rgba(255,46,77,0.55)] flex flex-col justify-between"
    >
      {/* Upper Photo Carousel Section */}
      <div className="relative">
        <CarPhotoSlider
          images={car.gallery && car.gallery.length > 0 ? car.gallery : [car.image]}
          title={car.name}
          aspectRatio="h-64"
        />

        {/* Category & Prestige Badges top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none z-10">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-[#ff2e4d] text-white shadow-[0_0_12px_rgba(255,46,77,0.6)]">
            {car.category}
          </span>
          {car.featured && (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-400/30 flex items-center">
              <Star className="w-3 h-3 mr-1 fill-amber-400" />
              Prestige
            </span>
          )}
        </div>

        {/* Availability Badge top right */}
        <div className="absolute top-3 right-12 z-10 pointer-events-none">
          {car.available ? (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
              Disponible
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <Clock className="w-3 h-3 mr-1 text-amber-400" />
              En Location
            </span>
          )}
        </div>

        {/* Engine Specs Pill bottom left */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs text-gray-300">
          <Zap className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
          <span>{car.powerHP} CH • {car.acceleration}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400">
              {car.brand} • {car.year}
            </span>
            <div className="flex items-center text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              {car.rating} <span className="text-gray-400 font-normal ml-1">({car.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onViewDetails?.(car)}
            className="text-lg font-black text-white group-hover:text-[#ff2e4d] transition-colors line-clamp-1 cursor-pointer"
          >
            {car.name}
          </h3>

          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {car.description}
          </p>
        </div>

        {/* Key Features Quick Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-xs text-gray-300">
          <div className="flex items-center space-x-1.5 bg-[#14141c] p-2 rounded-xl border border-white/5">
            <Gauge className="w-3.5 h-3.5 text-[#ff2e4d] shrink-0" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#14141c] p-2 rounded-xl border border-white/5">
            <Fuel className="w-3.5 h-3.5 text-[#ff2e4d] shrink-0" />
            <span className="truncate">{car.fuel}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#14141c] p-2 rounded-xl border border-white/5">
            <Users className="w-3.5 h-3.5 text-[#ff2e4d] shrink-0" />
            <span>{car.seats} Places</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tarif par jour</div>
            <div className="text-xl font-black text-white flex items-baseline">
              <span className="text-[#ff2e4d] mr-1 font-serif">{priceFormatted}</span>
            </div>
            <div className="text-[10px] text-gray-400 flex items-center mt-0.5">
              <ShieldAlert className="w-3 h-3 text-gray-400 mr-1 shrink-0" />
              Caution : {depositFormatted}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* WhatsApp Direct Link (Locked when car is unavailable) */}
            {car.available ? (
              <a
                href={getWhatsAppBookingUrl(car, undefined, undefined, currency, settings.whatsapp, settings.name)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Contacter Tlemcen Car pour ${car.name} sur WhatsApp`}
                className="p-2.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-xl border border-[#25D366]/40 transition-all duration-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(37,211,102,0.25)] hover:shadow-[0_0_18px_rgba(37,211,102,0.5)]"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Véhicule en location — WhatsApp verrouillé"
                className="p-2.5 bg-gray-800/60 text-gray-500 rounded-xl border border-white/5 cursor-not-allowed flex items-center justify-center shrink-0 opacity-60"
              >
                <Lock className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {/* Reserve Now */}
            <button
              disabled={!car.available || !car.carId || car.carId.trim() === ''}
              onClick={() => {
                if (car.available && car.carId && car.carId.trim() !== '') {
                  onSelectCar(car);
                  openBookingModal(car);
                }
              }}
              title={
                !car.available
                  ? 'Véhicule actuellement en location'
                  : (!car.carId || car.carId.trim() === '')
                  ? 'Calendrier indisponible'
                  : 'Réserver ce véhicule'
              }
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center whitespace-nowrap ${
                car.available && car.carId && car.carId.trim() !== ''
                  ? 'text-white bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] shadow-[0_0_18px_rgba(255,46,77,0.45)] cursor-pointer'
                  : 'bg-gray-800/80 text-gray-500 border border-white/5 cursor-not-allowed opacity-70'
              }`}
            >
              <span>
                {!car.available
                  ? 'En Location'
                  : (!car.carId || car.carId.trim() === '')
                  ? 'Calendrier indisponible'
                  : 'Réserver'}
              </span>
              {car.available && car.carId && car.carId.trim() !== '' && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
