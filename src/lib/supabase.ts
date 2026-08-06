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

CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS) and grant full public access for anonymous key
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access to app_settings" ON app_settings;
CREATE POLICY "Allow public access to app_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to cars" ON cars;
CREATE POLICY "Allow public access to cars" ON cars FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to bookings" ON bookings;
CREATE POLICY "Allow public access to bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
`;

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
      supabase.from('app_settings').select('*').eq('id', 'agency_settings').single(),
      supabase.from('cars').select('*').order('updated_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ]);

    let settings: AgencySettings | null = null;
    if (settingsRes.data && settingsRes.data.data) {
      settings = settingsRes.data.data as AgencySettings;
    }

    let cars: Car[] | null = null;
    if (carsRes.data && Array.isArray(carsRes.data)) {
      cars = carsRes.data.map((row: any) => (row.data ? row.data : row)) as Car[];
    }

    let bookings: BookingRequest[] | null = null;
    if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
      bookings = bookingsRes.data.map((row: any) => (row.data ? row.data : row)) as BookingRequest[];
    }

    return { settings, cars, bookings };
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
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
    const { error } = await supabase.from('app_settings').upsert({
      id: 'agency_settings',
      data: settings,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error saving settings to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving settings to Supabase:', err);
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
    const rows = cars.map((car) => ({
      id: car.id || car.carId || `car-${Date.now()}`,
      data: car,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('cars').upsert(rows);

    if (error) {
      console.error('Error saving cars to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving cars to Supabase:', err);
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
      console.error('Error deleting car from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception deleting car from Supabase:', err);
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
    const rows = bookings.map((b) => ({
      id: b.id || `BK-${Date.now()}`,
      data: b,
      created_at: b.createdAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from('bookings').upsert(rows);

    if (error) {
      console.error('Error saving bookings to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving bookings to Supabase:', err);
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
      console.error('Error deleting booking from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception deleting booking from Supabase:', err);
    return false;
  }
};
