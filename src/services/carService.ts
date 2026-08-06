import { CARS_DATA } from '../data/carsData';
import { Car } from '../types';

export interface FilterOptions {
  category?: string;
  transmission?: string;
  fuel?: string;
  seats?: string;
  availability?: string;
  searchQuery?: string;
  minPriceDZD?: number;
  maxPriceDZD?: number;
}

let carsCache: Car[] | null = null;

const getStoredCars = (): Car[] => {
  if (carsCache && carsCache.length > 0) {
    return carsCache;
  }
  return CARS_DATA;
};

export const carService = {
  setCarsCache(cars: Car[]): void {
    carsCache = cars;
  },

  getAllCars(): Car[] {
    return getStoredCars();
  },

  getFeaturedCars(): Car[] {
    return getStoredCars().filter((car) => car.featured);
  },

  getCarById(id: string): Car | undefined {
    return getStoredCars().find((car) => car.id === id);
  },

  getCategories(): string[] {
    return ['Toutes', 'Luxe', 'Sport', 'SUV', 'Berline VIP', 'Économique Premium'];
  },

  getFuelTypes(): string[] {
    return ['Tous', 'Essence', 'Gazole', 'Hybride', 'Électrique'];
  },

  filterCars(options: FilterOptions, carsList?: Car[]): Car[] {
    const allCars = carsList && carsList.length > 0 ? carsList : getStoredCars();
    const {
      category = 'Toutes',
      transmission = 'Toutes',
      fuel = 'Tous',
      seats = 'Toutes',
      availability = 'Toutes',
      searchQuery = '',
      minPriceDZD = 0,
      maxPriceDZD = 100000,
    } = options;

    return allCars.filter((car) => {
      // Category match
      const matchCategory =
        category === 'Toutes' || category === '' || car.category === category;

      // Transmission match
      const matchTransmission =
        transmission === 'Toutes' ||
        transmission === '' ||
        car.transmission === transmission;

      // Fuel match
      const matchFuel = fuel === 'Tous' || fuel === '' || car.fuel === fuel;

      // Seats match
      let matchSeats = true;
      if (seats === '2-4 Places') {
        matchSeats = car.seats <= 4;
      } else if (seats === '5+ Places') {
        matchSeats = car.seats >= 5;
      }

      // Availability match
      let matchAvailability = true;
      if (availability === 'Disponible uniquement') {
        matchAvailability = car.available === true;
      } else if (availability === 'Sur Réservation / Loué') {
        matchAvailability = car.available === false;
      }

      // Price match
      const matchPrice =
        car.priceDZD >= minPriceDZD && car.priceDZD <= maxPriceDZD;

      // Instant Search match
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query) ||
        car.features.some((f) => f.toLowerCase().includes(query));

      return (
        matchCategory &&
        matchTransmission &&
        matchFuel &&
        matchSeats &&
        matchAvailability &&
        matchPrice &&
        matchSearch
      );
    });
  },
};

