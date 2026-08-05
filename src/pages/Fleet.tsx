import React, { useState } from 'react';
import { carService } from '../services/carService';
import { FleetFilter } from '../components/fleet/FleetFilter';
import { CarCard } from '../components/fleet/CarCard';
import { Car } from '../types';
import { Sparkles, Car as CarIcon, HelpCircle } from 'lucide-react';

interface FleetProps {
  onSelectCar: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectCar, onViewCarDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('Toutes');
  const [selectedFuel, setSelectedFuel] = useState<string>('Tous');
  const [selectedSeats, setSelectedSeats] = useState<string>('Toutes');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('Toutes');
  const [maxPriceDZD, setMaxPriceDZD] = useState<number>(50000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const resetFilters = () => {
    setSelectedCategory('Toutes');
    setSelectedTransmission('Toutes');
    setSelectedFuel('Tous');
    setSelectedSeats('Toutes');
    setSelectedAvailability('Toutes');
    setMaxPriceDZD(50000);
    setSearchQuery('');
  };

  const filteredCars = carService.filterCars({
    category: selectedCategory,
    transmission: selectedTransmission,
    fuel: selectedFuel,
    seats: selectedSeats,
    availability: selectedAvailability,
    maxPriceDZD,
    searchQuery,
  });

  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 text-[#ff2e4d] border border-[#ff2e4d]/30 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue Officiel Tlemcen Car</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white font-serif">
            Notre Flotte de Prestige
          </h1>

          <p className="text-sm sm:text-base text-gray-300">
            Chaque véhicule de notre parc fait l'objet d'un soin maniaque et d'une préparation VIP. Réservez en ligne et récupérez votre véhicule à l'Aéroport Messali Hadj / Zenata ou en Agence.
          </p>
        </div>

        {/* Filter Bar */}
        <FleetFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedTransmission={selectedTransmission}
          onSelectTransmission={setSelectedTransmission}
          selectedFuel={selectedFuel}
          onSelectFuel={setSelectedFuel}
          selectedSeats={selectedSeats}
          onSelectSeats={setSelectedSeats}
          selectedAvailability={selectedAvailability}
          onSelectAvailability={setSelectedAvailability}
          maxPriceDZD={maxPriceDZD}
          onMaxPriceChange={setMaxPriceDZD}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredCars.length}
          onResetFilters={resetFilters}
        />

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onSelectCar={onSelectCar}
                onViewDetails={onViewCarDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0e0e14] p-12 rounded-2xl border border-white/10 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 text-[#ff2e4d] mx-auto flex items-center justify-center">
              <CarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Aucun véhicule ne correspond</h3>
            <p className="text-xs text-gray-400">
              Essayez de réinitialiser vos filtres de recherche ou de contacter notre concierge pour une commande personnalisée.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#ff2e4d] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)] hover:bg-[#e60026] transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
