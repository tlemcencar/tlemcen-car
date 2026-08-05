import React from 'react';
import { Car, Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Facebook, Send, ArrowRight, Video, Youtube } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060608] text-gray-300 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background neon ambient light blur */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff2e4d]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff2e4d]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              {settings.logoUrl ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,46,77,0.4)]">
                  <img src={settings.logoUrl} alt={settings.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2e4d] to-[#99001a] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(255,46,77,0.4)]">
                  <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#ff2e4d]" />
                  </div>
                </div>
              )}
              <span className="text-2xl font-black text-white font-serif tracking-wider uppercase">
                {settings.name}
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {settings.tagline || "Agence leader de location de véhicules de prestige et de luxe à Tlemcen, Algérie. Service VIP sur mesure, livraison garantie à l'Aéroport Zenata et assistance 24/7."}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase font-bold tracking-widest text-gray-300 mb-2">
                Offres VIP & Nouveaux Modèles
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center max-w-md">
                <input
                  type="email"
                  placeholder="Votre adresse email..."
                  className="w-full px-4 py-2.5 bg-[#121218] border border-white/10 rounded-l-xl text-sm text-white focus:outline-none focus:border-[#ff2e4d] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff2e4d] hover:bg-[#e60026] text-white rounded-r-xl transition-colors flex items-center justify-center"
                  aria-label="S'abonner"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#ff2e4d] pl-3">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'fleet', label: 'Flotte de Luxe' },
                { id: 'services', label: 'Services VIP & Chauffeur' },
                { id: 'reviews', label: 'Avis Clients' },
                { id: 'faq', label: 'Foire Aux Questions' },
                { id: 'contact', label: 'Contact & Agence' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleLinkClick(item.id)}
                    className="hover:text-[#ff2e4d] transition-colors flex items-center group text-gray-400"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#ff2e4d]" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Informations légales */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#ff2e4d] pl-3">
              Informations
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => handleLinkClick('legal')}
                  className="hover:text-[#ff2e4d] transition-colors"
                >
                  Mentions Légales
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('privacy')}
                  className="hover:text-[#ff2e4d] transition-colors"
                >
                  Politique de Confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('admin')}
                  className="hover:text-[#ff2e4d] text-gray-400 font-semibold transition-colors flex items-center mt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
                  <span>Espace Administrateur</span>
                </button>
              </li>
              <li>
                <span className="text-gray-400 block pt-1 text-xs">
                  {settings.airportBranch || 'Aéroport Tlemcen Zenata (Messali Hadj)'}
                </span>
              </li>
              <li>
                <span className="text-gray-400 block text-xs">
                  Livraison 24h/24 Wilaya de Tlemcen
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Horaires */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#ff2e4d] pl-3">
              Contact Agence
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#ff2e4d] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#ff2e4d] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phoneFormatted || settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#ff2e4d] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start space-x-3 pt-1">
                <Clock className="w-4 h-4 text-[#ff2e4d] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300">
                  {settings.officeHours || settings.workingHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} {settings.name}. Tous droits réservés.</p>
          <div className="flex items-center space-x-4">
            {settings.socials.instagram && (
              <a
                href={settings.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#181822] border border-white/10 flex items-center justify-center hover:border-[#ff2e4d] hover:text-[#ff2e4d] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.socials.facebook && (
              <a
                href={settings.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#181822] border border-white/10 flex items-center justify-center hover:border-[#ff2e4d] hover:text-[#ff2e4d] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.socials.tiktok && (
              <a
                href={settings.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#181822] border border-white/10 flex items-center justify-center hover:border-[#ff2e4d] hover:text-[#ff2e4d] transition-all"
                aria-label="TikTok"
              >
                <Video className="w-4 h-4" />
              </a>
            )}
            {settings.socials.youtube && (
              <a
                href={settings.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#181822] border border-white/10 flex items-center justify-center hover:border-[#ff2e4d] hover:text-[#ff2e4d] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
