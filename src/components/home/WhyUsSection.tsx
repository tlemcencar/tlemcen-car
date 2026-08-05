import React from 'react';
import { motion } from 'motion/react';
import { Plane, ShieldCheck, Clock, Award, Sparkles, HeartHandshake } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const advantages = [
    {
      icon: Plane,
      title: 'Livraison Aéroport Zenata',
      description: 'Prise en charge directe dès la sortie du terminal à l\'aéroport Messali Hadj de Tlemcen sans attente.',
    },
    {
      icon: ShieldCheck,
      title: 'Zéro Frais Cachés & Transparent',
      description: 'Des tarifs clairs en Dinars (DZD) ou Euros (EUR). Restitution intégrale de la caution après inspection.',
    },
    {
      icon: Award,
      title: 'Flotte Récente & Contrôlée',
      description: 'Véhicules modèles 2023-2024 soumis à des contrôles mécaniques rigoureux et un entretien méticuleux.',
    },
    {
      icon: Clock,
      title: 'Assistance VIP 24h/24 & 7j/7',
      description: 'Ligne directe d\'urgence et véhicule de remplacement immédiat en cas d\'imprévu partout dans la région.',
    },
    {
      icon: HeartHandshake,
      title: 'Chauffeurs Bilingues & Professionnels',
      description: 'Conducteurs expérimentés, discrets et courtois pour vos mariages, délégations et rendez-vous d\'affaires.',
    },
    {
      icon: Sparkles,
      title: 'Réservation Instantanée WhatsApp',
      description: 'Validez votre réservation en 2 minutes directement par message sans démarches administratives complexes.',
    },
  ];

  return (
    <section className="py-20 bg-[#060608] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/20 inline-block">
            Pourquoi Choisir Tlemcen Car ?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
            L'Excellence Automobile au Service de vos Trajets
          </h2>
          <p className="text-sm text-gray-400">
            Nous combinons la puissance des plus beaux modèles automobiles avec un niveau de service irréprochable pour tous vos séjours à Tlemcen.
          </p>
        </div>

        {/* Advantage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#0e0e14] p-8 rounded-2xl border border-white/10 hover:border-[#ff2e4d]/50 transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff2e4d]/20 to-[#ff2e4d]/5 border border-[#ff2e4d]/30 flex items-center justify-center text-[#ff2e4d] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,46,77,0.2)]">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff2e4d] transition-colors">
                  {adv.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
