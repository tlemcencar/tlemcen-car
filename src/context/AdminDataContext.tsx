import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, BookingRequest } from '../types';
import { AgencySettings, ToastMessage } from '../types/admin';
import { CARS_DATA } from '../data/carsData';
import { AGENCY_DETAILS } from '../utils/constants';
import { useSettings } from './SettingsContext';
import { carService } from '../services/carService';
import {
  fetchFromSupabase,
  saveCarsToSupabase,
  deleteCarFromSupabase,
  saveBookingsToSupabase,
  deleteBookingFromSupabase,
} from '../lib/supabase';

interface AdminDataContextType {
  cars: Car[];
  addCar: (carData: Omit<Car, 'id'>) => Promise<{ success: boolean; car?: Car; error?: string }>;
  updateCar: (id: string, carData: Partial<Car>) => Promise<{ success: boolean; error?: string }>;
  deleteCar: (id: string) => Promise<{ success: boolean; error?: string }>;
  duplicateCar: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleCarStatus: (id: string, newAvailable: boolean, nextDate?: string) => Promise<{ success: boolean; error?: string }>;
  reloadCarsFromSupabase: () => Promise<Car[]>;
  
  settings: AgencySettings;
  updateSettings: (newSettings: AgencySettings) => void;
  
  bookings: BookingRequest[];
  addBooking: (booking: BookingRequest) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;

  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const defaultSettings: AgencySettings = {
  name: AGENCY_DETAILS.name,
  tagline: AGENCY_DETAILS.tagline,
  logoUrl: '',
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
  },
};

const defaultInitialBookings: BookingRequest[] = [
  {
    id: 'BK-1001',
    carId: 'mercedes-g63-amg-2024',
    carName: 'Mercedes-AMG G63 V8 Biturbo',
    carImage: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop',
    pickupLocation: 'Aéroport Tlemcen Zenata (Messali Hadj)',
    returnLocation: 'Aéroport Tlemcen Zenata (Messali Hadj)',
    pickupDate: '2026-07-29',
    pickupTime: '14:00',
    returnDate: '2026-08-03',
    returnTime: '14:00',
    options: {
      fullInsurance: true,
      additionalDriver: true,
      childSeat: false,
      gpsNavigation: true,
      airportDelivery: true,
    },
    driverInfo: {
      fullName: 'Yassine Benali',
      email: 'yassine.benali@gmail.com',
      phone: '+213 661 22 33 44',
      driverLicenseNumber: 'DZ-982341-2018',
      passportOrId: '109823471',
      specialRequests: 'Livraison VIP directement devant le hall des arrivées.',
    },
    totalDays: 5,
    currency: 'DZD',
    totalPrice: 250000,
    depositAmount: 200000,
    status: 'confirmee',
    createdAt: '2026-07-28T10:15:00Z',
  },
  {
    id: 'BK-1002',
    carId: 'porsche-panamera-gts-2024',
    carName: 'Porsche Panamera GTS Executive',
    carImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    pickupLocation: 'Agence Centre-Ville Tlemcen',
    returnLocation: 'Agence Centre-Ville Tlemcen',
    pickupDate: '2026-07-30',
    pickupTime: '09:00',
    returnDate: '2026-08-01',
    returnTime: '18:00',
    options: {
      fullInsurance: true,
      additionalDriver: false,
      childSeat: false,
      gpsNavigation: false,
      airportDelivery: false,
    },
    driverInfo: {
      fullName: 'Karim Mansouri',
      email: 'k.mansouri@outlook.fr',
      phone: '+33 6 12 34 56 78',
      driverLicenseNumber: 'FR-887412-2015',
      passportOrId: '22987114',
      specialRequests: 'Demande de plein d\'essence au départ.',
    },
    totalDays: 2,
    currency: 'EUR',
    totalPrice: 400,
    depositAmount: 700,
    status: 'en_attente',
    createdAt: '2026-07-29T08:30:00Z',
  },
  {
    id: 'BK-1003',
    carId: 'audi-rs6-avant-2024',
    carName: 'Audi RS6 Avant Performance 600ch',
    carImage: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1200&auto=format&fit=crop',
    pickupLocation: 'Hôtel Renaissance Lalla Setti',
    returnLocation: 'Aéroport Tlemcen Zenata (Messali Hadj)',
    pickupDate: '2026-07-30',
    pickupTime: '11:00',
    returnDate: '2026-08-05',
    returnTime: '11:00',
    options: {
      fullInsurance: true,
      additionalDriver: true,
      childSeat: true,
      gpsNavigation: true,
      airportDelivery: true,
    },
    driverInfo: {
      fullName: 'Amine Ziane',
      email: 'a.ziane@group-dz.com',
      phone: '+213 552 44 55 66',
      driverLicenseNumber: 'DZ-112344-2020',
      passportOrId: '44512903',
      specialRequests: 'Siège enfant 3 ans svp.',
    },
    totalDays: 6,
    currency: 'DZD',
    totalPrice: 216000,
    depositAmount: 100000,
    status: 'confirmee',
    createdAt: '2026-07-29T02:10:00Z',
  },
];

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Cars state
  const [cars, setCars] = useState<Car[]>(() => {
    const formatted = CARS_DATA.map((c) => ({
      ...c,
      reservationUrl: c.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(c.carId || c.id)}&embed=true&theme=emerald`
    }));
    carService.setCarsCache(formatted);
    return formatted;
  });

  // 2. Settings state from SettingsContext
  const { settings, updateSettings: setGlobalSettings } = useSettings();

  // 3. Bookings state
  const [bookings, setBookings] = useState<BookingRequest[]>(defaultInitialBookings);

  // Fetch full store from Supabase / Express server on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // First attempt: Supabase
      try {
        const { cars: sbCars, bookings: sbBookings } = await fetchFromSupabase();

        if (isMounted && sbCars && Array.isArray(sbCars) && sbCars.length > 0) {
          const formattedCars = sbCars.map((c) => ({
            ...c,
            reservationUrl: c.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(c.carId || c.id)}&embed=true&theme=emerald`
          }));
          setCars(formattedCars);
          carService.setCarsCache(formattedCars);
        }

        if (isMounted && sbBookings && Array.isArray(sbBookings) && sbBookings.length > 0) {
          setBookings(sbBookings);
        }

        if (sbCars || sbBookings) return;
      } catch (err) {
        console.warn('Supabase load failed or not configured, trying server endpoint:', err);
      }

      // Second attempt: Express server fallback
      try {
        const res = await fetch('/api/admin/store');
        if (res.ok) {
          const data = await res.json();
          if (!isMounted || !data) return;

          if (Array.isArray(data.cars) && data.cars.length > 0) {
            const formattedCars = data.cars.map((c: any) => ({
              ...c,
              reservationUrl: c.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(c.carId || c.id)}&embed=true&theme=emerald`
            }));
            setCars(formattedCars);
            carService.setCarsCache(formattedCars);
          }

          if (Array.isArray(data.bookings) && data.bookings.length > 0) {
            setBookings(data.bookings);
          }
        }
      } catch (err) {
        console.warn('Could not load admin store from server:', err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize cars cache whenever cars state changes
  useEffect(() => {
    carService.setCarsCache(cars);
  }, [cars]);

  // Helper methods to post updates to Supabase and Server
  const saveCarsToServer = (updatedCars: Car[]) => {
    // Save to localStorage cache
    try {
      localStorage.setItem('tlemcen_cars_cache', JSON.stringify(updatedCars));
    } catch (e) {
      // ignore
    }
    carService.setCarsCache(updatedCars);

    // Save directly to Supabase
    saveCarsToSupabase(updatedCars);

    // Sync with Server endpoint
    fetch('/api/admin/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cars: updatedCars }),
    }).catch((err) => {
      console.error('Failed to sync cars to server:', err);
    });
  };

  const saveBookingsToServer = (updatedBookings: BookingRequest[]) => {
    // Save to localStorage cache
    try {
      localStorage.setItem('tlemcen_bookings_cache', JSON.stringify(updatedBookings));
    } catch (e) {
      // ignore
    }

    // Save directly to Supabase
    saveBookingsToSupabase(updatedBookings);

    // Sync with Server endpoint
    fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookings: updatedBookings }),
    }).catch((err) => {
      console.error('Failed to sync bookings to server:', err);
    });
  };

  // 4. Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload cars directly from Supabase to confirm persistence
  const reloadCarsFromSupabase = async (): Promise<Car[]> => {
    const res = await carService.fetchCars();
    if (res.error) {
      console.warn('Erreur lors du rechargement Supabase:', res.error);
      showToast('warning', 'Statut Supabase', res.error);
      return cars;
    }
    if (res.cars && Array.isArray(res.cars)) {
      const formattedCars = res.cars.map((c) => ({
        ...c,
        reservationUrl: c.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(c.carId || c.id)}&embed=true&theme=emerald`
      }));
      setCars(formattedCars);
      carService.setCarsCache(formattedCars);
      return formattedCars;
    }
    return cars;
  };

  // Car CRUD Operations with local persistence & Supabase sync
  const addCar = async (carData: Omit<Car, 'id'>): Promise<{ success: boolean; car?: Car; error?: string }> => {
    const newId = (carData.brand || 'car').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newCar: Car = {
      ...carData,
      id: newId,
      carId: carData.carId || newId,
      reservationUrl: carData.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(carData.carId || newId)}&embed=true&theme=emerald`
    };

    // 1. Save locally in React state, local cache & server store first
    const nextCars = [newCar, ...cars];
    setCars(nextCars);
    saveCarsToServer(nextCars);

    // 2. Sync directly with Supabase
    const saveRes = await carService.saveCar(newCar, false);

    if (!saveRes.success) {
      console.warn('Avertissement Supabase INSERT voiture:', saveRes.error);
      showToast(
        'warning',
        'Enregistré (Mode Local)',
        `Le véhicule "${newCar.name}" est enregistré localement. Supabase: ${saveRes.error || 'Erreur de connexion'}`
      );
      return { success: true, car: newCar, error: saveRes.error };
    }

    showToast('success', 'Enregistré dans Supabase', `${newCar.name} a été enregistré et synchronisé avec Supabase.`);
    return { success: true, car: newCar };
  };

  const updateCar = async (id: string, carData: Partial<Car>): Promise<{ success: boolean; error?: string }> => {
    const existing = cars.find((c) => c.id === id);
    const updatedCar: Car = {
      ...(existing || {} as Car),
      ...carData,
      id, // Preserve exact ID
    };

    // 1. Save locally in React state, local cache & server store first
    const nextCars = cars.map((c) => (c.id === id ? updatedCar : c));
    setCars(nextCars);
    saveCarsToServer(nextCars);

    // 2. Sync directly with Supabase
    const saveRes = await carService.saveCar(updatedCar, true);

    if (!saveRes.success) {
      console.warn(`Avertissement Supabase UPDATE voiture ${id}:`, saveRes.error);
      showToast(
        'warning',
        'Modifié (Mode Local)',
        `Modifications enregistrées localement. Supabase: ${saveRes.error || 'Erreur de connexion'}`
      );
      return { success: true, error: saveRes.error };
    }

    showToast('success', 'Synchronisé Supabase', `La modification de "${updatedCar.name}" a été enregistrée dans Supabase.`);
    return { success: true };
  };

  const deleteCar = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const carToDelete = cars.find((c) => c.id === id);

    // 1. Delete locally in React state, local cache & server store first
    const nextCars = cars.filter((c) => c.id !== id);
    setCars(nextCars);
    saveCarsToServer(nextCars);

    // 2. Sync directly with Supabase
    const res = await carService.deleteCar(id);

    if (!res.success) {
      console.warn(`Avertissement Supabase DELETE voiture ${id}:`, res.error);
      showToast(
        'warning',
        'Supprimé (Mode Local)',
        `Suppression appliquée localement. Supabase: ${res.error || 'Erreur'}`
      );
      return { success: true, error: res.error };
    }

    showToast('info', 'Supprimé de Supabase', `${carToDelete?.name || 'Le véhicule'} a été supprimé de Supabase.`);
    return { success: true };
  };

  const duplicateCar = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = cars.find((c) => c.id === id);
    if (!target) return { success: false, error: 'Véhicule non trouvé' };

    const newId = target.id + '-copy-' + Date.now().toString().slice(-4);
    const copyData: Omit<Car, 'id'> = {
      ...target,
      carId: newId,
      name: `${target.name} (Copie)`,
      featured: false,
    };

    return await addCar(copyData);
  };

  const toggleCarStatus = async (id: string, newAvailable: boolean, nextDate?: string): Promise<{ success: boolean; error?: string }> => {
    return await updateCar(id, {
      available: newAvailable,
      nextAvailableDate: newAvailable ? undefined : (nextDate || 'Demain à 14:00'),
    });
  };

  // Settings operations
  const updateSettings = (newSettings: AgencySettings) => {
    setGlobalSettings(newSettings);
    showToast('success', 'Paramètres sauvegardés', 'Les informations de l\'agence ont été mises à jour.');
  };

  // Booking operations
  const addBooking = (booking: BookingRequest) => {
    const updated = [booking, ...bookings];
    setBookings(updated);
    saveBookingsToServer(updated);
    showToast('success', 'Nouvelle réservation enregistrée', `Réservation pour ${booking.carName} créée.`);
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    saveBookingsToServer(updated);
    showToast('info', 'Statut mis à jour', `La réservation ${id} est désormais ${status}.`);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    deleteBookingFromSupabase(id);
    saveBookingsToServer(updated);
    showToast('warning', 'Réservation annulée', `La réservation ${id} a été supprimée.`);
  };

  return (
    <AdminDataContext.Provider
      value={{
        cars,
        addCar,
        updateCar,
        deleteCar,
        duplicateCar,
        toggleCarStatus,
        reloadCarsFromSupabase,
        settings,
        updateSettings,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
