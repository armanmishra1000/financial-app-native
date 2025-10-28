export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  phoneCode: string;
}

export interface Language {
  code: string;
  name: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', phoneCode: '+1' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', phoneCode: '+52' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', phoneCode: '+44' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', phoneCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', phoneCode: '+33' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', phoneCode: '+34' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', phoneCode: '+39' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', phoneCode: '+55' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', phoneCode: '+54' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', phoneCode: '+57' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: 'PEN', phoneCode: '+51' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', phoneCode: '+56' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', currency: 'VES', phoneCode: '+58' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', phoneCode: '+81' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY', phoneCode: '+86' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', phoneCode: '+91' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', phoneCode: '+61' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', phoneCode: '+64' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', phoneCode: '+65' },
];

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(language => language.code === code);
};
