import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { formatCurrencyAmount } from './currency-utils';

export function formatCurrency(amount: number, currency: string = 'USD') {
  return formatCurrencyAmount(amount, currency);
}
