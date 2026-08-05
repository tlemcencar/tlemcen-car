import React, { createContext, useContext, useState } from 'react';
import { Car, RentalOptions, BookingRequest } from '../types';
import { TLEMCEN_LOCATIONS } from '../utils/constants';

interface BookingSearchState {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  categoryFilter: string;
}

interface BookingContextType {
  searchState: BookingSearchState;
  setSearchState: React.Dispatch<React.SetStateAction<BookingSearchState>>;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  isModalOpen: boolean;
  openBookingModal: (car?: Car) => void;
  closeBookingModal: () => void;
  options: RentalOptions;
  setOptions: React.Dispatch<React.SetStateAction<RentalOptions>>;
  activeBookings: BookingRequest[];
  addBooking: (booking: BookingRequest) => void;
}

const defaultSearchState: BookingSearchState = {
  pickupLocation: TLEMCEN_LOCATIONS[0].name, // Default Aéroport Zenata
  returnLocation: TLEMCEN_LOCATIONS[0].name,
  pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
  pickupTime: '10:00',
  returnDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 3 days later
  returnTime: '10:00',
  categoryFilter: 'Toutes',
};

const defaultOptions: RentalOptions = {
  fullInsurance: false,
  additionalDriver: false,
  childSeat: false,
  gpsNavigation: false,
  airportDelivery: true,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchState, setSearchState] = useState<BookingSearchState>(defaultSearchState);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<RentalOptions>(defaultOptions);
  const [activeBookings, setActiveBookings] = useState<BookingRequest[]>([]);

  const openBookingModal = (car?: Car) => {
    if (car) {
      setSelectedCar(car);
    }
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
  };

  const addBooking = (booking: BookingRequest) => {
    setActiveBookings((prev) => [booking, ...prev]);
  };

  return (
    <BookingContext.Provider
      value={{
        searchState,
        setSearchState,
        selectedCar,
        setSelectedCar,
        isModalOpen,
        openBookingModal,
        closeBookingModal,
        options,
        setOptions,
        activeBookings,
        addBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
