import React from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { TLEMCEN_LOCATIONS } from '../../utils/constants';

interface QuickSearchBoxProps {
  onSearchSubmit: () => void;
}

export const QuickSearchBox: React.FC<QuickSearchBoxProps> = ({ onSearchSubmit }) => {
  const { searchState, setSearchState } = useBooking();
  const { settings } = useSettings();
  const locations = settings.locations && settings.locations.length > 0 ? settings.locations : TLEMCEN_LOCATIONS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="w-full bg-[#0c0c12]/90 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative z-20">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Lieu de Prise en charge */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-[#ff2e4d] mr-1" />
            Lieu de Départ
          </label>
          <div className="relative">
            <select
              value={searchState.pickupLocation}
              onChange={(e) =>
                setSearchState({ ...searchState, pickupLocation: e.target.value })
              }
              className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#ff2e4d] appearance-none cursor-pointer transition-colors"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name} className="bg-[#121218] text-white">
                  {loc.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </div>

        {/* Lieu de Restitution */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-[#ff2e4d] mr-1" />
            Lieu de Retour
          </label>
          <div className="relative">
            <select
              value={searchState.returnLocation}
              onChange={(e) =>
                setSearchState({ ...searchState, returnLocation: e.target.value })
              }
              className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#ff2e4d] appearance-none cursor-pointer transition-colors"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name} className="bg-[#121218] text-white">
                  {loc.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </div>

        {/* Date Début */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center">
            <Calendar className="w-3.5 h-3.5 text-[#ff2e4d] mr-1" />
            Date de Début
          </label>
          <input
            type="date"
            value={searchState.pickupDate}
            onChange={(e) =>
              setSearchState({ ...searchState, pickupDate: e.target.value })
            }
            className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#ff2e4d] cursor-pointer"
          />
        </div>

        {/* Date Fin */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center">
            <Calendar className="w-3.5 h-3.5 text-[#ff2e4d] mr-1" />
            Date de Fin
          </label>
          <input
            type="date"
            value={searchState.returnDate}
            onChange={(e) =>
              setSearchState({ ...searchState, returnDate: e.target.value })
            }
            className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#ff2e4d] cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold rounded-xl shadow-[0_0_25px_rgba(255,46,77,0.4)] hover:shadow-[0_0_35px_rgba(255,46,77,0.7)] transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <Search className="w-4 h-4" />
            <span>Chercher un Véhicule</span>
          </button>
        </div>
      </form>
    </div>
  );
};
