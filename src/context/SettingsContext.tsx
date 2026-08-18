import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgencySettings } from '../types/admin';
import { AGENCY_DETAILS } from '../utils/constants';
import {
  fetchFromSupabase,
  saveSettingsToSupabase,
  setSupabaseCredentials,
  isSupabaseConfigured,
} from '../lib/supabase';

export const defaultSettings: AgencySettings = {
  name: AGENCY_DETAILS.name,
  tagline: AGENCY_DETAILS.tagline,
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#ff2e4d',
  phone: AGENCY_DETAILS.phone,
  phoneFormatted: AGENCY_DETAILS.phoneFormatted,
  whatsapp: AGENCY_DETAILS.whatsapp,
  email: AGENCY_DETAILS.email,
  address: AGENCY_DETAILS.address,
  airportBranch: AGENCY_DETAILS.airportBranch,
  workingHours: AGENCY_DETAILS.workingHours,
  officeHours: AGENCY_DETAILS.officeHours,
  socials: {
    instagram: 'https://instagram.com/tlemcencar_luxury',
    facebook: 'https://facebook.com/tlemcencar',
    tiktok: 'https://tiktok.com/@tlemcencar',
    youtube: 'https://youtube.com/@tlemcencar',
  },
  seo: {
    metaTitle: 'Tlemcen Car Luxury & Prestige - Location de Voitures VIP à Tlemcen',
    metaDescription: 'Louez des véhicules de prestige à Tlemcen et à l\'Aéroport Messali Hadj Zenata. Mercedes G63, Porsche 911, Range Rover, Audi RS6.',
    keywords: 'location voiture tlemcen, location voiture luxe algerie, mercedes g63 tlemcen, aeroport zenata car rental',
  },
  theme: {
    mode: 'dark',
    secondaryColor: '#12121c',
    accentColor: '#ff2e4d',
  },
  animations: {
    enabled: true,
    speed: 'normal',
    pageTransitions: true,
  },
  iframes: {
    reservationEmbedUrl: 'https://tlemcen-car.onrender.com/?embed=true&theme=emerald',
    googleAnalyticsId: 'G-YHDBE0RSEC',
  },
  general: {
    currencyDefault: 'DZD',
    minRentalDays: 1,
    depositRequirement: true,
  },
};

interface SettingsContextType {
  settings: AgencySettings;
  updateSettings: (newSettings: AgencySettings) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AgencySettings>(defaultSettings);

  // Fetch settings from Supabase / Express server on initial mount
  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      // First attempt: fetch from Supabase if client configured
      try {
        const { settings: sbSettings } = await fetchFromSupabase();
        if (isMounted && sbSettings) {
          const merged = {
            ...defaultSettings,
            ...sbSettings,
            socials: { ...defaultSettings.socials, ...(sbSettings.socials || {}) },
            seo: { ...defaultSettings.seo, ...(sbSettings.seo || {}) },
            theme: { ...defaultSettings.theme, ...(sbSettings.theme || {}) },
            animations: { ...defaultSettings.animations, ...(sbSettings.animations || {}) },
            iframes: { ...defaultSettings.iframes, ...(sbSettings.iframes || {}) },
            general: { ...defaultSettings.general, ...(sbSettings.general || {}) },
          };
          setSettings(merged);
          if (merged.supabaseConfig?.url && merged.supabaseConfig?.anonKey) {
            setSupabaseCredentials(merged.supabaseConfig.url, merged.supabaseConfig.anonKey);
          }
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed or not configured, trying server endpoint:', err);
      }

      // Second attempt: fetch from Express server /api/admin/store
      try {
        const res = await fetch('/api/admin/store');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.settings) {
            const merged = {
              ...defaultSettings,
              ...data.settings,
              socials: { ...defaultSettings.socials, ...(data.settings.socials || {}) },
            };
            setSettings(merged);
            if (merged.supabaseConfig?.url && merged.supabaseConfig?.anonKey) {
              setSupabaseCredentials(merged.supabaseConfig.url, merged.supabaseConfig.anonKey);
            }
          }
        }
      } catch (err) {
        console.warn('Server store fetch fallback warning:', err);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update document metadata, favicon, title, and theme dynamically
  useEffect(() => {
    // Update document title
    if (settings.name) {
      const title = settings.seo?.metaTitle || `${settings.name} | ${settings.tagline || 'Location de Voitures de Luxe'}`;
      document.title = title;
    }

    // Update meta description
    if (settings.seo?.metaDescription) {
      let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = settings.seo.metaDescription;
    }

    // Update favicon dynamically
    let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    const iconUrl = settings.faviconUrl || settings.logoUrl;
    if (iconUrl) {
      faviconLink.href = iconUrl;
    }

    // Update primary color CSS variable on document element
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }

    // Google Analytics 4 dynamic injection
    const gaId = settings.iframes?.googleAnalyticsId?.trim();
    if (gaId && gaId.startsWith('G-')) {
      const existingScript = document.getElementById('ga-gtag-script');
      if (!existingScript) {
        const gtagScript = document.createElement('script');
        gtagScript.id = 'ga-gtag-script';
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gtagScript);

        const gtagInline = document.createElement('script');
        gtagInline.id = 'ga-inline-script';
        gtagInline.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `;
        document.head.appendChild(gtagInline);
      }
    }
  }, [settings]);

  const saveSettings = async (newSettings: AgencySettings) => {
    setSettings(newSettings);

    // If Supabase config present, initialize credentials
    if (newSettings.supabaseConfig?.url && newSettings.supabaseConfig?.anonKey) {
      setSupabaseCredentials(newSettings.supabaseConfig.url, newSettings.supabaseConfig.anonKey);
    }

    // Save directly to Supabase
    const savedSb = await saveSettingsToSupabase(newSettings);
    if (!savedSb) {
      console.warn('Could not save settings directly to Supabase, syncing to server...');
    }

    // Always sync to server API endpoint as well
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: newSettings }),
    }).catch((err) => {
      console.error('Failed to sync settings to server:', err);
    });
  };

  const updateSettings = (newSettings: AgencySettings) => {
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    saveSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
