import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, Sparkles, X, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { carService } from '../../services/carService';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/currency';
import { AGENCY_DETAILS } from '../../utils/constants';

interface FleetFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedTransmission: string;
  onSelectTransmission: (trans: string) => void;
  selectedFuel: string;
  onSelectFuel: (fuel: string) => void;
  selectedSeats: string;
  onSelectSeats: (seats: string) => void;
  selectedAvailability: string;
  onSelectAvailability: (avail: string) => void;
  maxPriceDZD: number;
  onMaxPriceChange: (val: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  onResetFilters: () => void;
}

export const FleetFilter: React.FC<FleetFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedTransmission,
  onSelectTransmission,
  selectedFuel,
  onSelectFuel,
  selectedSeats,
  onSelectSeats,
  selectedAvailability,
  onSelectAvailability,
  maxPriceDZD,
  onMaxPriceChange,
  searchQuery,
  onSearchChange,
  resultCount,
  onResetFilters,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { currency } = useCurrency();

  const categories = carService.getCategories();
  const fuelTypes = carService.getFuelTypes();

  const rate = AGENCY_DETAILS.exchangeRateEURtoDZD || 273;
  const maxPriceFormatted = formatPrice(maxPriceDZD, Math.round(maxPriceDZD / rate), currency);

  const activeFilterCount = [
    selectedCategory !== 'Toutes',
    selectedTransmission !== 'Toutes',
    selectedFuel !== 'Tous',
    selectedSeats !== 'Toutes',
    selectedAvailability !== 'Toutes',
    maxPriceDZD < 50000,
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="bg-[#0e0e14]/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#ff2e4d]" />
          <input
            type="text"
            placeholder="Recherche instantanée (ex: G63, AMG, Porsche, Essence)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[#161620] border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ff2e4d] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Toggle Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 whitespace-nowrap ${
              isAdvancedOpen || activeFilterCount > 0
                ? 'bg-[#ff2e4d]/20 border-[#ff2e4d] text-white shadow-[0_0_15px_rgba(255,46,77,0.3)]'
                : 'bg-[#161620] border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#ff2e4d]" />
            <span>Filtres Avancés</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#ff2e4d] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              title="Réinitialiser les filtres"
              className="p-3 bg-[#161620] hover:bg-[#20202e] text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/10 pt-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff2e4d] to-[#d60029] text-white shadow-[0_0_15px_rgba(255,46,77,0.4)] border border-[#ff2e4d]/50 scale-102'
                  : 'bg-[#14141c] text-gray-300 hover:text-white hover:bg-[#1f1f2a] border border-white/5'
              }`}
            >
              {isActive && <Sparkles className="w-3.5 h-3.5 text-white" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Collapsible Drawer */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 pt-4 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Transmission Filter */}
              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Boîte de Vitesse
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#14141c] p-1 rounded-xl border border-white/5">
                  {['Toutes', 'Automatique', 'Manuelle'].map((t) => (
                    <button
                      key={t}
                      onClick={() => onSelectTransmission(t)}
                      className={`py-1.5 text-center font-medium rounded-lg transition-all ${
                        selectedTransmission === t
                          ? 'bg-[#ff2e4d] text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t === 'Automatique' ? 'Auto' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Filter */}
              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Motorisation
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => onSelectFuel(e.target.value)}
                  className="w-full bg-[#14141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                >
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats Filter */}
              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Capacité (Places)
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#14141c] p-1 rounded-xl border border-white/5">
                  {['Toutes', '2-4 Places', '5+ Places'].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectSeats(s)}
                      className={`py-1.5 text-center font-medium rounded-lg transition-all ${
                        selectedSeats === s
                          ? 'bg-[#ff2e4d] text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Statut Disponibilité
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => onSelectAvailability(e.target.value)}
                  className="w-full bg-[#14141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                >
                  <option value="Toutes">Tous les véhicules</option>
                  <option value="Disponible uniquement">Disponible immédiatement</option>
                  <option value="Sur Réservation / Loué">Actuellement loué / sur réservation</option>
                </select>
              </div>
            </div>

            {/* Price Slider Bar */}
            <div className="bg-[#14141c] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-300 uppercase tracking-wider text-[10px]">
                  Budget max par jour :
                </span>
                <span className="text-sm font-black text-[#ff2e4d] font-serif">
                  {maxPriceFormatted}
                </span>
              </div>
              <input
                type="range"
                min={15000}
                max={50000}
                step={1000}
                value={maxPriceDZD}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full accent-[#ff2e4d] bg-gray-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>15 000 DZD (Éco Premium)</span>
                <span>50 000 DZD (Supercar G63)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count Counter & Active Filter Summary */}
      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-3">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white font-serif">{resultCount}</span>
          <span>véhicules correspondent à votre sélection</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-[#ff2e4d] hover:underline text-[11px] font-semibold"
          >
            Effacer tous les filtres
          </button>
        )}
      </div>
    </div>
  );
};
