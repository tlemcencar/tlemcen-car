import React, { useState } from 'react';
import { TLEMCEN_LOCATIONS } from '../utils/constants';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Sparkles, Building2, Plane } from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings } = useSettings();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Demande d\'information',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 inline-block">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            Agence {settings.name}
          </span>
          <h1 className="text-4xl font-black text-white font-serif">
            Contactez Notre Équipe VIP
          </h1>
          <p className="text-sm text-gray-300">
            Une question, un besoin spécifique ou un accueil sur mesure à l'Aéroport Zenata ? Nos conseillers sont à votre disposition.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards & Agencies (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white border-l-2 border-[#ff2e4d] pl-3">
                Coordonnées Directes
              </h3>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start space-x-3.5 bg-[#14141e] p-3.5 rounded-xl border border-white/5">
                  <Building2 className="w-5 h-5 text-[#ff2e4d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Agence Principale</span>
                    <p className="text-gray-400 mt-0.5">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 bg-[#14141e] p-3.5 rounded-xl border border-white/5">
                  <Plane className="w-5 h-5 text-[#ff2e4d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Antenne Aéroport</span>
                    <p className="text-gray-400 mt-0.5">{settings.airportBranch || 'Aéroport Tlemcen Zenata (Messali Hadj)'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-[#14141e] p-3.5 rounded-xl border border-white/5">
                  <Phone className="w-5 h-5 text-[#ff2e4d] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Téléphone & Urgences</span>
                    <a href={`tel:${settings.phone}`} className="text-gray-300 hover:text-[#ff2e4d] font-mono">
                      {settings.phoneFormatted || settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-[#14141e] p-3.5 rounded-xl border border-white/5">
                  <Mail className="w-5 h-5 text-[#ff2e4d] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Adresse Email</span>
                    <a href={`mailto:${settings.email}`} className="text-gray-300 hover:text-[#ff2e4d]">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-[#14141e] p-3.5 rounded-xl border border-white/5">
                  <Clock className="w-5 h-5 text-[#ff2e4d] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Horaires de Service</span>
                    <p className="text-gray-400">{settings.officeHours || settings.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center space-x-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white stroke-none" />
                <span>Discussion Directe sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form & Map Simulation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0e0e14] p-8 rounded-2xl border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white border-l-2 border-[#ff2e4d] pl-3">
                Envoyer un Message
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Nom & Prénom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Karim Benkhadra"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +213 550 00 00 00"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: karim@gmail.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Sujet de votre demande</label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                      >
                        <option value="Demande d'information">Demande d'information générale</option>
                        <option value="Location Mariage VIP">Location de Mariage / Événement VIP</option>
                        <option value="Service Chauffeur Privé">Service Chauffeur Privé</option>
                        <option value="Livraison Aéroport Zenata">Livraison Aéroport Zenata</option>
                        <option value="Location Longue Durée">Location Longue Durée (LLD)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Précisez les dates souhaitées, le modèle de voiture ou toute exigence particulière..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-[#161620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer le Message</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Message Envoyé avec Succès !</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Merci {formState.name}. Un conseiller Tlemcen Car reprendra contact avec vous dans un délai maximum de 30 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 bg-[#181822] text-xs font-semibold text-gray-300 rounded-xl"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}
            </div>

            {/* Map Simulation Banner */}
            <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center font-bold text-white">
                  <MapPin className="w-4 h-4 text-[#ff2e4d] mr-1.5" />
                  Localisation Agence & Aéroport
                </span>
                <span>Tlemcen, Algérie</span>
              </div>
              <div className="h-44 w-full rounded-xl overflow-hidden bg-[#12121c] border border-white/5 relative flex items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop"
                  alt="Tlemcen Map Preview"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-20 space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff2e4d]/30 text-[#ff2e4d] border border-[#ff2e4d]/40 text-xs font-bold">
                    Boulevard Mohamed V & Aéroport Messali Hadj
                  </div>
                  <p className="text-xs text-gray-300">
                    Service de navette rapide et livraison directe à votre hôtel ou domicile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
