import { LocationOption } from '../types';

export const AGENCY_DETAILS = {
  name: 'Tlemcen Car',
  tagline: 'Location de Voitures de Luxe & Prestige à Tlemcen',
  phone: '+213 550 12 34 56',
  phoneFormatted: '+213 (0) 550 12 34 56',
  whatsapp: '213550123456',
  email: 'contact@tlemcen-car.com',
  address: 'Boulevard Mohamed V, Centre-Ville, 13000 Tlemcen, Algérie',
  airportBranch: 'Aéroport de Tlemcen - Zenata (Messali Hadj)',
  workingHours: '7j/7 - 24h/24 (Sur réservation)',
  officeHours: 'Lun - Dim: 08h00 - 20h00',
  exchangeRateEURtoDZD: 245, // Approximate official/informal reference rate for display flexibility
};

export const TLEMCEN_LOCATIONS: LocationOption[] = [
  {
    id: 'zenata-airport',
    name: 'Aéroport Tlemcen Zenata (Messali Hadj)',
    address: 'Aéroport Messali Hadj, Zenata, Tlemcen',
    isAirport: true,
    extraFeeDZD: 0, // Free airport delivery
  },
  {
    id: 'tlemcen-center',
    name: 'Agence Centre-Ville Tlemcen',
    address: 'Boulevard Mohamed V, Tlemcen',
    isAirport: false,
    extraFeeDZD: 0,
  },
  {
    id: 'mansourah',
    name: 'Mansourah - Agence Annexe',
    address: 'Rond-point Mansourah, Tlemcen',
    isAirport: false,
    extraFeeDZD: 0,
  },
  {
    id: 'hotel-renaissance',
    name: 'Hôtel Renaissance Lalla Setti',
    address: 'Plateau Lalla Setti, Tlemcen',
    isAirport: false,
    extraFeeDZD: 1000,
  },
  {
    id: 'imama',
    name: 'Quartier Imama (Gare routière)',
    address: 'Imama, Tlemcen',
    isAirport: false,
    extraFeeDZD: 0,
  },
  {
    id: 'custom-hotel',
    name: 'Livraison à votre Hôtel / Domicile Tlemcen',
    address: 'Livraison sur mesure dans la wilaya de Tlemcen',
    isAirport: false,
    extraFeeDZD: 2000,
  },
];

export const OPTION_PRICES = {
  fullInsurance: { dzd: 3000, eur: 15, name: 'Assurance Tous Risques Zéro Franchise' },
  additionalDriver: { dzd: 1500, eur: 8, name: 'Conducteur Additionnel Autorisoisé' },
  childSeat: { dzd: 1000, eur: 5, name: 'Siège Auto Bébé Homologué' },
  gpsNavigation: { dzd: 1000, eur: 5, name: 'GPS 3D & Wi-Fi Haut Débit Embarqué' },
  airportDelivery: { dzd: 0, eur: 0, name: 'Accueil VIP Aéroport Zenata (Gratuit)' },
};
