import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, MapPin, PhoneCall, Award, ArrowRight } from 'lucide-react';
import heroCarImg from '../../assets/images/hero_luxury_car_1785318790966.jpg';
import { QuickSearchBox } from '../booking/QuickSearchBox';
import { AGENCY_DETAILS } from '../../utils/constants';
import { useSettings } from '../../context/SettingsContext';

interface HeroProps {
  onNavigateToFleet: () => void;
  onNavigateToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToFleet, onNavigateToServices }) => {
  const { settings } = useSettings();
  const showQuickSearch = settings.general?.showQuickSearch !== false;
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[#07070a]">
      {/* Background Image with luxury vignette and darkness */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCarImg}
          alt="Tlemcen Car Hero Luxury Vehicle"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Multilayer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/50 to-black/60" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#ff2e4d]/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10 my-auto flex flex-col items-center text-center">
        <div className="max-w-3xl space-y-6 flex flex-col items-center">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#ff2e4d]/40 backdrop-blur-md text-xs font-semibold text-[#ff2e4d] shadow-[0_0_20px_rgba(255,46,77,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff2e4d]" />
            <span>L’Excellence de la Location Automobiles à Tlemcen</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-serif tracking-tight text-center"
          >
            Tlemcen-car <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-[#ff667d] to-[#ff2e4d] bg-clip-text text-transparent block sm:inline">
              Prestige & Élégance
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl text-center"
          >
            Découvrez notre parc exclusif de supercars, SUVs et berlines de luxe. Prise en charge rapide à l'<strong>Aéroport Zenata - Messali Hadj</strong> et livraison sur mesure dans toute la wilaya de Tlemcen.
          </motion.p>

          {/* Quick CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={onNavigateToFleet}
              className="px-8 py-4 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold text-sm rounded-xl shadow-[0_0_30px_rgba(255,46,77,0.5)] hover:shadow-[0_0_40px_rgba(255,46,77,0.8)] transition-all duration-300 flex items-center space-x-2"
            >
              <span>Explorer la Flotte</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToServices}
              className="px-6 py-4 bg-[#14141d]/80 hover:bg-[#1d1d2b] border border-white/10 hover:border-white/30 text-white font-semibold text-sm rounded-xl backdrop-blur-md transition-all duration-300"
            >
              Service Chauffeur VIP
            </button>
          </motion.div>
        </div>

        {/* Search Widget (Can be shown or hidden from Admin) */}
        {showQuickSearch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 w-full text-left"
          >
            <QuickSearchBox onSearchSubmit={onNavigateToFleet} />
          </motion.div>
        )}
      </div>

      {/* Stats counter ribbon */}
      <div className="relative z-10 border-t border-white/10 bg-[#09090e]/90 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-serif">
              50<span className="text-[#ff2e4d]">+</span>
            </div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Véhicules de Prestige
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-serif">
              99<span className="text-[#ff2e4d]">%</span>
            </div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Clients Satisfaits
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-serif">
              0<span className="text-[#ff2e4d]"> DA</span>
            </div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Frais Cachés
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-serif">
              24<span className="text-[#ff2e4d]">/7</span>
            </div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Assistance & Aéroport Zenata
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
