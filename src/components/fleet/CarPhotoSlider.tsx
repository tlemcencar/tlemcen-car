import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

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
  const [zoomScale, setZoomScale] = useState(1);

  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop'];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    setZoomScale(1);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setZoomScale(1);
  };

  const handleOpenLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale(1);
    setIsLightboxOpen(true);
  };

  // Keyboard navigation & Esc in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setZoomScale(1);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % safeImages.length);
        setZoomScale(1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, safeImages.length]);

  return (
    <div
      onClick={handleOpenLightbox}
      className={`relative ${aspectRatio} w-full overflow-hidden group bg-[#07070a] cursor-zoom-in select-none`}
      title="Cliquer pour zoomer la photo"
    >
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

      {/* Hover Zoom Prompt Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/20 shadow-xl scale-90 group-hover:scale-100">
        <ZoomIn className="w-3.5 h-3.5 text-[#ff2e4d]" />
        <span>Cliquer pour zoomer</span>
      </div>

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
          onClick={handleOpenLightbox}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-white/10"
          title="Agrandir et zoomer"
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
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
              setZoomScale(1);
            }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Top Toolbar */}
            <div
              className="absolute top-5 right-5 z-50 flex items-center space-x-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Zoom Controls */}
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-1 space-x-1">
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.25))}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Dézoomer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-white px-2">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.min(3, z + 0.25))}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Zoomer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs font-semibold px-2.5"
                  title="Réinitialiser le zoom"
                >
                  100%
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomScale(1);
                }}
                className="p-3 rounded-xl bg-white/10 hover:bg-[#ff2e4d] text-white transition-colors border border-white/20"
                title="Fermer (Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Viewer Container */}
            <div
              className="relative max-w-6xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="flex items-center justify-center w-full h-full cursor-pointer"
                onClick={() => setZoomScale((z) => (z === 1 ? 1.75 : 1))}
                title="Cliquer pour basculer le zoom"
              >
                <motion.img
                  key={currentIndex}
                  src={safeImages[currentIndex]}
                  alt={`${title} Full View`}
                  referrerPolicy="no-referrer"
                  animate={{ scale: zoomScale }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] select-none"
                />
              </motion.div>

              {/* Photo Caption */}
              <div className="mt-4 text-center text-white space-y-1 select-none">
                <h4 className="font-bold text-lg font-serif">{title}</h4>
                <p className="text-xs text-gray-400">
                  Photo {currentIndex + 1} sur {safeImages.length} • Cliquez sur l'image ou utilisez les boutons pour zoomer
                </p>
              </div>

              {/* Previous / Next Arrows */}
              {safeImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-[#ff2e4d] text-white backdrop-blur-md border border-white/20 transition-all shadow-xl"
                    title="Photo précédente"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-[#ff2e4d] text-white backdrop-blur-md border border-white/20 transition-all shadow-xl"
                    title="Photo suivante"
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
