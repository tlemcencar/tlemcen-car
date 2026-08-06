import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Star, ArrowLeft, ArrowRight, Image as ImageIcon, Link as LinkIcon, Upload } from 'lucide-react';

interface ImageManagerProps {
  primaryImage: string;
  gallery: string[];
  onChangePrimary: (url: string) => void;
  onChangeGallery: (urls: string[]) => void;
}

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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
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

export const ImageManager: React.FC<ImageManagerProps> = ({
  primaryImage,
  gallery,
  onChangePrimary,
  onChangeGallery,
}) => {
  const [newUrlInput, setNewUrlInput] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);

  // Ensure primary image is included in gallery array
  const allImages = Array.from(new Set([primaryImage, ...gallery])).filter(Boolean);

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;

    const url = newUrlInput.trim();
    if (!allImages.includes(url)) {
      const updated = [...allImages, url];
      onChangeGallery(updated);
      if (!primaryImage) {
        onChangePrimary(url);
      }
    }
    setNewUrlInput('');
    setShowUrlForm(false);
  };

  const handleSimulatedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const compressedDataUrls = await Promise.all(
      fileList.map((file) => processAndCompressFile(file))
    );

    const validUrls = compressedDataUrls.filter(Boolean);
    if (validUrls.length === 0) return;

    const updated = Array.from(new Set([...allImages, ...validUrls]));
    onChangeGallery(updated);
    if (!primaryImage && validUrls.length > 0) {
      onChangePrimary(validUrls[0]);
    }
  };

  const handleDeleteImage = (url: string) => {
    const updated = allImages.filter((img) => img !== url);
    onChangeGallery(updated);
    if (primaryImage === url) {
      onChangePrimary(updated[0] || '');
    }
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (
      (direction === 'left' && index === 0) ||
      (direction === 'right' && index === allImages.length - 1)
    ) {
      return;
    }

    const newArr = [...allImages];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;

    onChangeGallery(newArr);
  };

  return (
    <div className="space-y-4 bg-[#12121c] p-5 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center">
            <ImageIcon className="w-4 h-4 text-[#ff2e4d] mr-2" />
            Galerie Photos ({allImages.length})
          </h4>
          <p className="text-xs text-gray-400">
            Cliquez sur l'étoile pour définir la photo principale.
          </p>
        </div>

        <div className="flex space-x-2">
          {/* File Upload Button */}
          <label className="cursor-pointer px-3 py-1.5 bg-[#1f1f2e] hover:bg-[#2a2a3e] text-gray-200 text-xs font-semibold rounded-xl border border-white/10 flex items-center space-x-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#ff2e4d]" />
            <span>Téléverser</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSimulatedFileUpload}
              className="hidden"
            />
          </label>

          {/* URL Input Toggle Button */}
          <button
            type="button"
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="px-3 py-1.5 bg-[#ff2e4d]/20 hover:bg-[#ff2e4d] text-white text-xs font-semibold rounded-xl border border-[#ff2e4d]/40 flex items-center space-x-1.5 transition-all"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Ajouter URL</span>
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlForm && (
        <form onSubmit={handleAddUrl} className="flex gap-2">
          <input
            type="url"
            placeholder="Coller l'URL de l'image (ex: https://images.unsplash.com/...)"
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#181824] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#ff2e4d] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#e60026]"
          >
            Ajouter
          </button>
        </form>
      )}

      {/* Photos Grid & Thumbnails */}
      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allImages.map((url, idx) => {
            const isPrimary = primaryImage === url;

            return (
              <div
                key={idx}
                className={`relative group h-32 rounded-xl overflow-hidden border-2 bg-[#0a0a0f] transition-all ${
                  isPrimary
                    ? 'border-[#ff2e4d] shadow-[0_0_15px_rgba(255,46,77,0.4)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={url}
                  alt={`Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#ff2e4d] text-white text-[10px] font-bold uppercase rounded-md shadow-md flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Couverture</span>
                  </div>
                )}

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    {!isPrimary ? (
                      <button
                        type="button"
                        onClick={() => onChangePrimary(url)}
                        className="p-1.5 bg-black/80 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg transition-colors"
                        title="Définir comme photo de couverture"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="p-1.5 bg-black/80 hover:bg-[#ff2e4d] text-gray-300 hover:text-white rounded-lg transition-colors"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex justify-center space-x-2">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'left')}
                        className="p-1 bg-black/80 hover:bg-white/20 text-white rounded-md"
                        title="Déplacer vers la gauche"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < allImages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'right')}
                        className="p-1 bg-black/80 hover:bg-white/20 text-white rounded-md"
                        title="Déplacer vers la droite"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-gray-400 border border-dashed border-white/10 rounded-xl">
          Aucune photo ajoutée. Téléversez des photos ou coller une URL d'image.
        </div>
      )}
    </div>
  );
};
