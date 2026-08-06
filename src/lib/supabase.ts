import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgencySettings } from '../types/admin';
import { Car, BookingRequest } from '../types';

// Runtime configuration cache for Supabase credentials
let runtimeSupabaseUrl: string =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  '';

let runtimeSupabaseKey: string =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
  '';

let supabaseInstance: SupabaseClient | null = null;

export const setSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    runtimeSupabaseUrl = url.trim();
    runtimeSupabaseKey = key.trim();
    try {
      supabaseInstance = createClient(runtimeSupabaseUrl, runtimeSupabaseKey);
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
    }
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
  if (runtimeSupabaseUrl && runtimeSupabaseKey) {
    try {
      supabaseInstance = createClient(runtimeSupabaseUrl, runtimeSupabaseKey);
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

export const SUPABASE_SQL_SCHEMA = `-- SQL Schema for Tlemcen Car Luxury & Prestige
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Table: app_settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table: cars
CREATE TABLE IF NOT EXISTS public.cars (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- 4. Grant full table permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.app_settings TO anon, authenticated, service_role;
GRANT ALL ON public.cars TO anon, authenticated, service_role;

-- 5. Policies for app_settings
DROP POLICY IF EXISTS "Allow public access to app_settings" ON public.app_settings;
CREATE POLICY "Allow public access to app_settings" ON public.app_settings 
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Policies for cars
DROP POLICY IF EXISTS "Allow public access to cars" ON public.cars;
CREATE POLICY "Allow public access to cars" ON public.cars 
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Storage Bucket "cars" for vehicle & agency images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cars', 'cars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8. RLS Policies for Storage Objects in "cars" bucket
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
`;

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
 * Save cars list to Supabase
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
export const deleteCarFromSupabase = async (carId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('cars').delete().eq('id', carId);
    if (error) {
      if (!isTableMissingError(error)) {
        console.error('Error deleting car from Supabase:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    if (!isTableMissingError(err)) {
      console.error('Exception deleting car from Supabase:', err?.message || err);
    }
    return false;
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
