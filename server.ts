import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'admin-store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_SETTINGS = {
  name: "Tlemcen Car Luxury & Prestige",
  tagline: "Location de Voitures de Luxe & VIP à Tlemcen",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#ff2e4d",
  phone: "+213 550 00 11 22",
  phoneFormatted: "+213 550 00 11 22",
  whatsapp: "213550001122",
  email: "contact@tlemcencar-luxury.com",
  address: "Boulevard Khedim Ali, Centre-Ville, Tlemcen, Algérie",
  airportBranch: "Comptoir VIP - Hall Arrivées, Aéroport Tlemcen Zenata (Messali Hadj)",
  workingHours: "7j/7 - 24h/24 (Assistance & Service VIP)",
  officeHours: "08:00 - 20:00 (Du Samedi au Jeudi)",
  locations: [
    {
      id: "zenata-airport",
      name: "Aéroport Tlemcen Zenata (Messali Hadj)",
      address: "Aéroport Messali Hadj, Zenata, Tlemcen",
      isAirport: true,
      extraFeeDZD: 0
    },
    {
      id: "tlemcen-center",
      name: "Agence Centre-Ville Tlemcen",
      address: "Boulevard Mohamed V, Tlemcen",
      isAirport: false,
      extraFeeDZD: 0
    },
    {
      id: "mansourah",
      name: "Mansourah - Agence Annexe",
      address: "Rond-point Mansourah, Tlemcen",
      isAirport: false,
      extraFeeDZD: 0
    },
    {
      id: "hotel-renaissance",
      name: "Hôtel Renaissance Lalla Setti",
      address: "Plateau Lalla Setti, Tlemcen",
      isAirport: false,
      extraFeeDZD: 1000
    },
    {
      id: "imama",
      name: "Quartier Imama (Gare routière)",
      address: "Imama, Tlemcen",
      isAirport: false,
      extraFeeDZD: 0
    },
    {
      id: "custom-hotel",
      name: "Livraison à votre Hôtel / Domicile Tlemcen",
      address: "Livraison sur mesure dans la wilaya de Tlemcen",
      isAirport: false,
      extraFeeDZD: 2000
    }
  ],
  socials: {
    instagram: "https://instagram.com/tlemcencar_luxury",
    facebook: "https://facebook.com/tlemcencar",
    tiktok: "https://tiktok.com/@tlemcencar",
    youtube: "https://youtube.com/@tlemcencar"
  }
};

const DEFAULT_CARS = [
  {
    id: "mercedes-g63-amg",
    carId: "mercedes-g63-amg",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=5a311ed7-cfc0-491f-89c3-aa6f676af4c0&embed=true&theme=emerald",
    name: "Mercedes-AMG G 63 V8 BiTurbo",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    year: 2024,
    category: "Luxe",
    priceDZD: 45000,
    priceEUR: 210,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    doors: 5,
    powerHP: 585,
    acceleration: "4.5s (0-100 km/h)",
    featured: true,
    available: true,
    depositDZD: 250000,
    depositEUR: 1000,
    features: [
      "Échappement sport AMG commutable",
      "Intérieur cuir Nappa intégral rouge/noir",
      "Système audio Burmester 3D Surround",
      "Toit ouvrant panoramique",
      "Caméra 360° & PARKTRONIC",
      "Suspension pneumatique adaptative"
    ],
    description: "Le tout dernier Mercedes G63 AMG incarne la puissance brute alliée à un luxe ultime. Parfait pour vos déplacements d'exception à Tlemcen, événements VIP ou accueils prestige à l'Aéroport Messali Hadj.",
    rating: 4.95,
    reviewCount: 38
  },
  {
    id: "porsche-911-carrera-s",
    carId: "porsche-911-carrera-s",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=porsche-911-carrera-s&embed=true&theme=emerald",
    name: "Porsche 911 Carrera S Cabriolet",
    brand: "Porsche",
    model: "911 Carrera S",
    year: 2023,
    category: "Sport",
    priceDZD: 40000,
    priceEUR: 190,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 4,
    doors: 2,
    powerHP: 450,
    acceleration: "3.7s (0-100 km/h)",
    featured: true,
    available: true,
    depositDZD: 200000,
    depositEUR: 900,
    features: [
      "Boîte PDK 8 rapports",
      "Pack Chrono Sport",
      "Système échappement sport déconnectable",
      "Sièges sport adaptatifs 18 positions",
      "Écran tactile Porsche Communication Management"
    ],
    description: "Vivez le plaisir de conduire une véritable icône automobile le long de la corniche de Tlemcen et des routes du plateau de Lalla Setti. Élégance incontournable.",
    rating: 4.98,
    reviewCount: 42
  },
  {
    id: "range-rover-vogue-autobiography",
    carId: "range-rover-vogue-autobiography",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=range-rover-vogue-autobiography&embed=true&theme=emerald",
    name: "Range Rover Autobiography P530",
    brand: "Land Rover",
    model: "Range Rover Vogue",
    year: 2024,
    category: "SUV",
    priceDZD: 38000,
    priceEUR: 175,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    doors: 5,
    powerHP: 530,
    acceleration: "4.6s (0-100 km/h)",
    featured: true,
    available: true,
    depositDZD: 180000,
    depositEUR: 800,
    features: [
      "Moteur V8 Twin Turbo 530ch",
      "Sièges arrière Executive Class avec massage",
      "Système audio Meridian Signature 1600W",
      "Portes à fermeture assistée Soft Close",
      "Suspension pneumatique prédictive"
    ],
    description: "Le summum du luxe britannique. Un SUV prestigieux idéal pour voyager en toute sérénité avec chauffeur ou en conduite personnelle à travers Tlemcen et l'Ouest Algérien.",
    rating: 4.92,
    reviewCount: 29
  },
  {
    id: "audi-rs6-avant-2024",
    carId: "audi-rs6-avant-2024",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=audi-rs6-avant-2024&embed=true&theme=emerald",
    name: "Audi RS6 Avant Performance 600ch",
    brand: "Audi",
    model: "RS6 Avant",
    year: 2024,
    category: "Sport",
    priceDZD: 36000,
    priceEUR: 165,
    image: "https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    doors: 5,
    powerHP: 600,
    acceleration: "3.4s (0-100 km/h)",
    featured: false,
    available: true,
    depositDZD: 150000,
    depositEUR: 700,
    features: [
      "Transmission intégrale Quattro Sport",
      "Freins Céramique RS",
      "Pack Carbone Extérieur & Intérieur",
      "Affichage Tête Haute & Virtual Cockpit RS",
      "Échappement Sport RS"
    ],
    description: "Un break supersonique alliant la polyvalence d'un grand coffre familial aux performances brutes d'une supercar. Un choix d'esthète pour parcourir la région de Tlemcen.",
    rating: 4.97,
    reviewCount: 31
  },
  {
    id: "mercedes-maybach-s680",
    carId: "mercedes-maybach-s680",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=mercedes-maybach-s680&embed=true&theme=emerald",
    name: "Mercedes-Maybach Classe S 680 V12",
    brand: "Mercedes-Maybach",
    model: "Classe S 680",
    year: 2024,
    category: "Berline VIP",
    priceDZD: 50000,
    priceEUR: 230,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 4,
    doors: 4,
    powerHP: 612,
    acceleration: "4.5s (0-100 km/h)",
    featured: true,
    available: true,
    depositDZD: 300000,
    depositEUR: 1200,
    features: [
      "Moteur V12 BiTurbo 6.0L",
      "Peinture Bicolore Maybach exclusive",
      "Sièges First-Class chauffants, ventilés & massants",
      "Compartiment réfrigéré arrière avec flûtes à champagne",
      "Chauffeur privé disponible sur demande"
    ],
    description: "Le summum absolu de l'automobile mondiale. La Mercedes-Maybach S680 offre une expérience de voyage digne des plus grands dignitaires et stars mondiales à Tlemcen.",
    rating: 5.0,
    reviewCount: 19
  },
  {
    id: "bmw-m5-competition-2024",
    carId: "bmw-m5-competition-2024",
    reservationUrl: "https://tlemcen-car.onrender.com/?carId=bmw-m5-competition-2024&embed=true&theme=emerald",
    name: "BMW M5 Competition V8 625ch",
    brand: "BMW",
    model: "M5 Competition",
    year: 2024,
    category: "Berline VIP",
    priceDZD: 32000,
    priceEUR: 150,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"
    ],
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    doors: 4,
    powerHP: 625,
    acceleration: "3.3s (0-100 km/h)",
    featured: false,
    available: true,
    depositDZD: 150000,
    depositEUR: 700,
    features: [
      "Transmission M xDrive réglable 2WD/4WD",
      "Toit en carbone M",
      "Échappement M Sport",
      "Système son Bowers & Wilkins Diamond",
      "Volant M multifonction cuir"
    ],
    description: "La berline de sport par excellence. Alliant discrétion, élégance et accélération phénoménale, la BMW M5 Competition garantit des sensations uniques sur les routes tlemcéniennes.",
    rating: 4.91,
    reviewCount: 22
  }
];

const DEFAULT_BOOKINGS = [
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
  }
];

function readAdminStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        cars: Array.isArray(parsed.cars) ? parsed.cars : DEFAULT_CARS,
        settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : DEFAULT_SETTINGS,
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : DEFAULT_BOOKINGS,
      };
    }
  } catch (err) {
    console.error('Error reading admin store from disk:', err);
  }

  const initialData = {
    cars: DEFAULT_CARS,
    settings: DEFAULT_SETTINGS,
    bookings: DEFAULT_BOOKINGS,
  };
  writeAdminStore(initialData);
  return initialData;
}

function writeAdminStore(data: { cars?: any[]; settings?: any; bookings?: any[] }) {
  try {
    const current = fs.existsSync(STORE_FILE) ? JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8')) : {};
    const updated = {
      cars: Array.isArray(data.cars) ? data.cars : (current.cars || DEFAULT_CARS),
      settings: data.settings && typeof data.settings === 'object' ? data.settings : (current.settings || DEFAULT_SETTINGS),
      bookings: Array.isArray(data.bookings) ? data.bookings : (current.bookings || DEFAULT_BOOKINGS),
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error writing admin store to disk:', err);
    throw err;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 50mb limit for large base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Middleware global de sécurité pour autoriser l'affichage en iframe sur tous les domaines
  app.use((req, res, next) => {
    // Supprime impérativement les en-têtes bloquants X-Frame-Options (DENY et SAMEORIGIN)
    res.removeHeader('X-Frame-Options');

    // Définit la Content-Security-Policy permissive pour frame-ancestors
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors * 'self' http: https:;"
    );

    // En-têtes CORS pour les requêtes inter-domaines
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  });

  // Admin Data Persistence API Endpoints
  app.get('/api/admin/store', (req, res) => {
    try {
      const store = readAdminStore();
      res.json(store);
    } catch (error) {
      console.error('Error getting admin store:', error);
      res.status(500).json({ error: 'Failed to read admin store' });
    }
  });

  app.post('/api/admin/store', (req, res) => {
    try {
      const updated = writeAdminStore(req.body);
      res.json({ success: true, store: updated });
    } catch (error) {
      console.error('Error updating admin store:', error);
      res.status(500).json({ error: 'Failed to save admin store' });
    }
  });

  app.post('/api/admin/cars', (req, res) => {
    try {
      const { cars } = req.body;
      const current = readAdminStore();
      const updated = writeAdminStore({ ...current, cars });
      res.json({ success: true, cars: updated.cars });
    } catch (error) {
      console.error('Error saving cars:', error);
      res.status(500).json({ error: 'Failed to save cars' });
    }
  });

  app.post('/api/admin/settings', (req, res) => {
    try {
      const { settings } = req.body;
      const current = readAdminStore();
      const updated = writeAdminStore({ ...current, settings });
      res.json({ success: true, settings: updated.settings });
    } catch (error) {
      console.error('Error saving settings:', error);
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  app.post('/api/admin/bookings', (req, res) => {
    try {
      const { bookings } = req.body;
      const current = readAdminStore();
      const updated = writeAdminStore({ ...current, bookings });
      res.json({ success: true, bookings: updated.bookings });
    } catch (error) {
      console.error('Error saving bookings:', error);
      res.status(500).json({ error: 'Failed to save bookings' });
    }
  });

  // Proxy endpoint pour les besoins de contournement si nécessaire
  app.get('/api/calendar-proxy', async (req, res) => {
    try {
      const carId = (req.query.carId as string) || '';
      const embed = (req.query.embed as string) || 'true';
      const theme = (req.query.theme as string) || 'emerald';

      const baseUrl = 'https://ais-pre-w6q7qyr42nk3bptuxxwiqy-637410863631.europe-west2.run.app';
      const targetUrl = `${baseUrl}/?carId=${encodeURIComponent(carId)}&embed=${encodeURIComponent(embed)}&theme=${encodeURIComponent(theme)}`;

      const resInit = await fetch(targetUrl, { redirect: 'manual' });
      const initCookies = typeof resInit.headers.getSetCookie === 'function'
        ? resInit.headers.getSetCookie()
        : [resInit.headers.get('set-cookie')].filter(Boolean) as string[];

      let cookieHeader = initCookies.map(c => c.split(';')[0]).join('; ');
      if (cookieHeader) {
        cookieHeader += '; __SECURE-aistudio_auth_flow_test=true';
      } else {
        cookieHeader = '__SECURE-aistudio_auth_flow_test=true';
      }

      let currentUrl = `${targetUrl}&__aistudio_auth_flow=true`;
      let html = '';
      let redirects = 0;

      while (redirects < 10) {
        const response = await fetch(currentUrl, {
          headers: {
            'Cookie': cookieHeader,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'manual',
        });

        const setCookies = typeof response.headers.getSetCookie === 'function'
          ? response.headers.getSetCookie()
          : [response.headers.get('set-cookie')].filter(Boolean) as string[];

        if (setCookies && setCookies.length > 0) {
          const newCookies = setCookies.map(c => c.split(';')[0]).join('; ');
          cookieHeader = `${cookieHeader}; ${newCookies}`;
        }

        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            currentUrl = new URL(location, currentUrl).toString();
            redirects++;
            continue;
          }
        }

        html = await response.text();
        break;
      }

      const baseTag = `<base href="${baseUrl}/" />`;
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' http: https:;");
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(html);
    } catch (error) {
      console.error('Error in calendar proxy:', error);
      res.status(500).send('Error');
    }
  });

  // Health check API route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Serveur Vite en dev / Fichiers statiques dist en prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' http: https:;");
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

