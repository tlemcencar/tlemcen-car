import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car } from '../../types';
import { ImageManager } from './ImageManager';
import { X, Check, Plus, Trash2, Car as CarIcon, Sparkles, Shield, Fuel, Gauge, Users, DollarSign, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface CarFormModalProps {
  isOpen: boolean;
  car: Car | null; // null means adding a new car
  onSave: (carData: Omit<Car, 'id'> | Partial<Car>) => Promise<boolean>;
  onClose: () => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  car,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    carId: '',
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Luxe',
    priceDZD: 25000,
    priceEUR: 110,
    depositDZD: 100000,
    depositEUR: 450,
    image: '',
    gallery: [],
    transmission: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 4,
    powerHP: 350,
    acceleration: '4.5s (0-100 km/h)',
    featured: false,
    available: true,
    nextAvailableDate: '',
    features: ['Climatisation Bi-Zone', 'GPS Navigation 3D', 'Sièges Cuir Chauffants', 'Régulateur Adaptatif'],
    description: '',
    rating: 4.9,
    reviewCount: 12,
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'status' | 'features' | 'images'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsSaving(false);
    setErrorMessage(null);

    if (car) {
      const defaultResUrl = car.reservationUrl || (car.carId || car.id ? `https://tlemcen-car.onrender.com/?carId=${car.carId || car.id}&embed=true&theme=emerald` : '');
      setFormData({
        ...car,
        carId: car.carId || car.id || '',
        reservationUrl: defaultResUrl,
      });
    } else {
      setFormData({
        carId: '',
        reservationUrl: '',
        name: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Luxe',
        priceDZD: 25000,
        priceEUR: 110,
        depositDZD: 100000,
        depositEUR: 450,
        image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'
        ],
        transmission: 'Automatique',
        fuel: 'Essence',
        seats: 5,
        doors: 4,
        powerHP: 350,
        acceleration: '4.5s (0-100 km/h)',
        featured: false,
        available: true,
        nextAvailableDate: '',
        features: ['Climatisation Bi-Zone', 'GPS Navigation 3D', 'Sièges Cuir VIP', 'Système Son Burmester'],
        description: 'Véhicule d\'exception offrant un confort absolu et des performances de premier ordre pour vos déplacements à Tlemcen.',
        rating: 5.0,
        reviewCount: 1,
      });
    }
  }, [car, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || isSaving) return;

    setIsSaving(true);
    setErrorMessage(null);

    const effectiveCarId = formData.carId || (formData as Car).id || 'car-' + Date.now();
    const effectiveReservationUrl = formData.reservationUrl && formData.reservationUrl.trim().length > 0
      ? formData.reservationUrl.trim()
      : `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(effectiveCarId)}&embed=true&theme=emerald`;

    try {
      const success = await onSave({
        ...formData,
        carId: effectiveCarId,
        reservationUrl: effectiveReservationUrl,
      } as Omit<Car, 'id'>);

      if (success) {
        onClose();
      } else {
        setErrorMessage("L'enregistrement dans Supabase a échoué. Veuillez vérifier la console ou l'état de Supabase.");
      }
    } catch (err: any) {
      console.error("Erreur handleSubmit car modal:", err);
      setErrorMessage(err?.message || "Erreur de sauvegarde dans Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    const updated = [...(formData.features || []), newFeatureInput.trim()];
    setFormData((prev) => ({ ...prev, features: updated }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const updated = (formData.features || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0e0e14] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0a0a0f]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff2e4d]/20 border border-[#ff2e4d]/40 flex items-center justify-center text-[#ff2e4d]">
                <CarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {car ? `Modifier : ${car.name}` : 'Ajouter un Nouveau Véhicule'}
                </h3>
                <p className="text-xs text-gray-400">Renseignez toutes les caractéristiques du véhicule</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 bg-[#12121a] px-5 pt-2 text-xs font-semibold scrollbar-none">
            {[
              { id: 'general', label: '1. Informations Générales' },
              { id: 'pricing', label: '2. Tarifs & Caution' },
              { id: 'status', label: '3. Statut & Disponibilité' },
              { id: 'features', label: '4. Équipements & Description' },
              { id: 'images', label: '5. Photos & Galerie' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#ff2e4d] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
            {/* Tab 1: General Info */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-[#12121e] p-3.5 rounded-xl border border-emerald-500/30 space-y-3">
                  <div>
                    <label className="block text-emerald-400 font-bold mb-1 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      URL de Réservation (reservationUrl) *
                    </label>
                    <input
                      type="text"
                      placeholder="ex: https://tlemcen-car.onrender.com/?carId=...&embed=true&theme=emerald"
                      value={formData.reservationUrl || ''}
                      onChange={(e) => setFormData({ ...formData, reservationUrl: e.target.value })}
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      URL spécifique de l'iframe de réservation pour cette voiture. Transmise directement au composant <code>ReservationFrame</code>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      ID Calendrier / Véhicule (carId)
                    </label>
                    <input
                      type="text"
                      placeholder="ex: mercedes-g63-amg"
                      value={formData.carId || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoUrl = val ? `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(val)}&embed=true&theme=emerald` : '';
                        setFormData({
                          ...formData,
                          carId: val,
                          reservationUrl: formData.reservationUrl || autoUrl,
                        });
                      }}
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Nom du Véhicule *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mercedes-AMG G63 V8"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Marque *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mercedes-Benz"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Modèle *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: G63 AMG"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Année *</label>
                  <input
                    type="number"
                    required
                    value={formData.year || 2024}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Catégorie *</label>
                  <select
                    value={formData.category || 'Luxe'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    <option value="Luxe">Luxe</option>
                    <option value="Sport">Sport</option>
                    <option value="SUV">SUV</option>
                    <option value="Berline VIP">Berline VIP</option>
                    <option value="Économique Premium">Économique Premium</option>
                    <option value="Cabriolet">Cabriolet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Boîte de vitesse *</label>
                  <select
                    value={formData.transmission || 'Automatique'}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    <option value="Automatique">Automatique</option>
                    <option value="Manuelle">Manuelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Carburant *</label>
                  <select
                    value={formData.fuel || 'Essence'}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value as any })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Gazole">Gazole</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Puissance (Moteur) *</label>
                  <input
                    type="number"
                    placeholder="ex: 585 CH"
                    value={formData.powerHP || ''}
                    onChange={(e) => setFormData({ ...formData, powerHP: Number(e.target.value) })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Accélération (0-100 km/h)</label>
                  <input
                    type="text"
                    placeholder="ex: 4.5s (0-100 km/h)"
                    value={formData.acceleration || ''}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Places</label>
                    <input
                      type="number"
                      value={formData.seats || 5}
                      onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Portes</label>
                    <input
                      type="number"
                      value={formData.doors || 4}
                      onChange={(e) => setFormData({ ...formData, doors: Number(e.target.value) })}
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Pricing */}
            {activeTab === 'pricing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#12121c] p-4 rounded-xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center text-[#ff2e4d]">
                      Tarif Journalier de Location
                    </h4>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Prix par Jour (DZD) *</label>
                      <input
                        type="number"
                        required
                        value={formData.priceDZD || ''}
                        onChange={(e) => {
                          const dzd = Number(e.target.value);
                          setFormData({
                            ...formData,
                            priceDZD: dzd,
                            priceEUR: Math.round(dzd / 215),
                          });
                        }}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Prix par Jour (EUR €)</label>
                      <input
                        type="number"
                        value={formData.priceEUR || ''}
                        onChange={(e) => setFormData({ ...formData, priceEUR: Number(e.target.value) })}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#12121c] p-4 rounded-xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center text-amber-400">
                      Montant de la Caution
                    </h4>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Caution (DZD) *</label>
                      <input
                        type="number"
                        required
                        value={formData.depositDZD || ''}
                        onChange={(e) => {
                          const dzd = Number(e.target.value);
                          setFormData({
                            ...formData,
                            depositDZD: dzd,
                            depositEUR: Math.round(dzd / 215),
                          });
                        }}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Caution (EUR €)</label>
                      <input
                        type="number"
                        value={formData.depositEUR || ''}
                        onChange={(e) => setFormData({ ...formData, depositEUR: Number(e.target.value) })}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Status & Availability */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="bg-[#12121c] p-5 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-bold text-white text-sm">Statut de Disponibilité</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, available: true, nextAvailableDate: '' })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        formData.available
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-[#161622] border-white/10 text-gray-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-emerald-400">✓ Disponible</div>
                        <div className="text-[11px] text-gray-300 mt-0.5">Véhicule libre pour réservation immédiate</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          available: false,
                          nextAvailableDate: formData.nextAvailableDate || 'Demain à 14:00',
                        })
                      }
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        !formData.available
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-[#161622] border-white/10 text-gray-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-amber-400">⏳ Loué / Sur Réservation</div>
                        <div className="text-[11px] text-gray-300 mt-0.5">Véhicule actuellement en circulation</div>
                      </div>
                    </button>
                  </div>

                  {!formData.available && (
                    <div className="pt-2">
                      <label className="block text-gray-300 font-bold mb-1">
                        Prochaine date / heure de disponibilité
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Demain à 14:00 ou 30 Juillet"
                        value={formData.nextAvailableDate || ''}
                        onChange={(e) => setFormData({ ...formData, nextAvailableDate: e.target.value })}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">Badge Prestige / Vedette</div>
                      <div className="text-gray-400 text-[11px]">Afficher dans les véhicules Vedette de l'Accueil</div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff2e4d]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Features & Description */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Description Complète</label>
                  <textarea
                    rows={4}
                    placeholder="Présentation détaillée du véhicule..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-300 font-bold">Équipements & Options VIP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter un équipement (ex: Toit Panoramique, Caméra 360°...)"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-[#ff2e4d] text-white font-bold rounded-xl hover:bg-[#e60026]"
                    >
                      Ajouter
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(formData.features || []).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#14141e] border border-white/10 rounded-xl text-gray-200 flex items-center space-x-2"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-gray-400 hover:text-[#ff2e4d]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Image Manager */}
            {activeTab === 'images' && (
              <ImageManager
                primaryImage={formData.image || ''}
                gallery={formData.gallery || []}
                onChangePrimary={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                onChangeGallery={(urls) => setFormData((prev) => ({ ...prev, gallery: urls }))}
              />
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center space-x-2 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center bg-[#0a0a0f] p-4 rounded-xl">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1a1a24] hover:bg-[#232332] text-gray-300 font-semibold text-xs rounded-xl border border-white/10 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#ff2e4d] hover:bg-[#e60026] disabled:bg-gray-700 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center space-x-2 transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement dans Supabase...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{car ? 'Enregistrer les Modifications dans Supabase' : 'Créer le Véhicule dans Supabase'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
