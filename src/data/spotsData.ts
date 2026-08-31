import { TlemcenSpot } from '../types';
import lallaSettiImage from '../assets/images/lalla_setti_tower_1788102384722.jpg';

export const DEFAULT_SPOTS: TlemcenSpot[] = [
  {
    id: 'spot-lalla-setti',
    name: 'Plateau Lalla Setti & Hôtel Renaissance',
    category: 'Vue Panoramique & Détente VIP',
    image: lallaSettiImage,
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lalla_Setti_Tlemcen.jpg/800px-Lalla_Setti_Tlemcen.jpg',
    recommendedCar: 'Mercedes-AMG G 63 / Range Rover',
    desc: 'Survolez la cité de Tlemcen et profitez d\'une vue d\'exception. Idéal en SUV 4x4 ou Cabriolet.',
  },
  {
    id: 'spot-el-mechouar',
    name: 'Palais El Mechouar & Centre-Ville',
    category: 'Patrimoine & Histoire Zianide',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tlemcen_-_Palais_d%27El_Mechouar_%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D9%85%D8%B4%D9%88%D8%B1_%2829707211104%29.jpg/800px-Tlemcen_-_Palais_d%27El_Mechouar_%D9%82%D8%B5%D8%B1_%D8%A7%D9%84%D9%85%D8%B4%D9%88%D8%B1_%2829707211104%29.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
    recommendedCar: 'Mercedes Classe S / Audi RS6',
    desc: 'Flânez dans l\'hypercentre historique avec une berline élégante et discrète.',
  },
  {
    id: 'spot-mansourah',
    name: 'Ruines de Mansourah',
    category: 'Monument Historique Majeur',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mansourah-1.jpg/800px-Mansourah-1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
    recommendedCar: 'Cupra Formentor / Golf 8 R',
    desc: 'Découvrez la célèbre mosquée et le minaret de Mansourah au volant d\'une compacte dynamique.',
  },
  {
    id: 'spot-el-ourit',
    name: 'Cascades d\'El Ourit & Grottes de Béni Add',
    category: 'Espaces Naturels & Fraîcheur',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Cascades_d%27El-Ourit%2C_Tlemcen.jpg/800px-Cascades_d%27El-Ourit%2C_Tlemcen.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    recommendedCar: 'Hyundai Tucson / Range Rover',
    desc: 'Sillonnez les routes sinueuses du parc national de Tlemcen en toute sérénité.',
  },
];
