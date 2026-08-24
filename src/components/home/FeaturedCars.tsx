import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CarCard } from '../fleet/CarCard';
import { Car } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface FeaturedCarsProps {
  onSelectCar: (car: Car) => void;
  onViewDetails: (car: Car) => void;
  onViewAllFleet?: () => void;
}

export const FeaturedCars: React.FC<FeaturedCarsProps> = ({
  onSelectCar,
  onViewDetails,
}) => {
  const { cars } = useAdminData();

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
              <span>Flotte Automobile & Gamme Exclusive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
              Nos Véhicules Disponibles
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Découvrez l'ensemble de notre flotte de véhicules à Tlemcen. Réservez en ligne rapidement avec prise en charge sur mesure.
            </p>
          </div>
        </div>

        {/* Cars Grid - Display all cars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelectCar={onSelectCar}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

