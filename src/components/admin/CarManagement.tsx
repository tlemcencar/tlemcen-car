import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/currency';
import { ConfirmModal } from './ConfirmModal';
import {
  Car as CarIcon,
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Power,
  Star,
  Zap,
  Gauge,
  Fuel,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Image as ImageIcon,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface CarManagementProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (car: Car) => void;
}

export const CarManagement: React.FC<CarManagementProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { cars, deleteCar, duplicateCar, toggleCarStatus, reloadCarsFromSupabase } = useAdminData();
  const { currency } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'rented'>('all');
  const [deleteModalCar, setDeleteModalCar] = useState<Car | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await reloadCarsFromSupabase();
    } finally {
      setIsReloading(false);
    }
  };

  // Filter cars based on search and filters
  const filteredCars = cars.filter((car) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      car.name.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.category.toLowerCase().includes(query);

    const matchCategory = filterCategory === 'Toutes' || car.category === filterCategory;

    let matchStatus = true;
    if (filterStatus === 'available') matchStatus = car.available === true;
    if (filterStatus === 'rented') matchStatus = car.available === false;

    return matchSearch && matchCategory && matchStatus;
  });

  const categories = ['Toutes', 'Luxe', 'Sport', 'SUV', 'Berline VIP', 'Économique Premium', 'Cabriolet'];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center">
            <CarIcon className="w-5 h-5 text-[#ff2e4d] mr-2" />
            Gestion du Parc Automobile ({cars.length} Véhicules)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Ajoutez, modifiez, dupliquez ou gérez la disponibilité des voitures de la flotte.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            disabled={isReloading}
            className="px-4 py-3 bg-[#181824] hover:bg-[#222232] text-gray-200 font-semibold text-xs rounded-xl border border-white/10 flex items-center space-x-2 transition-all disabled:opacity-50"
            title="Recharger la liste depuis Supabase"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isReloading ? 'animate-spin' : ''}`} />
            <span>Recharger Supabase</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-5 py-3 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Véhicule</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e0e14] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, marque, modèle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex bg-[#14141e] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'all' ? 'bg-[#ff2e4d] text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Tous ({cars.length})
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'available' ? 'bg-emerald-500 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Disponibles ({cars.filter((c) => c.available).length})
            </button>
            <button
              onClick={() => setFilterStatus('rented')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'rented' ? 'bg-amber-500 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Loués ({cars.filter((c) => !c.available).length})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#14141e] border border-white/10 text-xs text-gray-300 font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#ff2e4d]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Catégorie: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => {
          const priceFormatted = formatPrice(car.priceDZD, car.priceEUR, currency);
          const depositFormatted = formatPrice(car.depositDZD, car.depositEUR, currency);

          return (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0e0e14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#ff2e4d]/40 transition-all"
            >
              <div>
                {/* Photo Thumbnail Header */}
                <div className="relative h-52 w-full overflow-hidden bg-[#0a0a10] flex items-center justify-center">
                  <img
                    src={car.image}
                    alt={car.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#ff2e4d] text-white text-[10px] font-bold uppercase rounded-md shadow-md">
                      {car.category}
                    </span>
                    {car.featured && (
                      <span className="px-2 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase rounded-md shadow-md flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-black" />
                        <span>Vedette</span>
                      </span>
                    )}
                  </div>

                  {/* Toggle Active / Inactive Availability Badge */}
                  <button
                    onClick={() => toggleCarStatus(car.id, !car.available)}
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1.5 shadow-lg backdrop-blur-md transition-all ${
                      car.available
                        ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/40'
                        : 'bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/40'
                    }`}
                    title="Cliquer pour changer le statut"
                  >
                    <Power className="w-3 h-3" />
                    <span>{car.available ? 'Disponible' : 'Loué / Maintenance'}</span>
                  </button>

                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-gray-300 text-[10px] rounded-md backdrop-blur-md flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-gray-400" />
                    <span>{car.gallery?.length || 1} photos</span>
                  </div>
                </div>

                {/* Car Details Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      {car.brand} • Modèle {car.year}
                    </span>
                    <h3 className="text-lg font-bold text-white font-serif truncate mt-0.5">
                      {car.name}
                    </h3>
                  </div>

                  {/* Pricing row */}
                  <div className="flex justify-between items-center bg-[#14141e] p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400">Tarif/jour</span>
                      <div className="font-black text-[#ff2e4d] text-base">{priceFormatted}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400">Caution</span>
                      <div className="font-semibold text-gray-200">{depositFormatted}</div>
                    </div>
                  </div>

                  {/* Specs micro pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                    <div className="flex items-center space-x-1.5 bg-[#12121a] p-2 rounded-lg border border-white/5">
                      <Zap className="w-3.5 h-3.5 text-[#ff2e4d]" />
                      <span className="truncate">{car.powerHP} CH ({car.transmission})</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-[#12121a] p-2 rounded-lg border border-white/5">
                      <Fuel className="w-3.5 h-3.5 text-[#ff2e4d]" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                  </div>

                  {/* reservationUrl Calendar Badge */}
                  <div className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11px] ${
                    car.reservationUrl || car.carId
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span className="font-bold text-white text-[11px]">
                          URL de Réservation
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(car)}
                        className="text-[10px] font-bold underline hover:opacity-80 shrink-0 ml-1 text-emerald-400"
                      >
                        {car.reservationUrl ? 'Modifier URL' : '+ Configurer'}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-gray-300 truncate">
                      {car.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${car.carId || car.id}&embed=true&theme=emerald`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0f] flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenEditModal(car)}
                  className="flex-1 py-2 px-3 bg-[#181824] hover:bg-[#ff2e4d]/20 text-white font-bold text-xs rounded-xl border border-white/10 hover:border-[#ff2e4d]/40 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#ff2e4d]" />
                  <span>Modifier</span>
                </button>

                <button
                  onClick={() => duplicateCar(car.id)}
                  className="p-2 bg-[#181824] hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors"
                  title="Dupliquer ce véhicule"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteModalCar(car)}
                  className="p-2 bg-[#181824] hover:bg-[#ff2e4d] text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors"
                  title="Supprimer ce véhicule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-16 bg-[#0e0e14] rounded-2xl border border-white/10 space-y-3">
          <CarIcon className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Aucun véhicule ne correspond</h3>
          <p className="text-xs text-gray-400">Modifiez votre recherche ou ajoutez un nouveau véhicule à la flotte.</p>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={!!deleteModalCar}
        title="Supprimer le Véhicule ?"
        message={`Êtes-vous sûr de vouloir supprimer définitivement "${deleteModalCar?.name}" de la flotte Tlemcen Car ? Cette action est irréversible.`}
        confirmLabel="Oui, Supprimer"
        cancelLabel="Annuler"
        isDangerous={true}
        onConfirm={async () => {
          if (deleteModalCar) {
            const targetId = deleteModalCar.id;
            setDeleteModalCar(null);
            await deleteCar(targetId);
          }
        }}
        onCancel={() => setDeleteModalCar(null)}
      />
    </div>
  );
};
