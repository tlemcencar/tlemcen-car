import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Bonjour ${settings.name}, je souhaite réserver un véhicule de luxe.`
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-3.5 rounded-full shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:shadow-[0_0_35px_rgba(37,211,102,0.8)] hover:scale-110 transition-all duration-300"
      aria-label="Contacter via WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-white stroke-none" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-300 font-bold text-sm">
        Assistance WhatsApp 24/7
      </span>
    </a>
  );
};
