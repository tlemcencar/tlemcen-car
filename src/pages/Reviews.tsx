import React from 'react';
import { Star, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { GoogleReviewsWidget } from '../components/common/GoogleReviewsWidget';
import { AGENCY_DETAILS } from '../utils/constants';

export const Reviews: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 inline-block">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Retours d'Expérience Authentiques
            </span>
            <h1 className="text-4xl font-black text-white font-serif">
              Avis Clients Google Maps
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              La satisfaction de nos clients est notre plus grande fierté. Retrouvez ici en direct tous les avis et notes certifiés déposés sur notre fiche Google Maps officielle.
            </p>
          </div>

          {/* Rating Badge & Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-[#14141c] p-4 rounded-2xl border border-white/10 text-center flex items-center space-x-3">
              <span className="text-3xl font-black text-amber-400 font-serif">5.0</span>
              <div className="text-left text-xs">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-gray-400">Google Maps 100% Vérifié</span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Tlemcen+Car"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] transition-all flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Laisser un Avis sur Google</span>
            </a>
          </div>
        </div>

        {/* Google Maps Official Reviews Widget */}
        <div className="bg-[#0e0e14]/90 p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Avis Synchronisés en Temps Réel depuis Google Maps
            </h2>
          </div>
          <GoogleReviewsWidget />
        </div>

        {/* Guarantee Info Banner */}
        <div className="p-6 bg-gradient-to-r from-[#12121c] to-[#0a0a0f] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 flex items-center justify-center text-[#ff2e4d] flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Agence de Location Tlemcen Ville & Aéroport Zenata</h3>
              <p className="text-xs text-gray-400">
                Véhicules récents, propres et livrés partout à Tlemcen. Assistance 24h/7j au {AGENCY_DETAILS.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
