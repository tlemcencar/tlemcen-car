export interface Car {
  id: string;
  carId?: string;
  reservationUrl?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: 'Luxe' | 'Sport' | 'SUV' | 'Berline VIP' | 'Économique Premium' | 'Cabriolet';
  priceDZD: number; // Price per day in Algerian Dinar
  priceEUR: number; // Price per day in Euros
  image: string;
  gallery: string[];
  transmission: 'Automatique' | 'Manuelle';
  fuel: 'Essence' | 'Gazole' | 'Hybride' | 'Électrique';
  seats: number;
  doors: number;
  powerHP: number; // Horsepower
  acceleration: string; // e.g. "4.2s 0-100"
  featured?: boolean;
  available: boolean;
  nextAvailableDate?: string;
  depositDZD: number; // Caution required
  depositEUR: number;
  features: string[];
  description: string;
  rating: number;
  reviewCount: number;
}

export interface LocationOption {
  id: string;
  name: string;
  address: string;
  isAirport?: boolean;
  extraFeeDZD?: number;
}

export interface RentalOptions {
  fullInsurance: boolean; // Assurance Tous Risques VIP
  additionalDriver: boolean; // Second conducteur
  childSeat: boolean; // Siège bébé
  gpsNavigation: boolean; // GPS / Wifi portable
  airportDelivery: boolean; // Livraison à l'aéroport Zenata
}

export interface BookingRequest {
  id?: string;
  carId: string;
  carName: string;
  carImage: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  options: RentalOptions;
  driverInfo: {
    fullName: string;
    email: string;
    phone: string;
    driverLicenseNumber: string;
    passportOrId: string;
    specialRequests?: string;
  };
  totalDays: number;
  currency: 'DZD' | 'EUR';
  totalPrice: number;
  depositAmount: number;
  status: 'en_attente' | 'confirmee' | 'terminee' | 'annulee';
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  city: string;
  avatar?: string;
  rating: number;
  date: string;
  carRented: string;
  comment: string;
  verified: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  image: string;
  description: string;
  highlights: string[];
  priceTag: string;
}

export interface FaqItem {
  id: string;
  category: 'Général' | 'Conditions & Documents' | 'Paiement & Caution' | 'Assurance & Assistance' | 'Aéroport & Livraison';
  question: string;
  answer: string;
}

export type Currency = 'DZD' | 'EUR';

export interface TlemcenSpot {
  id: string;
  name: string;
  category: string;
  image: string;
  fallbackImage?: string;
  recommendedCar: string;
  desc: string;
}
