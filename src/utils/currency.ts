import { Currency } from '../types';

export const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; prefix: string }> = {
  PKR: { rate: 1, symbol: 'Rs.', prefix: 'PKR ' },
  USD: { rate: 0.0036, symbol: '$', prefix: '$' },
  GBP: { rate: 0.0028, symbol: '£', prefix: '£' },
  AED: { rate: 0.0132, symbol: 'AED', prefix: 'AED ' },
};

export function formatPrice(amountPKR: number, currency: Currency = 'PKR'): string {
  const config = EXCHANGE_RATES[currency];
  if (!config) return `PKR ${amountPKR.toLocaleString()}`;

  if (currency === 'PKR') {
    return `PKR ${amountPKR.toLocaleString()}`;
  }

  const converted = Math.round(amountPKR * config.rate);
  return `${config.prefix}${converted.toLocaleString()}`;
}

export function formatPKR(amountPKR: number): string {
  return `PKR ${amountPKR.toLocaleString()}`;
}

