import { Car } from '../types';
import { AGENCY_DETAILS } from './constants';
import { formatPrice } from './currency';

export function getWhatsAppBookingUrl(
  car?: Car,
  pickupDate?: string,
  returnDate?: string,
  currency: 'DZD' | 'EUR' = 'DZD',
  whatsappNumber?: string,
  agencyName?: string
): string {
  const phone = whatsappNumber || AGENCY_DETAILS.whatsapp;
  const name = agencyName || AGENCY_DETAILS.name;

  if (!car) {
    const defaultMsg = encodeURIComponent(
      `Bonjour ${name}, je souhaite avoir des informations sur vos véhicules de luxe disponibles à Tlemcen ou à l'Aéroport Messali Hadj Zenata.`
    );
    return `https://wa.me/${phone}?text=${defaultMsg}`;
  }

  const priceFormatted = formatPrice(car.priceDZD, car.priceEUR, currency);
  let message = `Bonjour ${name} VIP 👋\n\n`;
  message += `Je souhaite réserver le véhicule suivant :\n`;
  message += `🚘 *${car.name}* (${car.brand} ${car.year})\n`;
  message += `💰 Tarif : *${priceFormatted} / jour*\n`;
  message += `⚡ Categorie : ${car.category}\n`;

  if (pickupDate && returnDate) {
    message += `📅 Date de prise en charge : ${pickupDate}\n`;
    message += `📅 Date de restitution : ${returnDate}\n`;
  } else {
    message += `📅 Période souhaitée : À préciser\n`;
  }

  message += `📍 Lieu : Tlemcen Ville / Aéroport Zenata\n\n`;
  message += `Merci de me confirmer la disponibilité et la procédure de validation de réservation.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
