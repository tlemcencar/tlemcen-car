import React from 'react';
import { AGENCY_DETAILS } from '../utils/constants';

export const Legal: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8 text-gray-300">
        <h1 className="text-3xl font-black text-white font-serif border-l-4 border-[#ff2e4d] pl-4">
          Mentions Légales
        </h1>

        <div className="bg-[#0e0e14] p-8 rounded-2xl border border-white/10 space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Éditeur du Site</h2>
            <p>
              Le site <strong>Tlemcen Car</strong> (tlemcen-car.com) est édité par l'agence de location de véhicules de prestige Tlemcen Car.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-2">
              <li>Adresse siège : {AGENCY_DETAILS.address}</li>
              <li>Téléphone : {AGENCY_DETAILS.phoneFormatted}</li>
              <li>Email : {AGENCY_DETAILS.email}</li>
              <li>Antenne Aéroport : Aéroport de Tlemcen - Zenata (Messali Hadj)</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">2. Hébergement du Site</h2>
            <p className="text-xs text-gray-400">
              Le site est hébergé de manière sécurisée et distribuée sur les infrastructures Cloud Globales (Cloudflare Pages / Google Cloud Run containerized infrastructure) garantissant une disponibilité de 99,99%.
            </p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">3. Propriété Intellectuelle</h2>
            <p className="text-xs text-gray-400">
              L'ensemble du contenu du site Tlemcen Car (textes, logos, photographies, vidéos, design graphique) est protégé par les lois régissant le droit d'auteur et la propriété intellectuelle. Toute reproduction non autorisée est formellement interdite.
            </p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">4. Conditions Générales de Location</h2>
            <p className="text-xs text-gray-400">
              Chaque location de véhicule est soumise au contrat de location signé en agence ou lors de la prise en charge à l'Aéroport Zenata. Le conducteur doit être âgé au minimum de 21 ans (25 ans pour la catégorie Luxe & Supercar) et posséder un permis valide depuis plus de 2 ans.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
