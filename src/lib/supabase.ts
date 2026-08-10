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

// Attempt restoring from localStorage if empty
if ((!runtimeSupabaseUrl || !runtimeSupabaseKey) && typeof window !== 'undefined' && window.localStorage) {
  try {
    const savedSettings = localStorage.getItem('tlemcen_agency_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed?.supabaseConfig?.url && parsed?.supabaseConfig?.anonKey) {
        runtimeSupabaseUrl = parsed.supabaseConfig.url.trim();
        runtimeSupabaseKey = parsed.supabaseConfig.anonKey.trim();
      }
    }
  } catch (e) {
    // Ignore error
  }
}

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
  
  if (!runtimeSupabaseUrl || !runtimeSupabaseKey) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedSettings = localStorage.getItem('tlemcen_agency_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed?.supabaseConfig?.url && parsed?.supabaseConfig?.anonKey) {
            runtimeSupabaseUrl = parsed.supabaseConfig.url.trim();
            runtimeSupabaseKey = parsed.supabaseConfig.anonKey.trim();
          }
        }
      } catch (e) {
        // Ignore error
      }
    }
  }

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

-- 3. Table: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Grant full table permissions to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.app_settings TO anon, authenticated, service_role;
GRANT ALL ON public.cars TO anon, authenticated, service_role;
GRANT ALL ON public.bookings TO anon, authenticated, service_role;

-- 6. Policies for app_settings
DROP POLICY IF EXISTS "Allow public access to app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow public read app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow authenticated insert app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow authenticated update app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow authenticated delete app_settings" ON public.app_settings;
CREATE POLICY "Allow public access to app_settings" ON public.app_settings 
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Policies for cars
DROP POLICY IF EXISTS "Allow public access to cars" ON public.cars;
DROP POLICY IF EXISTS "Allow public read cars" ON public.cars;
DROP POLICY IF EXISTS "Allow authenticated insert cars" ON public.cars;
DROP POLICY IF EXISTS "Allow authenticated update cars" ON public.cars;
DROP POLICY IF EXISTS "Allow authenticated delete cars" ON public.cars;
CREATE POLICY "Allow public access to cars" ON public.cars 
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Policies for bookings
DROP POLICY IF EXISTS "Allow public access to bookings" ON public.bookings;
CREATE POLICY "Allow public access to bookings" ON public.bookings 
  FOR ALL USING (true) WITH CHECK (true);

-- 9. Storage Bucket "cars" for vehicle & agency images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cars', 'cars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 10. RLS Policies for Storage Objects in "cars" bucket
DROP POLICY IF EXISTS "Public Read Access for cars bucket" ON storage.objects;
CREATE POLICY "Public Read Access for cars bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'cars');

DROP POLICY IF EXISTS "Public Insert Access for cars bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert for cars bucket" ON storage.objects;
CREATE POLICY "Public Insert Access for cars bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cars');

DROP POLICY IF EXISTS "Public Update Access for cars bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update for cars bucket" ON storage.objects;
CREATE POLICY "Public Update Access for cars bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cars') WITH CHECK (bucket_id = 'cars');

DROP POLICY IF EXISTS "Public Delete Access for cars bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete for cars bucket" ON storage.objects;
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
