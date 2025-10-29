import { supportedCurrencies, CurrencyInfo } from './data';

/**
 * Convert amount from USD to target currency
 * @param amountUSD Amount in USD
 * @param targetCurrency Target currency code
 * @returns Amount in target currency
 */
export function convertFromUSD(amountUSD: number, targetCurrency: string): number {
  const currencyInfo = supportedCurrencies[targetCurrency];
  if (!currencyInfo) {
    console.warn(`Currency ${targetCurrency} not supported, returning USD amount. Available currencies: ${Object.keys(supportedCurrencies).join(', ')}`);
    return amountUSD;
  }
  
  return amountUSD * currencyInfo.rateToUSD;
}

/**
 * Convert amount from source currency to USD
 * @param amount Amount in source currency
 * @param sourceCurrency Source currency code
 * @returns Amount in USD
 */
export function convertToUSD(amount: number, sourceCurrency: string): number {
  const currencyInfo = supportedCurrencies[sourceCurrency];
  if (!currencyInfo) {
    console.warn(`Currency ${sourceCurrency} not supported, returning original amount. Available currencies: ${Object.keys(supportedCurrencies).join(', ')}`);
    return amount;
  }
  
  return amount / currencyInfo.rateToUSD;
}

/**
 * Get currency information by code
 * @param currencyCode Currency code
 * @returns Currency info object
 */
export function getCurrencyInfo(currencyCode: string): CurrencyInfo | null {
  return supportedCurrencies[currencyCode] || null;
}

/**
 * Format amount with proper currency symbol and decimal places
 * @param amount Amount to format
 * @param currencyCode Currency code
 * @param includeSymbol Whether to include currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrencyAmount(
  amount: number, 
  currencyCode: string, 
  includeSymbol: boolean = true
): string {
  const currencyInfo = getCurrencyInfo(currencyCode);
  if (!currencyInfo) {
    // Fallback to USD formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Format with proper decimal places
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: currencyInfo.decimalPlaces,
    maximumFractionDigits: currencyInfo.decimalPlaces,
  });

  if (!includeSymbol) {
    return formattedAmount;
  }

  // Add currency symbol
  return `${currencyInfo.symbol}${formattedAmount}`;
}

/**
 * Get exchange rate string for display
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Exchange rate string like "1 USD = 17.5 MXN"
 */
export function getExchangeRateString(fromCurrency: string, toCurrency: string): string {
  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);
  
  if (!fromInfo || !toInfo) {
    return 'Exchange rate unavailable';
  }

  // Convert 1 unit of fromCurrency to toCurrency
  const oneUSD = fromCurrency === 'USD' ? 1 : convertToUSD(1, fromCurrency);
  const convertedAmount = convertFromUSD(oneUSD, toCurrency);
  
  return `1 ${fromCurrency} = ${formatCurrencyAmount(convertedAmount, toCurrency)}`;
}

/**
 * Get list of supported currency codes
 * @returns Array of currency codes
 */
export function getSupportedCurrencyCodes(): string[] {
  return Object.keys(supportedCurrencies);
}

/**
 * Check if a currency is supported
 * @param currencyCode Currency code to check
 * @returns True if supported
 */
export function isCurrencySupported(currencyCode: string): boolean {
  return currencyCode in supportedCurrencies;
}

/**
 * Get currency display name with symbol
 * @param currencyCode Currency code
 * @returns Display name like "USD ($)" or "MXN (Mex$)"
 */
export function getCurrencyDisplayName(currencyCode: string): string {
  const info = getCurrencyInfo(currencyCode);
  if (!info) {
    return currencyCode;
  }
  
  return `${info.code} (${info.symbol})`;
}
