import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, Sparkles, CheckCircle, X, ArrowLeft } from 'lucide-react';

interface ReservationFrameProps {
  reservationUrl?: string;
  carId?: string;
  className?: string;
  onReserve?: () => void;
  showReserveButton?: boolean;
  reserveButtonText?: string;
  onClose?: () => void;
  onBackToFleet?: () => void;
}

export const ReservationFrame: React.FC<ReservationFrameProps> = ({
  reservationUrl,
  carId,
  className = '',
  onReserve,
  showReserveButton = true,
  reserveButtonText = 'Réserver ce véhicule',
  onClose,
  onBackToFleet,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Compute the target iframe URL specifically for this selected vehicle
  let iframeUrl = '';
  if (reservationUrl && reservationUrl.trim().length > 0) {
    iframeUrl = reservationUrl.trim();
  } else if (carId && carId.trim().length > 0) {
    iframeUrl = `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(carId.trim())}&embed=true&theme=emerald`;
  } else {
    iframeUrl = `https://tlemcen-car.onrender.com/?carId=5a311ed7-cfc0-491f-89c3-aa6f676af4c0&embed=true&theme=emerald`;
  }

  // Reset loading state when the iframe URL changes
  useEffect(() => {
    setIsLoading(true);
  }, [iframeUrl]);

  return (
    <div className={`relative bg-[#0d0d14] rounded-2xl border border-white/10 p-5 space-y-4 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white font-serif flex items-center space-x-2 truncate">
              <span className="truncate">Calendrier de Réservation</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-sans border border-emerald-500/30 shrink-0">
                En ligne
              </span>
            </h3>
            <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-md font-mono">
              URL: {iframeUrl}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] text-emerald-400 font-mono hidden md:inline-flex items-center mr-2">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400 animate-pulse" />
            Mises à jour instantanées
          </span>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le calendrier"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#ff2e4d]/20 hover:bg-[#ff2e4d] text-white border border-[#ff2e4d]/40 shadow-[0_0_12px_rgba(255,46,77,0.3)] transition-all text-xs font-bold uppercase cursor-pointer"
            >
              <span className="hidden sm:inline">Fermer</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Direct iframe container */}
      <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#09090d] min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 bg-[#09090d]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-gray-300 font-medium">Chargement du calendrier en direct...</p>
          </div>
        )}

        <iframe
          key={iframeUrl}
          src={iframeUrl}
          title={`Calendrier de réservation - ${carId || 'véhicule'}`}
          className="w-full h-[520px] border-0 rounded-xl"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          loading="lazy"
        />
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {onBackToFleet && (
          <button
            type="button"
            onClick={onBackToFleet}
            className="w-full sm:w-auto px-5 py-3 bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff2e4d] group-hover:-translate-x-1 transition-transform" />
            <span>Retour à la Flotte</span>
          </button>
        )}

        {showReserveButton && (
          <div className="w-full sm:flex-1">
            <button
              type="button"
              onClick={onReserve}
              className="w-full py-3.5 px-6 font-bold text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{reserveButtonText}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
