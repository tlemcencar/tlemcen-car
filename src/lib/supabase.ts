import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgencySettings } from '../types/admin';
import { Car, BookingRequest } from '../types';

/**
 * Normalizes a user-provided Supabase URL.
 * Automatically converts dashboard project URLs (e.g. https://supabase.com/dashboard/project/xyz)
 * into standard API endpoints (https://xyz.supabase.co).
 */
export const normalizeSupabaseUrl = (rawUrl: string): { url: string; isConverted: boolean } => {
  if (!rawUrl) return { url: '', isConverted: false };
  let url = rawUrl.trim();

  // Detect Supabase Dashboard URLs like https://supabase.com/dashboard/project/abcdefghijklmn/...
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    const projectRef = dashboardMatch[1];
    return { url: `https://${projectRef}.supabase.co`, isConverted: true };
  }

  // Ensure https:// prefix
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  return { url, isConverted: false };
};

export const normalizeSupabaseKey = (rawKey: string): string => {
  if (!rawKey) return '';
  return rawKey.trim();
};

// Runtime configuration cache for Supabase credentials
let runtimeSupabaseUrl: string =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  '';

let runtimeSupabaseKey: string =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
  '';

// Attempt restoring from localStorage if empty
if ((!runtimeSupabaseUrl || !runtimeSupabaseKey) && typeof window !== 'undefined' && window.localStorage) {
  try {
    const savedConfig = localStorage.getItem('tlemcen_supabase_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed?.url && parsed?.anonKey) {
        runtimeSupabaseUrl = normalizeSupabaseUrl(parsed.url).url;
        runtimeSupabaseKey = normalizeSupabaseKey(parsed.anonKey);
      }
    }

    if (!runtimeSupabaseUrl || !runtimeSupabaseKey) {
      const savedSettings = localStorage.getItem('tlemcen_agency_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed?.supabaseConfig?.url && parsed?.supabaseConfig?.anonKey) {
          runtimeSupabaseUrl = normalizeSupabaseUrl(parsed.supabaseConfig.url).url;
          runtimeSupabaseKey = normalizeSupabaseKey(parsed.supabaseConfig.anonKey);
        }
      }
    }
  } catch (e) {
    // Ignore error
  }
}

let supabaseInstance: SupabaseClient | null = null;

export const setSupabaseCredentials = (url: string, key: string, persist = true) => {
  const normalized = normalizeSupabaseUrl(url);
  const cleanUrl = normalized.url;
  const cleanKey = normalizeSupabaseKey(key);

  runtimeSupabaseUrl = cleanUrl;
  runtimeSupabaseKey = cleanKey;

  if (cleanUrl && cleanKey) {
    try {
      supabaseInstance = createClient(cleanUrl, cleanKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
    }

    if (persist && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(
          'tlemcen_supabase_config',
          JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
        );
      } catch (e) {
        // ignore
      }
    }
  } else {
    supabaseInstance = null;
  }
};

export const getSupabaseCredentials = () => {
  return {
    url: runtimeSupabaseUrl,
    key: runtimeSupabaseKey,
  };
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  if (!runtimeSupabaseUrl || !runtimeSupabaseKey) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedConfig = localStorage.getItem('tlemcen_supabase_config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          if (parsed?.url && parsed?.anonKey) {
            runtimeSupabaseUrl = normalizeSupabaseUrl(parsed.url).url;
            runtimeSupabaseKey = normalizeSupabaseKey(parsed.anonKey);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  if (runtimeSupabaseUrl && runtimeSupabaseKey) {
    try {
      supabaseInstance = createClient(runtimeSupabaseUrl, runtimeSupabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(runtimeSupabaseUrl && runtimeSupabaseKey && getSupabaseClient() !== null);
};

export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- SQL Schema & Initial Seed for Tlemcen Car Luxury & Prestige
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Table: app_settings (Stores agency metadata, theme, contacts, SEO)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table: cars (Stores fleet vehicles, prices, specs, images, URLs)
CREATE TABLE IF NOT EXISTS public.cars (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Table: bookings (Stores incoming reservation requests & contracts)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.app_settings TO anon, authenticated, service_role;
GRANT ALL ON public.cars TO anon, authenticated, service_role;
GRANT ALL ON public.bookings TO anon, authenticated, service_role;

-- 6. RLS Policies for app_settings (Full read/write access for anon/public)
DROP POLICY IF EXISTS "Allow public access to app_settings" ON public.app_settings;
CREATE POLICY "Allow public access to app_settings" ON public.app_settings 
  FOR ALL USING (true) WITH CHECK (true);

-- 7. RLS Policies for cars (Full read/write access for anon/public)
DROP POLICY IF EXISTS "Allow public access to cars" ON public.cars;
CREATE POLICY "Allow public access to cars" ON public.cars 
  FOR ALL USING (true) WITH CHECK (true);

-- 8. RLS Policies for bookings (Full read/write access for anon/public)
DROP POLICY IF EXISTS "Allow public access to bookings" ON public.bookings;
CREATE POLICY "Allow public access to bookings" ON public.bookings 
  FOR ALL USING (true) WITH CHECK (true);

-- 9. Storage Bucket "cars" (For uploaded car photos and agency logos)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('cars', 'cars', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 10. RLS Policies for Storage Bucket "cars"
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public Read Access for cars bucket" ON storage.objects;
  CREATE POLICY "Public Read Access for cars bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'cars');

  DROP POLICY IF EXISTS "Public Insert Access for cars bucket" ON storage.objects;
  CREATE POLICY "Public Insert Access for cars bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'cars');

  DROP POLICY IF EXISTS "Public Update Access for cars bucket" ON storage.objects;
  CREATE POLICY "Public Update Access for cars bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'cars') WITH CHECK (bucket_id = 'cars');

  DROP POLICY IF EXISTS "Public Delete Access for cars bucket" ON storage.objects;
  CREATE POLICY "Public Delete Access for cars bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'cars');
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- ====================================================================
-- INITIAL SEED DATA: AGENCY SETTINGS & 8 LUXURY CARS
-- ====================================================================

-- Seed agency settings
INSERT INTO public.app_settings (id, data, updated_at)
VALUES (
  'agency_settings',
  '{
    "name": "Tlemcen Car Luxury & Prestige",
    "tagline": "Location de Voitures de Luxe & VIP à Tlemcen",
    "logoUrl": "",
    "faviconUrl": "",
    "primaryColor": "#ff2e4d",
    "phone": "+213 550 00 11 22",
    "phoneFormatted": "+213 550 00 11 22",
    "whatsapp": "213550001122",
    "email": "contact@tlemcencar-luxury.com",
    "address": "Boulevard Khedim Ali, Centre-Ville, Tlemcen, Algérie",
    "airportBranch": "Comptoir VIP - Hall Arrivées, Aéroport Tlemcen Zenata (Messali Hadj)",
    "workingHours": "7j/7 - 24h/24 (Assistance & Service VIP)",
    "officeHours": "08:00 - 20:00 (Du Samedi au Jeudi)",
    "socials": {
      "instagram": "https://instagram.com/tlemcencar_luxury",
      "facebook": "https://facebook.com/tlemcencar",
      "tiktok": "https://tiktok.com/@tlemcencar",
      "youtube": "https://youtube.com/@tlemcencar"
    },
    "seo": {
      "metaTitle": "Tlemcen Car Luxury & Prestige | Location Voitures de Luxe & VIP à Tlemcen",
      "metaDescription": "Leader de la location de voitures de luxe, SUV et berlines VIP à Tlemcen et Aéroport Zenata.",
      "keywords": "location voiture tlemcen, location voiture luxe algerie, mercedes g63 amg tlemcen, aeroport zenata"
    },
    "theme": {
      "accentColor": "#ff2e4d",
      "fontFamily": "Playfair Display & Plus Jakarta Sans"
    },
    "general": {
      "currencyDefault": "DZD",
      "minRentalDays": 1,
      "depositRequirement": true
    }
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 1: Mercedes-AMG G63
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'mercedes-g63-amg',
  '{
    "id": "mercedes-g63-amg",
    "carId": "mercedes-g63-amg",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=5a311ed7-cfc0-491f-89c3-aa6f676af4c0&embed=true&theme=emerald",
    "name": "Mercedes-AMG G 63 V8 BiTurbo",
    "brand": "Mercedes-Benz",
    "model": "G 63 AMG",
    "year": 2024,
    "category": "Luxe",
    "priceDZD": 45000,
    "priceEUR": 210,
    "image": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 5,
    "doors": 5,
    "powerHP": 585,
    "acceleration": "4.5s (0-100 km/h)",
    "featured": true,
    "available": true,
    "depositDZD": 250000,
    "depositEUR": 1000,
    "features": [
      "Échappement sport AMG commutable",
      "Intérieur cuir Nappa intégral rouge/noir",
      "Système audio Burmester 3D Surround",
      "Toit ouvrant panoramique",
      "Caméra 360° & PARKTRONIC",
      "Suspension pneumatique adaptative"
    ],
    "description": "Le tout dernier Mercedes G63 AMG incarne la puissance brute alliée à un luxe ultime. Parfait pour vos déplacements d''exception à Tlemcen, événements VIP ou accueils prestige à l''Aéroport Messali Hadj.",
    "rating": 4.95,
    "reviewCount": 38
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 2: Porsche 911 Carrera S
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'porsche-911-carrera-s',
  '{
    "id": "porsche-911-carrera-s",
    "carId": "porsche-911-carrera-s",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=porsche-911-carrera-s&embed=true&theme=emerald",
    "name": "Porsche 911 Carrera S Cabriolet",
    "brand": "Porsche",
    "model": "911 Carrera S",
    "year": 2023,
    "category": "Sport",
    "priceDZD": 40000,
    "priceEUR": 190,
    "image": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 4,
    "doors": 2,
    "powerHP": 450,
    "acceleration": "3.7s (0-100 km/h)",
    "featured": true,
    "available": true,
    "depositDZD": 200000,
    "depositEUR": 900,
    "features": [
      "Boîte PDK 8 rapports",
      "Pack Chrono Sport",
      "Système échappement sport déconnectable",
      "Sièges sport adaptatifs 18 positions",
      "Écran tactile Porsche Communication Management"
    ],
    "description": "Vivez le plaisir de conduire une véritable icône automobile le long de la corniche de Tlemcen et des routes du plateau de Lalla Setti. Élégance incontournable.",
    "rating": 4.98,
    "reviewCount": 42
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 3: Range Rover Vogue Autobiography
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'range-rover-vogue-autobiography',
  '{
    "id": "range-rover-vogue-autobiography",
    "carId": "range-rover-vogue-autobiography",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=range-rover-vogue-autobiography&embed=true&theme=emerald",
    "name": "Range Rover Autobiography P530",
    "brand": "Land Rover",
    "model": "Range Rover Vogue",
    "year": 2024,
    "category": "SUV",
    "priceDZD": 38000,
    "priceEUR": 175,
    "image": "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 5,
    "doors": 5,
    "powerHP": 530,
    "acceleration": "4.6s (0-100 km/h)",
    "featured": true,
    "available": true,
    "depositDZD": 200000,
    "depositEUR": 850,
    "features": [
      "Intérieur Cuir semi-aniline Exclusif",
      "Sièges arrière Executive Class avec massage",
      "Son Meridian Signature 1600W",
      "Toit panoramique coulissant",
      "Suspension pneumatique électronique"
    ],
    "description": "Le SUV le plus raffiné du marché mondial. Confort souverain, isolation phonique remarquable, idéal pour vos voyages d''affaires et réceptions privées à Tlemcen.",
    "rating": 4.92,
    "reviewCount": 29
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 4: Mercedes-Benz Classe S 580
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'mercedes-s-class-maybach',
  '{
    "id": "mercedes-s-class-maybach",
    "carId": "mercedes-s-class-maybach",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=mercedes-s-class-maybach&embed=true&theme=emerald",
    "name": "Mercedes-Benz Classe S 580 4MATIC",
    "brand": "Mercedes-Benz",
    "model": "Classe S",
    "year": 2024,
    "category": "Berline VIP",
    "priceDZD": 35000,
    "priceEUR": 160,
    "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Hybride",
    "seats": 5,
    "doors": 4,
    "powerHP": 503,
    "acceleration": "4.4s (0-100 km/h)",
    "featured": true,
    "available": true,
    "depositDZD": 180000,
    "depositEUR": 750,
    "features": [
      "Service Chauffeur VIP disponible",
      "Affichage tête haute en réalité augmentée",
      "Eclairage d''ambiance actif 64 couleurs",
      "Sièges première classe ventilés et chauffants",
      "Suspension AIRMATIC"
    ],
    "description": "Le summum du luxe automobile allemand. Que vous organisiez un mariage grandiose ou un transfert officiel depuis l''aéroport Zenata, la Classe S garantit le plus haut niveau de prestige.",
    "rating": 4.96,
    "reviewCount": 31
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 5: Audi RS6 Avant
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'audi-rs6-avant',
  '{
    "id": "audi-rs6-avant",
    "carId": "audi-rs6-avant",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=audi-rs6-avant&embed=true&theme=emerald",
    "name": "Audi RS6 Avant V8 Biturbo",
    "brand": "Audi",
    "model": "RS6 Avant",
    "year": 2023,
    "category": "Sport",
    "priceDZD": 32000,
    "priceEUR": 145,
    "image": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 5,
    "doors": 5,
    "powerHP": 600,
    "acceleration": "3.6s (0-100 km/h)",
    "featured": false,
    "available": true,
    "depositDZD": 160000,
    "depositEUR": 700,
    "features": [
      "Transmission Quattro intégrale",
      "Freins céramique RS",
      "Cockpit virtuel RS spécifique",
      "Echappement sport RS",
      "Intérieur RS Valcona perforé"
    ],
    "description": "Performances de supercar combinées au volume d''un grand break d''exception. L''Audi RS6 est l''arme ultime pour sillonner la région de Tlemcen.",
    "rating": 4.91,
    "reviewCount": 24
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 6: Cupra Formentor VZ5
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'cupra-formentor-vz5',
  '{
    "id": "cupra-formentor-vz5",
    "carId": "cupra-formentor-vz5",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=cupra-formentor-vz5&embed=true&theme=emerald",
    "name": "Cupra Formentor VZ5 2.5 TSI 390ch",
    "brand": "Cupra",
    "model": "Formentor VZ5",
    "year": 2024,
    "category": "SUV",
    "priceDZD": 22000,
    "priceEUR": 100,
    "image": "https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 5,
    "doors": 5,
    "powerHP": 390,
    "acceleration": "4.2s (0-100 km/h)",
    "featured": true,
    "available": true,
    "depositDZD": 100000,
    "depositEUR": 450,
    "features": [
      "Moteur 5 cylindres Akrapovič",
      "Sièges Baquets CUPBucket en cuir bleu",
      "Digital Cockpit personnalisable",
      "Freins Akebono 6 pistons",
      "Jantes alliage 20\" Copper"
    ],
    "description": "SUV coupé au caractère affirmé et au look ravageur. Le Formentor VZ5 allie un design agressif et un confort irréprochable pour tous vos trajets à Tlemcen.",
    "rating": 4.88,
    "reviewCount": 52
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 7: Golf 8 R 20 Years
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'golf-8-r-2024',
  '{
    "id": "golf-8-r-2024",
    "carId": "golf-8-r-2024",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=golf-8-r-2024&embed=true&theme=emerald",
    "name": "Volkswagen Golf 8 R 20 Years Edition",
    "brand": "Volkswagen",
    "model": "Golf 8 R",
    "year": 2024,
    "category": "Économique Premium",
    "priceDZD": 18000,
    "priceEUR": 85,
    "image": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Essence",
    "seats": 5,
    "doors": 5,
    "powerHP": 333,
    "acceleration": "4.6s (0-100 km/h)",
    "featured": false,
    "available": true,
    "depositDZD": 80000,
    "depositEUR": 350,
    "features": [
      "Transmission 4MOTION avec R-Performance Torque Vectoring",
      "Échappement Akrapovič en titane",
      "Mode Drift & Nürburgring",
      "Toit panoramique ouvrant",
      "Volant sport chauffant capacitif"
    ],
    "description": "La compacte sportive la plus prisée en Algérie. Agilité redoutable, technologie dernier cri et polyvalence au quotidien.",
    "rating": 4.90,
    "reviewCount": 68
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- Seed Car 8: Hyundai Tucson N-Line
INSERT INTO public.cars (id, data, updated_at)
VALUES (
  'hyundai-tucson-n-line',
  '{
    "id": "hyundai-tucson-n-line",
    "carId": "hyundai-tucson-n-line",
    "reservationUrl": "https://tlemcen-car.onrender.com/?carId=hyundai-tucson-n-line&embed=true&theme=emerald",
    "name": "Hyundai Tucson N-Line 2024 Automatic",
    "brand": "Hyundai",
    "model": "Tucson N-Line",
    "year": 2024,
    "category": "SUV",
    "priceDZD": 16000,
    "priceEUR": 75,
    "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop"
    ],
    "transmission": "Automatique",
    "fuel": "Gazole",
    "seats": 5,
    "doors": 5,
    "powerHP": 180,
    "acceleration": "8.2s (0-100 km/h)",
    "featured": false,
    "available": true,
    "depositDZD": 60000,
    "depositEUR": 280,
    "features": [
      "Pack Sport N-Line extérieur & intérieur",
      "Climatisation tri-zone automatique",
      "Double écran panoramique 10.25\"",
      "Hayon mains libres électrique",
      "Régulateur adaptatif intelligent"
    ],
    "description": "SUV familial moderne et très économique en carburant. Espace généreux pour les bagages, idéal pour visiter Maghnia, Ghazaouet, Honaine ou la frontière.",
    "rating": 4.85,
    "reviewCount": 41
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
`;

export interface SupabaseDiagnosticResult {
  connected: boolean;
  urlValid: boolean;
  keyValid: boolean;
  cleanedUrl: string;
  appSettingsTable: { exists: boolean; rowCount?: number; error?: string };
  carsTable: { exists: boolean; rowCount?: number; error?: string };
  bookingsTable: { exists: boolean; rowCount?: number; error?: string };
  storageBucketCars: { exists: boolean; accessible?: boolean; error?: string };
  message: string;
  suggestedAction?: string;
}

/**
 * Perform a live, comprehensive diagnostic of the Supabase configuration & tables.
 */
export const testSupabaseConnectionDetailed = async (
  testUrl?: string,
  testKey?: string
): Promise<SupabaseDiagnosticResult> => {
  const targetUrl = testUrl !== undefined ? testUrl : runtimeSupabaseUrl;
  const targetKey = testKey !== undefined ? testKey : runtimeSupabaseKey;

  const normalized = normalizeSupabaseUrl(targetUrl);
  const cleanUrl = normalized.url;
  const cleanKey = normalizeSupabaseKey(targetKey);

  const result: SupabaseDiagnosticResult = {
    connected: false,
    urlValid: Boolean(cleanUrl && cleanUrl.startsWith('https://') && cleanUrl.includes('.supabase.co')),
    keyValid: Boolean(cleanKey && cleanKey.length > 20),
    cleanedUrl: cleanUrl,
    appSettingsTable: { exists: false },
    carsTable: { exists: false },
    bookingsTable: { exists: false },
    storageBucketCars: { exists: false },
    message: '',
  };

  if (!cleanUrl || !cleanKey) {
    result.message = 'URL ou clé Supabase manquante. Veuillez renseigner SUPABASE_URL et SUPABASE_ANON_KEY.';
    result.suggestedAction = 'Renseignez les champs URL et Clé Publique dans les paramètres.';
    return result;
  }

  try {
    const client = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Test app_settings
    try {
      const { data: settingsData, error: settingsError } = await client
        .from('app_settings')
        .select('id')
        .limit(5);

      if (settingsError) {
        result.appSettingsTable.error = settingsError.message;
        result.appSettingsTable.exists = !isTableMissingError(settingsError);
      } else {
        result.appSettingsTable.exists = true;
        result.appSettingsTable.rowCount = settingsData?.length || 0;
      }
    } catch (e: any) {
      result.appSettingsTable.error = e?.message;
    }

    // 2. Test cars
    try {
      const { data: carsData, error: carsError } = await client
        .from('cars')
        .select('id')
        .limit(50);

      if (carsError) {
        result.carsTable.error = carsError.message;
        result.carsTable.exists = !isTableMissingError(carsError);
      } else {
        result.carsTable.exists = true;
        result.carsTable.rowCount = carsData?.length || 0;
      }
    } catch (e: any) {
      result.carsTable.error = e?.message;
    }

    // 3. Test bookings
    try {
      const { data: bookingsData, error: bookingsError } = await client
        .from('bookings')
        .select('id')
        .limit(50);

      if (bookingsError) {
        result.bookingsTable.error = bookingsError.message;
        result.bookingsTable.exists = !isTableMissingError(bookingsError);
      } else {
        result.bookingsTable.exists = true;
        result.bookingsTable.rowCount = bookingsData?.length || 0;
      }
    } catch (e: any) {
      result.bookingsTable.error = e?.message;
    }

    // 4. Test storage bucket
    try {
      const { data: bucketData, error: bucketError } = await client.storage.getBucket('cars');
      if (!bucketError && bucketData) {
        result.storageBucketCars.exists = true;
        result.storageBucketCars.accessible = true;
      } else {
        result.storageBucketCars.exists = false;
        result.storageBucketCars.error = bucketError?.message;
      }
    } catch (e: any) {
      result.storageBucketCars.error = e?.message;
    }

    const allTablesExist =
      result.appSettingsTable.exists && result.carsTable.exists && result.bookingsTable.exists;

    if (allTablesExist) {
      result.connected = true;
      result.message = `Connexion Supabase réussie ! Tables vérifiées (${result.carsTable.rowCount ?? 0} véhicules dans la base).`;
    } else {
      result.connected = false;
      result.message =
        'Connexion établie avec Supabase, mais une ou plusieurs tables (app_settings, cars, bookings) sont manquantes.';
      result.suggestedAction =
        'Copiez le script SQL complet ci-dessous et exécutez-le dans le SQL Editor de Supabase pour créer et remplir automatiquement les tables.';
    }

    return result;
  } catch (err: any) {
    result.connected = false;
    result.message = `Échec de connexion Supabase: ${err?.message || err}`;
    result.suggestedAction = 'Vérifiez que l\'URL et la clé ANON de votre projet Supabase sont correctes.';
    return result;
  }
};

/**
 * Synchronize all current settings, cars, and bookings directly into Supabase in one batch.
 */
export const syncAllDataToSupabase = async (
  settings: AgencySettings,
  cars: Car[],
  bookings: BookingRequest[]
): Promise<{ success: boolean; message: string; details?: any }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Client Supabase non initialisé. Veuillez d\'abord configurer SUPABASE_URL et SUPABASE_ANON_KEY.',
    };
  }

  try {
    let settingsOk = false;
    let carsCount = 0;
    let bookingsCount = 0;

    // 1. Save Settings
    const sResult = await saveSettingsToSupabase(settings);
    settingsOk = sResult;

    // 2. Save Cars
    if (cars && cars.length > 0) {
      const cResult = await saveCarsToSupabase(cars);
      if (cResult) carsCount = cars.length;
    }

    // 3. Save Bookings
    if (bookings && bookings.length > 0) {
      const bResult = await saveBookingsToSupabase(bookings);
      if (bResult) bookingsCount = bookings.length;
    }

    if (settingsOk) {
      return {
        success: true,
        message: `Synchronisation réussie ! Paramètres enregistrés, ${carsCount} véhicule(s) et ${bookingsCount} réservation(s) mis à jour dans Supabase.`,
      };
    } else {
      return {
        success: false,
        message: 'Impossible de synchroniser avec Supabase. Les tables n\'existent peut-être pas encore. Exécutez le script SQL.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Erreur lors de la synchronisation : ${err?.message || err}`,
    };
  }
};

/**
 * Fetch all data (settings, cars, bookings) from Supabase
 */
export const isTableMissingError = (error: any): boolean => {
  if (!error) return false;
  const msg = typeof error === 'string' ? error : error.message || error.details || error.hint || '';
  const code = error.code || '';
  return (
    msg.includes('schema cache') ||
    msg.includes('Could not find the table') ||
    msg.includes('permission denied') ||
    msg.includes('violates row-level security') ||
    (msg.includes('relation') && msg.includes('does not exist')) ||
    code === 'PGRST204' ||
    code === 'PGRST301' ||
    code === '42P01' ||
    code === '42501'
  );
};

/**
 * Fetch all data (settings, cars, bookings) from Supabase
 */
export const fetchFromSupabase = async (): Promise<{
  settings: AgencySettings | null;
  cars: Car[] | null;
  bookings: BookingRequest[] | null;
}> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { settings: null, cars: null, bookings: null };
  }

  try {
    const [settingsRes, carsRes, bookingsRes] = await Promise.all([
      supabase.from('app_settings').select('*').eq('id', 'agency_settings').maybeSingle(),
      supabase.from('cars').select('*').order('updated_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ]);

    if (settingsRes.error && isTableMissingError(settingsRes.error)) {
      console.warn('Supabase tables not found. Please execute the SQL script in your Supabase SQL Editor.');
      return { settings: null, cars: null, bookings: null };
    }

    let settings: AgencySettings | null = null;
    if (settingsRes.data && settingsRes.data.data) {
      settings = settingsRes.data.data as AgencySettings;
    }

    let cars: Car[] | null = null;
    if (carsRes.data && Array.isArray(carsRes.data) && carsRes.data.length > 0) {
      cars = carsRes.data.map((row: any) => (row.data ? row.data : row)) as Car[];
    }

    let bookings: BookingRequest[] | null = null;
    if (bookingsRes.data && Array.isArray(bookingsRes.data) && bookingsRes.data.length > 0) {
      bookings = bookingsRes.data.map((row: any) => (row.data ? row.data : row)) as BookingRequest[];
    }

    return { settings, cars, bookings };
  } catch (err: any) {
    if (isTableMissingError(err)) {
      console.warn('Supabase tables missing. Please run the SQL initialization script.');
    } else {
      console.warn('Could not fetch data from Supabase:', err?.message || err);
    }
    return { settings: null, cars: null, bookings: null };
  }
};

/**
 * Save settings to Supabase
 */
export const saveSettingsToSupabase = async (settings: AgencySettings): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('app_settings').upsert(
      {
        id: 'agency_settings',
        data: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      if (isTableMissingError(error)) {
        console.warn('Supabase table "app_settings" is missing. Please create it using the SQL script.');
      } else {
        console.error('Error saving settings to Supabase:', error.message || error);
      }
      return false;
    }

    return true;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      console.warn('Supabase table missing while saving settings.');
    } else {
      console.error('Exception saving settings to Supabase:', err?.message || err);
    }
    return false;
  }
};

/**
 * Fetch cars list directly from Supabase table public.cars
 */
export const fetchCarsFromSupabase = async (): Promise<{ cars: Car[] | null; error?: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { cars: null, error: 'Client Supabase non configuré (URL ou Clé manquante)' };
  }

  try {
    const { data, error } = await supabase.from('cars').select('*').order('updated_at', { ascending: false });

    if (error) {
      const errMsg = error.message || error.details || String(error);
      console.error('Erreur Supabase fetch cars:', error);
      return { cars: null, error: errMsg };
    }

    if (data && Array.isArray(data)) {
      const carsList = data.map((row: any) => {
        if (row.data) {
          return {
            ...row.data,
            id: row.id || row.data.id,
            carId: row.data.carId || row.id || row.data.id,
          };
        }
        return row;
      }) as Car[];
      return { cars: carsList };
    }

    return { cars: [] };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error('Exception Supabase fetch cars:', err);
    return { cars: null, error: errMsg };
  }
};

/**
 * Save a single car to Supabase (UPDATE if existing, INSERT if new)
 */
export const saveCarToSupabase = async (
  car: Car,
  isExisting?: boolean
): Promise<{ success: boolean; error?: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Client Supabase non initialisé (vérifiez SUPABASE_URL et SUPABASE_ANON_KEY)' };
  }

  try {
    const carId = car.id || car.carId || `car-${Date.now()}`;
    const carToStore: Car = {
      ...car,
      id: carId,
      carId: car.carId || carId,
    };

    const updated_at = new Date().toISOString();

    // 1. If explicit UPDATE for existing car
    if (isExisting) {
      const { data: updateData, error: updateError } = await supabase
        .from('cars')
        .update({
          data: carToStore,
          updated_at,
        })
        .eq('id', carId)
        .select();

      if (updateError) {
        const errMsg = updateError.message || updateError.details || String(updateError);
        console.error(`Erreur Supabase UPDATE car ${carId}:`, updateError);
        return { success: false, error: errMsg };
      }

      // If update matched 0 rows, fallback to upsert
      if (!updateData || updateData.length === 0) {
        const { error: upsertErr } = await supabase
          .from('cars')
          .upsert({ id: carId, data: carToStore, updated_at }, { onConflict: 'id' });

        if (upsertErr) {
          const errMsg = upsertErr.message || upsertErr.details || String(upsertErr);
          console.error(`Erreur Supabase UPSERT fallback car ${carId}:`, upsertErr);
          return { success: false, error: errMsg };
        }
      }

      return { success: true };
    }

    // 2. Otherwise INSERT for new car
    const { error: insertError } = await supabase.from('cars').insert([
      {
        id: carId,
        data: carToStore,
        updated_at,
      },
    ]);

    if (insertError) {
      // If error is duplicate key, try upsert
      if (insertError.code === '23505' || insertError.message?.includes('duplicate key')) {
        const { error: upsertError } = await supabase
          .from('cars')
          .upsert({ id: carId, data: carToStore, updated_at }, { onConflict: 'id' });

        if (upsertError) {
          const errMsg = upsertError.message || upsertError.details || String(upsertError);
          console.error(`Erreur Supabase UPSERT car ${carId}:`, upsertError);
          return { success: false, error: errMsg };
        }
        return { success: true };
      }

      const errMsg = insertError.message || insertError.details || String(insertError);
      console.error(`Erreur Supabase INSERT car ${carId}:`, insertError);
      return { success: false, error: errMsg };
    }

    return { success: true };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error('Exception Supabase save car:', err);
    return { success: false, error: errMsg };
  }
};

/**
 * Save cars list to Supabase (bulk helper)
 */
export const saveCarsToSupabase = async (cars: Car[]): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const uniqueCarsMap = new Map<string, Car>();
    cars.forEach((car, index) => {
      const carId = car.id || car.carId || `car-${index}-${Date.now()}`;
      uniqueCarsMap.set(carId, { ...car, id: carId });
    });

    const rows = Array.from(uniqueCarsMap.values()).map((car) => ({
      id: car.id,
      data: car,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length === 0) return true;

    const { error } = await supabase.from('cars').upsert(rows, { onConflict: 'id' });

    if (error) {
      if (isTableMissingError(error)) {
        console.warn('Supabase table "cars" is missing. Please create it using the SQL script in your Supabase SQL Editor.');
        return false;
      }

      console.warn('Bulk upsert cars failed, trying individual row upserts:', error.message || error);
      let successCount = 0;
      for (const row of rows) {
        const { error: rowErr } = await supabase.from('cars').upsert(row, { onConflict: 'id' });
        if (rowErr) {
          if (isTableMissingError(rowErr)) {
            console.warn('Supabase table "cars" is missing.');
            return false;
          }
          console.error(`Error saving car ${row.id} to Supabase:`, rowErr.message || rowErr);
        } else {
          successCount++;
        }
      }
      return successCount > 0;
    }
    return true;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      console.warn('Supabase table "cars" is missing.');
    } else {
      console.error('Exception saving cars to Supabase:', err?.message || err);
    }
    return false;
  }
};

/**
 * Delete a single car from Supabase
 */
export const deleteCarFromSupabase = async (
  carId: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Client Supabase non initialisé.' };
  }

  try {
    const { error } = await supabase.from('cars').delete().eq('id', carId);
    if (error) {
      const errMsg = error.message || error.details || String(error);
      console.error(`Erreur Supabase DELETE car ${carId}:`, error);
      return { success: false, error: errMsg };
    }
    return { success: true };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error('Exception Supabase delete car:', err);
    return { success: false, error: errMsg };
  }
};

/**
 * Save bookings list to Supabase
 */
export const saveBookingsToSupabase = async (bookings: BookingRequest[]): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const uniqueBookingsMap = new Map<string, BookingRequest>();
    bookings.forEach((b, index) => {
      const bId = b.id || `BK-${index}-${Date.now()}`;
      uniqueBookingsMap.set(bId, { ...b, id: bId });
    });

    const rows = Array.from(uniqueBookingsMap.values()).map((b) => ({
      id: b.id,
      data: b,
      created_at: b.createdAt || new Date().toISOString(),
    }));

    if (rows.length === 0) return true;

    const { error } = await supabase.from('bookings').upsert(rows, { onConflict: 'id' });

    if (error) {
      if (isTableMissingError(error)) {
        console.warn('Supabase table "bookings" is missing. Please create it using the SQL script.');
        return false;
      }

      console.warn('Bulk upsert bookings failed, trying individual row upserts:', error.message || error);
      let successCount = 0;
      for (const row of rows) {
        const { error: rowErr } = await supabase.from('bookings').upsert(row, { onConflict: 'id' });
        if (rowErr) {
          if (isTableMissingError(rowErr)) {
            return false;
          }
          console.error(`Error saving booking ${row.id} to Supabase:`, rowErr.message || rowErr);
        } else {
          successCount++;
        }
      }
      return successCount > 0;
    }
    return true;
  } catch (err: any) {
    if (!isTableMissingError(err)) {
      console.error('Exception saving bookings to Supabase:', err?.message || err);
    }
    return false;
  }
};

/**
 * Delete a single booking from Supabase
 */
export const deleteBookingFromSupabase = async (bookingId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) {
      console.error('Error deleting booking from Supabase:', error.message || error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Exception deleting booking from Supabase:', err?.message || err);
    return false;
  }
};
