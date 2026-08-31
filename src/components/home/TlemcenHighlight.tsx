import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface TlemcenHighlightProps {
  onNavigateToFleet: () => void;
}

export const TlemcenHighlight: React.FC<TlemcenHighlightProps> = ({ onNavigateToFleet }) => {
  const { spots } = useAdminData();

  return (
    <section className="py-20 bg-[#0a0a0e] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/20 inline-block mb-2">
              Explorez la Région de Tlemcen
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
              Où Rouler à Tlemcen ?
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-lg">
              De l'Aéroport Zenata au plateau de Lalla Setti, profitez d'itinéraires mythiques avec nos véhicules d'exception.
            </p>
          </div>

          <button
            onClick={onNavigateToFleet}
            className="mt-4 md:mt-0 text-xs font-bold text-[#ff2e4d] hover:text-white uppercase tracking-wider flex items-center space-x-1"
          >
            <span>Réserver pour votre circuit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spots.map((spot, idx) => (
            <motion.div
              key={spot.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#0f0f16] rounded-2xl overflow-hidden border border-white/10 group hover:border-[#ff2e4d]/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (spot.fallbackImage && target.src !== spot.fallbackImage) {
                      target.src = spot.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f16] via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase bg-black/70 backdrop-blur-md text-[#ff2e4d] rounded-full border border-white/10">
                  {spot.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff2e4d] transition-colors">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {spot.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-300">
                  <span className="flex items-center">
                    <Navigation className="w-3 h-3 text-[#ff2e4d] mr-1" />
                    Conseil :
                  </span>
                  <span className="font-semibold text-white">{spot.recommendedCar}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
