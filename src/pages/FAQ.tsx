import React, { useState } from 'react';
import { FAQ_DATA } from '../data/faqData';
import { Sparkles, Search, ChevronDown, ChevronUp, HelpCircle, PhoneCall, MessageSquare } from 'lucide-react';
import { AGENCY_DETAILS } from '../utils/constants';

export const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const categories = [
    'Toutes',
    'Conditions & Documents',
    'Paiement & Caution',
    'Aéroport & Livraison',
    'Assurance & Assistance',
    'Général',
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchCat = selectedCategory === 'Toutes' || item.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 inline-block">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            Centre d'Aide & Réponses
          </span>
          <h1 className="text-4xl font-black text-white font-serif">
            Foire Aux Questions (FAQ)
          </h1>
          <p className="text-sm text-gray-300">
            Retrouvez toutes les réponses concernant les modalités de location, la prise en charge à l'Aéroport Zenata et la caution à Tlemcen.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question (ex: permis, caution, aéroport, âge)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#0e0e14] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#ff2e4d] transition-colors shadow-lg"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#ff2e4d] text-white shadow-[0_0_15px_rgba(255,46,77,0.4)]'
                  : 'bg-[#12121a] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-[#0e0e14] rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-[#ff2e4d]/50 bg-[#12121b]' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white focus:outline-none"
                  >
                    <span className="flex items-center space-x-3 pr-4">
                      <HelpCircle className="w-4 h-4 text-[#ff2e4d] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#ff2e4d] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/5">
                      <p className="bg-[#181824] p-4 rounded-xl border border-white/5">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              Aucune question ne correspond à votre recherche.
            </div>
          )}
        </div>

        {/* Still have questions CTA */}
        <div className="bg-[#14141e] p-8 rounded-2xl border border-white/10 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Une question spécifique ?</h3>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            Notre équipe est joignable 7j/7 pour vous renseigner directement sur les disponibilités et conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${AGENCY_DETAILS.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,211,102,0.4)] flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Écrire sur WhatsApp</span>
            </a>
            <a
              href={`tel:${AGENCY_DETAILS.phone}`}
              className="px-6 py-3 bg-[#ff2e4d] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)] flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Appeler l'Agence ({AGENCY_DETAILS.phoneFormatted})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
