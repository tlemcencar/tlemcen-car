import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedCars } from '../components/home/FeaturedCars';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { TlemcenHighlight } from '../components/home/TlemcenHighlight';
import { Car } from '../types';
import { REVIEWS_DATA } from '../data/reviewsData';
import { Star, Quote, ArrowRight, Plane, PhoneCall, Sparkles } from 'lucide-react';
import { AGENCY_DETAILS } from '../utils/constants';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectCar: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onSelectCar,
  onViewCarDetails,
}) => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero
        onNavigateToFleet={() => onNavigate('fleet')}
        onNavigateToServices={() => onNavigate('services')}
      />

      {/* Featured Fleet Section */}
      <FeaturedCars
        onSelectCar={onSelectCar}
        onViewDetails={onViewCarDetails}
        onViewAllFleet={() => onNavigate('fleet')}
      />

      {/* Privileges & Advantages */}
      <WhyUsSection />

      {/* Tlemcen Destinations Highlight */}
      <TlemcenHighlight onNavigateToFleet={() => onNavigate('fleet')} />

      {/* Reviews Teaser Banner */}
      <section className="py-20 bg-[#060608] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/20 inline-block mb-2">
                Temoignages Verified
              </span>
              <h2 className="text-3xl font-black text-white font-serif">
                Ce que disent nos Clients VIP
              </h2>
            </div>

            <button
              onClick={() => onNavigate('reviews')}
              className="mt-4 md:mt-0 text-xs font-bold text-[#ff2e4d] hover:text-white uppercase tracking-wider flex items-center space-x-1"
            >
              <span>Voir les {REVIEWS_DATA.length} avis verified</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS_DATA.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {review.date}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{review.clientName}</h4>
                    <span className="text-[11px] text-[#ff2e4d]">{review.carRented}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    {review.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airport Zenata VIP Delivery Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0d0d14] via-[#120509] to-[#0d0d14] border-y border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#ff2e4d]/20 text-[#ff2e4d] text-xs font-bold rounded-full border border-[#ff2e4d]/30">
              <Plane className="w-4 h-4" />
              <span>Accueil VIP Aéroport Zenata - Messali Hadj</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              Vous atterrissez à Tlemcen ?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Communiquez-nous votre numéro de vol. Notre agent vous remet les clés de votre voiture de luxe à la sortie des bagages.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`tel:${AGENCY_DETAILS.phone}`}
              className="px-6 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-[#ff2e4d]" />
              <span>{AGENCY_DETAILS.phoneFormatted}</span>
            </a>
            <button
              onClick={() => onNavigate('fleet')}
              className="px-6 py-3.5 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] transition-all"
            >
              Réserver Maintenant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
