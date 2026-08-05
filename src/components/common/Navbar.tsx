import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Phone, Menu, X, ShieldCheck, MapPin, Sparkles, Building2 } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { useSettings } from '../../context/SettingsContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'fleet', label: 'Flotte' },
    { id: 'services', label: 'Services VIP' },
    { id: 'reviews', label: 'Avis Clients' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro bar for VIP info */}
      <div className="hidden md:block bg-[#09090c]/90 border-b border-white/5 py-1.5 px-6 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
              {settings.address || 'Tlemcen & Aéroport Zenata (Messali Hadj)'}
            </span>
            <span className="flex items-center text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff2e4d] mr-1.5" />
              Service Client VIP 24h/24
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center text-gray-300 hover:text-[#ff2e4d] text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#ff2e4d]" />
              Espace Admin
            </button>
            <span className="text-gray-600">|</span>
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center text-gray-300 hover:text-[#ff2e4d] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#ff2e4d]" />
              {settings.phoneFormatted || settings.phone}
            </a>
            <span className="text-gray-600">|</span>
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* Main glass navigation bar */}
      <nav
        className={`px-4 lg:px-8 py-3.5 transition-all duration-300 ${
          scrolled
            ? 'bg-[#09090c]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            {settings.logoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,46,77,0.4)] group-hover:scale-105 transition-transform duration-300">
                <img src={settings.logoUrl} alt={settings.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2e4d] to-[#99001a] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(255,46,77,0.4)] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#ff2e4d]" />
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-wider text-white font-serif uppercase">
                  {settings.name}
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#ff2e4d]/20 text-[#ff2e4d] border border-[#ff2e4d]/30">
                  LUXURY
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-light tracking-widest uppercase">
                {settings.tagline || 'Location Prestige & VIP'}
              </p>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#121217]/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#ff2e4d] rounded-full shadow-[0_0_15px_rgba(255,46,77,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('fleet')}
              className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,46,77,0.4)] hover:shadow-[0_0_30px_rgba(255,46,77,0.6)] hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              <span>Réserver</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <CurrencySelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-white bg-[#181820] rounded-xl border border-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ff2e4d]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0e]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between text-left py-3 px-4 rounded-xl text-base font-medium transition-all ${
                    currentPage === link.id
                      ? 'bg-[#ff2e4d]/20 text-[#ff2e4d] border border-[#ff2e4d]/30 font-bold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {currentPage === link.id && (
                    <span className="w-2 h-2 rounded-full bg-[#ff2e4d] shadow-[0_0_8px_#ff2e4d]" />
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center py-3 bg-[#181822] text-white rounded-xl border border-white/10 font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#ff2e4d]" />
                  Appeler {settings.phoneFormatted || settings.phone}
                </a>

                <button
                  onClick={() => handleNavClick('fleet')}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff2e4d] to-[#c70024] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Voir la Flotte & Réserver
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
