export interface AgencySettings {
  name: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
  email: string;
  address: string;
  airportBranch: string;
  workingHours: string;
  officeHours: string;
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube?: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type AdminTab = 'dashboard' | 'cars' | 'bookings' | 'settings';
