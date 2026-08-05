import { Currency } from '../types';

/**
 * Formats a number into a localized currency string.
 * Example for DZD: "15 000 DA"
 * Example for EUR: "75 €"
 */
export function formatPrice(
  amountDZD: number,
  amountEUR: number,
  currency: Currency
): string {
  if (currency === 'EUR') {
    return `${Math.round(amountEUR).toLocaleString('fr-FR')} €`;
  }
  return `${Math.round(amountDZD).toLocaleString('fr-FR')} DA`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('fr-FR');
}
