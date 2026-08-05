import React from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { Sparkles, CheckCircle2, UserCheck, PlaneTakeoff, CalendarRange, ShieldCheck, ArrowRight } from 'lucide-react';
import { AGENCY_DETAILS } from '../utils/constants';

interface ServicesProps {
  onNavigateToFleet: () => void;
  onNavigateToContact: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigateToFleet, onNavigateToContact }) => {
  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 inline-block">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            Services Sur Mesure Tlemcen
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-serif">
            Nos Prestations Conciergerie VIP
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Une prise en charge d'exception pour vos déplacements professionnels, cérémonies de mariage ou accueils personnalisés à l'Aéroport Zenata.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {SERVICES_DATA.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className={`bg-[#0e0e14] rounded-2xl border border-white/10 overflow-hidden flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } shadow-xl hover:border-[#ff2e4d]/40 transition-all`}
              >
                {/* Image */}
                <div className="lg:w-1/2 relative h-72 lg:h-auto overflow-hidden bg-[#050508]">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent lg:hidden" />
                </div>

                {/* Content */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-bold text-[#ff2e4d] tracking-wider px-3 py-1 bg-[#ff2e4d]/10 rounded-full border border-[#ff2e4d]/20 inline-block">
                      {service.priceTag}
                    </span>
                    <h2 className="text-2xl font-black text-white font-serif">{service.title}</h2>
                    <p className="text-xs text-gray-400 font-medium italic">{service.subtitle}</p>
                    <p className="text-sm text-gray-300 leading-relaxed pt-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avantages Clés :</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      {service.highlights.map((h, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff2e4d] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      onClick={onNavigateToContact}
                      className="px-6 py-3 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)] transition-all flex items-center"
                    >
                      <span>Demander un Devis</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                    <button
                      onClick={onNavigateToFleet}
                      className="px-5 py-3 bg-[#181822] text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10"
                    >
                      Voir les Véhicules
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
