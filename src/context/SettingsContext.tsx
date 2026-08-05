import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgencySettings } from '../types/admin';
import { AGENCY_DETAILS } from '../utils/constants';

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
};

interface SettingsContextType {
  settings: AgencySettings;
  updateSettings: (newSettings: AgencySettings) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AgencySettings>(() => {
    try {
      const saved = localStorage.getItem('tlemcen_agency_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          socials: {
            ...defaultSettings.socials,
            ...(parsed.socials || {}),
          },
        };
      }
    } catch (e) {
      console.error('Error reading settings from localStorage', e);
    }
    return defaultSettings;
  });

  // Automatically update localStorage, page title, favicon, and primary color CSS variable
  useEffect(() => {
    try {
      localStorage.setItem('tlemcen_agency_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }

    // Update document title
    if (settings.name) {
      document.title = `${settings.name} | ${settings.tagline || 'Location de Voitures de Luxe'}`;
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
  }, [settings]);

  const updateSettings = (newSettings: AgencySettings) => {
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
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
