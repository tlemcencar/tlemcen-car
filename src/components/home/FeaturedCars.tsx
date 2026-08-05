import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { carService } from '../../services/carService';
import { CarCard } from '../fleet/CarCard';
import { Car } from '../../types';

interface FeaturedCarsProps {
  onSelectCar: (car: Car) => void;
  onViewDetails: (car: Car) => void;
  onViewAllFleet: () => void;
}

export const FeaturedCars: React.FC<FeaturedCarsProps> = ({
  onSelectCar,
  onViewDetails,
  onViewAllFleet,
}) => {
  const featuredCars = carService.getFeaturedCars();

  return (
    <section className="py-20 bg-[#09090d] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff2e4d]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#ff2e4d] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Gamme Exclusive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
              Nos Véhicules d'Exception
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              De la puissance mythique du Mercedes G63 AMG au confort d'une Classe S Maybach, sélectionnez le véhicule idéal pour vos trajets à Tlemcen.
            </p>
          </div>

          <button
            onClick={onViewAllFleet}
            className="inline-flex items-center space-x-2 text-sm font-bold text-[#ff2e4d] hover:text-white transition-colors group"
          >
            <span>Voir toute la flotte ({carService.getAllCars().length} modèles)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelectCar={onSelectCar}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAllFleet}
            className="px-8 py-4 bg-[#14141d] hover:bg-[#1f1f2c] border border-white/10 hover:border-[#ff2e4d]/40 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg"
          >
            Explorer le Catalogue Complet →
          </button>
        </div>
      </div>
    </section>
  );
};
