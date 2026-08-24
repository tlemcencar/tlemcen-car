import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X, Star } from 'lucide-react';

interface CarPhotoSliderProps {
  images: string[];
  title: string;
  category?: string;
  isPrestige?: boolean;
  aspectRatio?: string;
  showLightbox?: boolean;
}

export const CarPhotoSlider: React.FC<CarPhotoSliderProps> = ({
  images,
  title,
  category,
  isPrestige = false,
  aspectRatio = 'h-60',
  showLightbox = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop'];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className={`relative ${aspectRatio} w-full overflow-hidden group bg-[#07070a]`}>
      {/* Main Image Slider with Animation */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={safeImages[currentIndex]}
          alt={`${title} photo ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.8, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </AnimatePresence>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-black/60 pointer-events-none" />

      {/* Slider Nav Buttons (Show on hover or always on touch) */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-[#ff2e4d] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-[#ff2e4d] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-3 z-10 flex space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-4 bg-[#ff2e4d]' : 'w-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Aller à la photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Lightbox Expand Button */}
      {showLightbox && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-white/10"
          title="Agrandir les photos"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-[#ff2e4d] text-white transition-colors z-50 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={safeImages[currentIndex]}
                alt={`${title} Full View`}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl"
              />

              <div className="mt-4 text-center text-white space-y-1">
                <h4 className="font-bold text-lg font-serif">{title}</h4>
                <p className="text-xs text-gray-400">
                  Photo {currentIndex + 1} sur {safeImages.length}
                </p>
              </div>

              {safeImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:-left-6 p-3 rounded-full bg-black/80 hover:bg-[#ff2e4d] text-white backdrop-blur-md border border-white/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:-right-6 p-3 rounded-full bg-black/80 hover:bg-[#ff2e4d] text-white backdrop-blur-md border border-white/20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
