import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'chauffeur-vip',
    title: 'Service Chauffeur VIP Privé',
    subtitle: 'Chauffeurs bilingues, expérimentés et discrets pour vos déplacements prestige',
    iconName: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop',
    description: 'Bénéficiez d\'un chauffeur professionnel en costume pour vos délégations, événements professionnels, réceptions privées ou visites guidées de la ville d\'art et d\'histoire de Tlemcen.',
    highlights: [
      'Chauffeurs bilingues (Français, Arabe, Anglais)',
      'Véhicules haut de gamme méticuleusement entretenus',
      'Ponctualité garantie & discrétion absolue',
      'Accueil pancarte à l\'aéroport Messali Hadj'
    ],
    priceTag: 'À partir de 15 000 DA / jour',
  },
  {
    id: 'transfert-aeroport-zenata',
    title: 'Transfert Aéroport Zenata - Tlemcen',
    subtitle: 'Prise en charge directe dès la sortie du terminal avec véhicule préparé',
    iconName: 'PlaneTakeoff',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
    description: 'Ne perdez pas une minute à votre arrivée à Tlemcen. Notre agent vous attend avec vos clés et votre contrat à la sortie des bagages de l\'aéroport Zenata - Messali Hadj.',
    highlights: [
      'Suivi en temps réel de votre vol en cas de retard',
      'Livraison & Restitution 24h/24 direct terminal',
      'Assistance bagages incluse',
      'Formalités administratives simplifiées en 3 minutes'
    ],
    priceTag: 'Livraison Gratuite sur réservation',
  },
  {
    id: 'location-longue-duree',
    title: 'Location Longue Durée (LLD / Achat)',
    subtitle: 'Formules flexibles pour entreprises, expatriés et résidents en Algérie',
    iconName: 'CalendarRange',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    description: 'Conservez un véhicule de prestige sur 1 à 12 mois sans vous soucier de la dépréciation, de l\'assurance ou de l\'entretien mécanique. Tarifs dégressifs exceptionnels.',
    highlights: [
      'Contrat sur mesure adaptable à vos besoins',
      'Véhicule de remplacement équivalent sous 2h',
      'Maintenance complète & pneumatiques inclus',
      'Facturation mensuelle claire pour votre entreprise'
    ],
    priceTag: 'Tarifs dégressifs jusqu\'à -40%',
  },
  {
    id: 'mariage-evenement-vip',
    title: 'Voitures de Mariage & Événements',
    subtitle: 'Sublimez vos fêtes et cortèges avec nos modèles d\'exception',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
    description: 'Faites de votre mariage à Tlemcen un moment inoubliable avec nos Mercedes G63 AMG, Classe S ou Range Rover Autobiography parés de décorations florales personnalisées.',
    highlights: [
      'Décoration florale de haute qualité sur demande',
      'Chauffeur en tenue de gala',
      'Packs cortège plusieurs véhicules disponibles',
      'Forfaits photos & shooting vidéo'
    ],
    priceTag: 'Forfaits Mariage sur mesure',
  },
  {
    id: 'assistance-247',
    title: 'Assistance & Dépannage VIP 24/7',
    subtitle: 'Une tranquillité d\'esprit totale partout en Algérie',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop',
    description: 'En cas d\'imprévu ou de crevaison, notre équipe d\'assistance intervient en un temps record dans toute la wilaya de Tlemcen et ses environs (Maghnia, Ghazaouet, Remchi, Oran).',
    highlights: [
      'Ligne téléphonique dédiée 24/7',
      'Remplacement immédiat du véhicule',
      'Assistance zéro franchise disponible',
      'Changement de pneu et remorquage gratuit'
    ],
    priceTag: 'Inclus dans tous nos contrats',
  },
];
