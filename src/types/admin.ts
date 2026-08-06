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
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  };
  theme?: {
    mode?: 'dark' | 'light';
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
  animations?: {
    enabled?: boolean;
    speed?: 'fast' | 'normal' | 'slow';
    pageTransitions?: boolean;
  };
  iframes?: {
    reservationEmbedUrl?: string;
    customMapIframe?: string;
    googleAnalyticsId?: string;
  };
  general?: {
    currencyDefault?: 'DZD' | 'EUR';
    minRentalDays?: number;
    depositRequirement?: boolean;
  };
  supabaseConfig?: {
    url?: string;
    anonKey?: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type AdminTab = 'dashboard' | 'cars' | 'bookings' | 'settings';
