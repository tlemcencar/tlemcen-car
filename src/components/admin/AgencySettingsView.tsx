import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { AgencySettings } from '../../types/admin';
import {
  Settings,
  Building2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Video,
  Check,
  Upload,
  Clock,
  Palette,
  Globe,
  Youtube,
  Sparkles
} from 'lucide-react';

export const AgencySettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdminData();
  const [formData, setFormData] = useState<AgencySettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, faviconUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center">
            <Settings className="w-5 h-5 text-[#ff2e4d] mr-2" />
            Paramètres Généraux de l'Agence
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Modifiez le nom, le logo, la couleur néon, le numéro WhatsApp, l'adresse et les réseaux sociaux. Toutes les modifications sont instantanées.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Check className="w-4 h-4" />
          <span>Enregistrer les Paramètres</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Basic & Contact Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Logo, Favicon & Brand Identity */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Identité de Marque & Logos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Nom de l'Agence *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Slogan de l'Agence</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>
            </div>

            {/* Logo Image Picker */}
            <div className="pt-2">
              <label className="block text-gray-300 font-bold mb-1">Logo de l'Agence</label>
              <div className="flex items-center space-x-4 bg-[#14141e] p-4 rounded-xl border border-white/5">
                <div className="w-16 h-16 rounded-xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Agence" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-[#ff2e4d]" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="url"
                    placeholder="URL du logo (ex: https://...)"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                  />

                  <label className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#1f1f2e] hover:bg-[#2a2a3e] text-gray-200 text-xs font-semibold rounded-xl border border-white/10 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#ff2e4d]" />
                    <span>Téléverser une image de logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Favicon & Theme Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Favicon (Logo Navigateur)</label>
                <div className="flex items-center space-x-3 bg-[#14141e] p-3 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-[#0a0a0f] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.faviconUrl || formData.logoUrl ? (
                      <img src={formData.faviconUrl || formData.logoUrl} alt="Favicon" className="w-full h-full object-cover" />
                    ) : (
                      <Globe className="w-5 h-5 text-[#ff2e4d]" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="URL du favicon"
                      value={formData.faviconUrl || ''}
                      onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#ff2e4d]"
                    />
                    <label className="inline-flex items-center space-x-1.5 text-[11px] text-gray-400 hover:text-white cursor-pointer">
                      <Upload className="w-3 h-3 text-[#ff2e4d]" />
                      <span>Importer favicon</span>
                      <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 flex items-center">
                  <Palette className="w-3.5 h-3.5 text-[#ff2e4d] mr-1" />
                  Couleur Néon Principale
                </label>
                <div className="flex items-center space-x-3 bg-[#14141e] p-3 rounded-xl border border-white/5">
                  <input
                    type="color"
                    value={formData.primaryColor || '#ff2e4d'}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#ff2e4d'}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 bg-[#181824] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Location */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Coordonnées & Adresses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Numéro WhatsApp (utilisé dans tous les boutons de réservation) *</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#25D366] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="213550123456"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Téléphone Direct *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#ff2e4d] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">E-mail de Contact *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ff2e4d] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Téléphone Formaté (Affichage)</label>
                <input
                  type="text"
                  value={formData.phoneFormatted}
                  onChange={(e) => setFormData({ ...formData, phoneFormatted: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Adresse Principale Agence *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#ff2e4d] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Horaires d'Ouverture Agence</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Service de Reservation</label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-[#ff2e4d] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Social Networks */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Réseaux Sociaux
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Instagram</label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-pink-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.socials.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, instagram: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Facebook</label>
                <div className="relative">
                  <Facebook className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.socials.facebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, facebook: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">TikTok</label>
                <div className="relative">
                  <Video className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.socials.tiktok}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, tiktok: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">YouTube</label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.socials.youtube || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, youtube: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 bg-[#14141e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl sticky top-28">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-[#ff2e4d]" />
              Aperçu en Direct du Site
            </h3>

            <div className="bg-[#12121c] p-5 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff2e4d] to-[#99001a] p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#ff2e4d]" />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-serif">{formData.name}</h4>
                  <p className="text-[11px] text-gray-400">{formData.tagline}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: {formData.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#ff2e4d]" />
                  <span>{formData.phoneFormatted}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-start space-x-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{formData.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)] transition-all flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer Tout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
