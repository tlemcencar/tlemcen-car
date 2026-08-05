import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, BookingRequest } from '../types';
import { AgencySettings, ToastMessage } from '../types/admin';
import { CARS_DATA } from '../data/carsData';
import { AGENCY_DETAILS } from '../utils/constants';
import { useSettings } from './SettingsContext';

interface AdminDataContextType {
  cars: Car[];
  addCar: (carData: Omit<Car, 'id'>) => Car;
  updateCar: (id: string, carData: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  duplicateCar: (id: string) => void;
  toggleCarStatus: (id: string, newAvailable: boolean, nextDate?: string) => void;
  
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
  // 1. Cars state with LocalStorage persistence
  const [cars, setCars] = useState<Car[]>(() => {
    let initialList = CARS_DATA;
    try {
      const saved = localStorage.getItem('tlemcen_cars');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialList = parsed;
        }
      }
    } catch (e) {
      console.error('Error reading cars from localStorage', e);
    }

    return initialList.map((c) => ({
      ...c,
      reservationUrl: c.reservationUrl || `https://tlemcen-car.onrender.com/?carId=${encodeURIComponent(c.carId || c.id)}&embed=true&theme=emerald`
    }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('tlemcen_cars', JSON.stringify(cars));
    } catch (e) {
      console.error('Error saving cars to localStorage', e);
    }
  }, [cars]);

  // 2. Settings state from SettingsContext
  const { settings, updateSettings: setGlobalSettings } = useSettings();

  // 3. Bookings state with LocalStorage persistence
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('tlemcen_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading bookings from localStorage', e);
    }
    return defaultInitialBookings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tlemcen_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error('Error saving bookings to localStorage', e);
    }
  }, [bookings]);

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

  // Car CRUD Operations
  const addCar = (carData: Omit<Car, 'id'>): Car => {
    const newId = carData.brand.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newCar: Car = {
      ...carData,
      id: newId,
    };
    setCars((prev) => [newCar, ...prev]);
    showToast('success', 'Véhicule ajouté !', `${newCar.name} a été créé avec succès.`);
    return newCar;
  };

  const updateCar = (id: string, carData: Partial<Car>) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...carData } : c))
    );
    showToast('success', 'Modifications enregistrées', `La fiche du véhicule a été mise à jour.`);
  };

  const deleteCar = (id: string) => {
    const carToDelete = cars.find((c) => c.id === id);
    setCars((prev) => prev.filter((c) => c.id !== id));
    showToast('info', 'Véhicule supprimé', `${carToDelete?.name || 'Le véhicule'} a été retiré de la flotte.`);
  };

  const duplicateCar = (id: string) => {
    const target = cars.find((c) => c.id === id);
    if (!target) return;

    const newId = target.id + '-copy-' + Date.now().toString().slice(-4);
    const copy: Car = {
      ...target,
      id: newId,
      name: `${target.name} (Copie)`,
      featured: false,
    };
    setCars((prev) => [copy, ...prev]);
    showToast('success', 'Véhicule dupliqué !', `Une copie de "${target.name}" a été créée.`);
  };

  const toggleCarStatus = (id: string, newAvailable: boolean, nextDate?: string) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            available: newAvailable,
            nextAvailableDate: newAvailable ? undefined : (nextDate || 'Demain à 14:00'),
          };
        }
        return c;
      })
    );
    showToast(
      newAvailable ? 'success' : 'warning',
      newAvailable ? 'Véhicule Activé' : 'Véhicule Loué / Réservé',
      newAvailable ? 'Le véhicule est à nouveau disponible à la réservation.' : 'Le statut a été passé en indisponible.'
    );
  };

  // Settings operations
  const updateSettings = (newSettings: AgencySettings) => {
    setGlobalSettings(newSettings);
    showToast('success', 'Paramètres sauvegardés', 'Les informations de l\'agence ont été mises à jour.');
  };

  // Booking operations
  const addBooking = (booking: BookingRequest) => {
    setBookings((prev) => [booking, ...prev]);
    showToast('success', 'Nouvelle réservation enregistrée', `Réservation pour ${booking.carName} créée.`);
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast('info', 'Statut mis à jour', `La réservation ${id} est désormais ${status}.`);
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
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
