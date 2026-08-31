import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Navigation, 
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { TlemcenSpot } from '../../types';

// Helper to compress and convert file to data URL
const processAndCompressFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => {
        resolve((e.target?.result as string) || '');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const SpotsManagement: React.FC = () => {
  const { spots, updateSpot, addSpot, deleteSpot, resetSpotsToDefault, showToast } = useAdminData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<TlemcenSpot | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    image: string;
    fallbackImage: string;
    recommendedCar: string;
    desc: string;
  }>({
    name: '',
    category: '',
    image: '',
    fallbackImage: '',
    recommendedCar: '',
    desc: '',
  });

  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);

  const openAddModal = () => {
    setEditingSpot(null);
    setFormData({
      name: '',
      category: 'Découverte & Panorama',
      image: '',
      fallbackImage: '',
      recommendedCar: 'Mercedes-AMG G 63 / Range Rover',
      desc: '',
    });
    setUrlInput('');
    setImageLoadError(false);
    setIsModalOpen(true);
  };

  const openEditModal = (spot: TlemcenSpot) => {
    setEditingSpot(spot);
    setFormData({
      name: spot.name,
      category: spot.category,
      image: spot.image,
      fallbackImage: spot.fallbackImage || '',
      recommendedCar: spot.recommendedCar,
      desc: spot.desc,
    });
    setUrlInput(spot.image.startsWith('data:') ? '' : spot.image);
    setImageLoadError(false);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const dataUrl = await processAndCompressFile(file);
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, image: dataUrl }));
        setImageLoadError(false);
        showToast('success', 'Photo chargée', 'La photo a été importée avec succès.');
      }
    } catch (err) {
      showToast('error', 'Erreur chargement', 'Impossible de lire le fichier image.');
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setFormData((prev) => ({ ...prev, image: urlInput.trim() }));
    setImageLoadError(false);
    showToast('info', 'URL appliquée', 'Lien de l\'image mis à jour.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'Champ requis', 'Veuillez saisir un nom pour ce lieu.');
      return;
    }
    if (!formData.image.trim()) {
      showToast('error', 'Photo requise', 'Veuillez ajouter une photo pour ce lieu.');
      return;
    }

    if (editingSpot) {
      await updateSpot(editingSpot.id, formData);
    } else {
      await addSpot(formData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (spot: TlemcenSpot) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${spot.name}" ?`)) {
      await deleteSpot(spot.id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser tous les lieux de Tlemcen à leurs valeurs et photos initiales ?')) {
      resetSpotsToDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f0f16] p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-[#ff2e4d]/10 text-[#ff2e4d] rounded-xl border border-[#ff2e4d]/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-serif">
              Où Rouler à Tlemcen ? (Destinations)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-2 max-w-2xl">
            Personnalisez les photos et les fiches des circuits touristiques affichés sur la page d'accueil. 
            Téléversez vos propres photos depuis votre ordinateur ou collez des liens web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-[#181824] hover:bg-[#222232] text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 flex items-center space-x-2 transition-colors"
            title="Restaurer les lieux d'origine"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden md:inline">Réinitialiser</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#ff2e4d] hover:bg-[#e60026] text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.3)] flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Lieu</span>
          </button>
        </div>
      </div>

      {/* Grid of Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {spots.map((spot, idx) => (
          <div
            key={spot.id || idx}
            className="bg-[#0f0f16] rounded-2xl overflow-hidden border border-white/10 hover:border-[#ff2e4d]/40 transition-all shadow-xl flex flex-col justify-between group"
          >
            {/* Spot Image */}
            <div className="relative h-48 overflow-hidden bg-[#07070a]">
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

              {/* Quick Change Overlay on hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                <button
                  onClick={() => openEditModal(spot)}
                  className="px-3 py-2 bg-[#ff2e4d] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#e60026] flex items-center space-x-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Changer Photo / Infos</span>
                </button>
              </div>
            </div>

            {/* Spot Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#ff2e4d] transition-colors line-clamp-1">
                  {spot.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-3">
                  {spot.desc}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-gray-300">
                  <span className="flex items-center text-gray-400">
                    <Navigation className="w-3 h-3 text-[#ff2e4d] mr-1" />
                    Véhicule conseillé :
                  </span>
                  <span className="font-semibold text-white truncate max-w-[120px]" title={spot.recommendedCar}>
                    {spot.recommendedCar}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(spot)}
                    className="p-2 bg-[#181824] hover:bg-[#ff2e4d]/20 text-gray-300 hover:text-white rounded-lg border border-white/5 hover:border-[#ff2e4d]/30 text-xs flex items-center space-x-1 transition-colors"
                    title="Modifier ce lieu"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#ff2e4d]" />
                    <span className="text-[11px] font-semibold">Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDelete(spot)}
                    className="p-2 bg-[#181824] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-lg border border-white/5 hover:border-rose-500/30 text-xs transition-colors"
                    title="Supprimer ce lieu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Edit or Add Spot */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#101018] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 flex items-center justify-center text-[#ff2e4d]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      {editingSpot ? `Modifier la photo : ${editingSpot.name}` : 'Ajouter un nouveau lieu'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Section « Où Rouler à Tlemcen ? »
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="space-y-6">
                {/* Photo Upload & Preview Section */}
                <div className="bg-[#151522] p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center">
                      <ImageIcon className="w-4 h-4 text-[#ff2e4d] mr-2" />
                      Photo du Lieu (Obligatoire)
                    </label>

                    <div className="flex bg-[#0a0a0f] p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setPhotoMode('upload')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                          photoMode === 'upload'
                            ? 'bg-[#ff2e4d] text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Téléverser fichier
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoMode('url')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                          photoMode === 'url'
                            ? 'bg-[#ff2e4d] text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Lien URL
                      </button>
                    </div>
                  </div>

                  {/* Photo Preview Container */}
                  <div className="relative h-56 rounded-xl overflow-hidden bg-[#0a0a0f] border border-white/10 flex items-center justify-center">
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image}
                          alt="Aperçu du lieu"
                          referrerPolicy="no-referrer"
                          onError={() => setImageLoadError(true)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          Aperçu en direct
                        </span>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-2 text-gray-500">
                        <ImageIcon className="w-10 h-10 mx-auto text-gray-600" />
                        <p className="text-xs">Aucune photo sélectionnée</p>
                      </div>
                    )}
                  </div>

                  {/* Mode Upload File */}
                  {photoMode === 'upload' && (
                    <div className="space-y-2">
                      <label className="cursor-pointer block w-full py-4 px-4 bg-[#1b1b2a] hover:bg-[#232336] text-gray-300 hover:text-white rounded-xl border border-dashed border-white/20 hover:border-[#ff2e4d]/50 text-center transition-all">
                        <Upload className="w-6 h-6 mx-auto text-[#ff2e4d] mb-1" />
                        <span className="text-xs font-bold text-white block">
                          Cliquez pour choisir une photo depuis votre appareil
                        </span>
                        <span className="text-[10px] text-gray-400">
                          JPG, PNG, WebP (Optimisation et compression automatique)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Mode URL */}
                  {photoMode === 'url' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... ou lien web de la photo"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff2e4d]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyUrl}
                          className="px-4 py-2.5 bg-[#ff2e4d] text-white font-bold text-xs rounded-xl shadow hover:bg-[#e60026] shrink-0"
                        >
                          Appliquer
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Collez l'adresse directe d'une image en haute résolution.
                      </p>
                    </div>
                  )}
                </div>

                {/* Spot Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">
                      Nom du Lieu / Circuit
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Plateau Lalla Setti & Hôtel Renaissance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#151522] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">
                      Catégorie / Badge
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Vue Panoramique & Détente VIP"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#151522] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300">
                      Véhicule Recommandé pour ce circuit
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mercedes-AMG G 63 / Range Rover"
                      value={formData.recommendedCar}
                      onChange={(e) => setFormData({ ...formData, recommendedCar: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#151522] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300">
                      Description du spot
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Ex: Survolez la cité de Tlemcen et profitez d'une vue d'exception. Idéal en SUV 4x4 ou Cabriolet."
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#151522] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-[#181824] hover:bg-[#222232] text-gray-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#ff2e4d] hover:bg-[#e60026] text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.3)] flex items-center space-x-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
