import { BookingRequest, RentalOptions, Currency } from '../types';
import { OPTION_PRICES } from '../utils/constants';

export const bookingService = {
  calculateTotalDays(startDateStr: string, endDateStr: string): number {
    if (!startDateStr || !endDateStr) return 1;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  },

  calculatePrice(
    pricePerDayDZD: number,
    pricePerDayEUR: number,
    days: number,
    options: RentalOptions,
    currency: Currency
  ): { totalDZD: number; totalEUR: number; currentTotal: number } {
    let baseDZD = pricePerDayDZD * days;
    let baseEUR = pricePerDayEUR * days;

    let optionsDZD = 0;
    let optionsEUR = 0;

    if (options.fullInsurance) {
      optionsDZD += OPTION_PRICES.fullInsurance.dzd * days;
      optionsEUR += OPTION_PRICES.fullInsurance.eur * days;
    }
    if (options.additionalDriver) {
      optionsDZD += OPTION_PRICES.additionalDriver.dzd * days;
      optionsEUR += OPTION_PRICES.additionalDriver.eur * days;
    }
    if (options.childSeat) {
      optionsDZD += OPTION_PRICES.childSeat.dzd * days;
      optionsEUR += OPTION_PRICES.childSeat.eur * days;
    }
    if (options.gpsNavigation) {
      optionsDZD += OPTION_PRICES.gpsNavigation.dzd * days;
      optionsEUR += OPTION_PRICES.gpsNavigation.eur * days;
    }

    const totalDZD = baseDZD + optionsDZD;
    const totalEUR = baseEUR + optionsEUR;

    return {
      totalDZD,
      totalEUR,
      currentTotal: currency === 'EUR' ? totalEUR : totalDZD,
    };
  },

  generateWhatsAppMessage(booking: BookingRequest): string {
    const text = `*NOUVELLE RÉSERVATION TLEMCEN CAR* 🚗✨
-----------------------------------------
📌 *Véhicule :* ${booking.carName}
📅 *Prise en charge :* ${booking.pickupDate} à ${booking.pickupTime}
📍 *Lieu de prise :* ${booking.pickupLocation}
📅 *Restitution :* ${booking.returnDate} à ${booking.returnTime}
📍 *Lieu de retour :* ${booking.returnLocation}
⏱ *Durée :* ${booking.totalDays} jour(s)

👤 *Conducteur :* ${booking.driverInfo.fullName}
📞 *Téléphone :* ${booking.driverInfo.phone}
📧 *Email :* ${booking.driverInfo.email}
🆔 *Permis / Passeport :* ${booking.driverInfo.passportOrId}

💰 *Tarif Total Estumé :* ${booking.totalPrice} ${booking.currency === 'EUR' ? '€' : 'DA'}
🔒 *Caution :* ${booking.depositAmount} ${booking.currency === 'EUR' ? '€' : 'DA'}

${booking.driverInfo.specialRequests ? `📝 *Note :* ${booking.driverInfo.specialRequests}` : ''}
-----------------------------------------
_Demande soumise via tlemcen-car.com_`;

    return encodeURIComponent(text);
  },
};
