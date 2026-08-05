import React from 'react';
import { AGENCY_DETAILS } from '../utils/constants';

export const Privacy: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8 text-gray-300">
        <h1 className="text-3xl font-black text-white font-serif border-l-4 border-[#ff2e4d] pl-4">
          Politique de Confidentialité
        </h1>

        <div className="bg-[#0e0e14] p-8 rounded-2xl border border-white/10 space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Collecte des Données Personnelles</h2>
            <p className="text-xs text-gray-400">
              Dans le cadre de l'utilisation des services de Tlemcen Car, nous pouvons être amenés à collecter les informations suivantes : votre nom, prénom, numéro de téléphone, adresse e-mail, ainsi que les détails relatifs à votre permis de conduire ou passeport pour la préparation de votre contrat de location.
            </p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">2. Utilisation des Données</h2>
            <p className="text-xs text-gray-400">
              Vos données sont uniquement utilisées pour :
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-2">
              <li>Traiter et valider vos réservations de véhicules à Tlemcen ou à l'Aéroport Zenata.</li>
              <li>Vous contacter concernant la confirmation de votre vol ou l'heure de livraison.</li>
              <li>Améliorer la qualité de nos services et notre assistance client.</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">3. Non-divulgation à des Tiers</h2>
            <p className="text-xs text-gray-400">
              Tlemcen Car s'engage formellement à ne jamais revendre, louer ni céder vos données personnelles à des organismes tiers à des fins commerciales.
            </p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-base font-bold text-white">4. Vos Droits</h2>
            <p className="text-xs text-gray-400">
              Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment par e-mail à : <strong>{AGENCY_DETAILS.email}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
