export type Transaction = {
  id: string;
  type: 'Investment' | 'Withdrawal' | 'Deposit' | 'Payout';
  status: 'Completed' | 'Pending' | 'Failed';
  amount: number;
  date: string;
  description: string;
};

export type Plan = {
  id:string;
  name: string;
  duration_days: number;
  roi_percent: number;
  bond_percent: number;
  platform_percent: number;
  min_deposit: number;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export type PaymentMethod = {
  id: string;
  type: 'Card' | 'Bank';
  provider: string; // e.g., 'Visa', 'Mastercard', 'Chase Bank'
  last4: string;
  expiry?: string; // e.g., '08/28'
};

export type CurrencyInfo = {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number; // 1 USD = rateToUSD * targetCurrency
  decimalPlaces: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  password: string; // In real app, this would be hashed
};

export const user = {
  name: 'Alex Doe',
  balance: 12700.00,
  currency: 'USD',
  displayCurrency: 'USD',
};

export const transactions: Transaction[] = [
  { id: 'txn5', type: 'Deposit', status: 'Completed', amount: 8000, date: '2025-09-12', description: 'Initial Deposit' },
  { id: 'txn4', type: 'Payout', status: 'Completed', amount: 1000, date: '2025-09-13', description: 'Plan Payout' },
  { id: 'txn3', type: 'Payout', status: 'Completed', amount: 500, date: '2025-09-14', description: 'Plan Payout' },
  { id: 'txn2', type: 'Deposit', status: 'Completed', amount: 2000, date: '2025-09-15', description: 'Bank Transfer' },
  { id: 'txn1', type: 'Payout', status: 'Completed', amount: 1200, date: '2025-09-16', description: 'Plan Payout' },
];

export const plans: Plan[] = [
    { id: "p1", name: "1 Week Plan", duration_days: 7, roi_percent: 2.0, bond_percent: 1.2, platform_percent: 0.8, min_deposit: 100 },
    { id: "p2", name: "1 Month Plan", duration_days: 30, roi_percent: 10.0, bond_percent: 6.0, platform_percent: 4.0, min_deposit: 500 },
    { id: "p3", name: "6 Month Plan", duration_days: 180, roi_percent: 40.0, bond_percent: 24.0, platform_percent: 16.0, min_deposit: 1000 },
    { id: "p4", name: "1 Year Plan", duration_days: 365, roi_percent: 90.0, bond_percent: 54.0, platform_percent: 36.0, min_deposit: 2500 }
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Investment Successful', description: 'Your $1000 investment in the New 1 Month Plan was successful.', date: '2025-09-14', read: false },
  { id: 'n2', title: 'Payout Received', description: 'You received a payout of $1200.00 from your 6 Month Plan.', date: '2025-09-14', read: true },
  { id: 'n3', title: 'Deposit Confirmed', description: 'Your deposit of $2000 has been confirmed.', date: '2025-09-15', read: true },
  { id: 'n4', title: 'New Plan Available', description: 'Check out the new "Gold Tier" investment plan for premium members.', date: '2025-09-11', read: true },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm1', type: 'Card', provider: 'Visa', last4: '4242', expiry: '08/28' },
  { id: 'pm2', type: 'Bank', provider: 'Chase Bank', last4: '9876' },
];

// Supported currencies with mock exchange rates
export const supportedCurrencies: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0, decimalPlaces: 2 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rateToUSD: 17.5, decimalPlaces: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.92, decimalPlaces: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.79, decimalPlaces: 2 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUSD: 1.35, decimalPlaces: 2 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUSD: 5.0, decimalPlaces: 2 },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', rateToUSD: 350.0, decimalPlaces: 2 },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', rateToUSD: 3800.0, decimalPlaces: 0 },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', rateToUSD: 3.7, decimalPlaces: 2 },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', rateToUSD: 950.0, decimalPlaces: 0 },
  VES: { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', rateToUSD: 35.0, decimalPlaces: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 150.0, decimalPlaces: 0 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToUSD: 7.2, decimalPlaces: 2 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUSD: 83.0, decimalPlaces: 2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.5, decimalPlaces: 2 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rateToUSD: 1.6, decimalPlaces: 2 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.3, decimalPlaces: 2 },
};

export const mockUsers: AuthUser[] = [
  {
    id: 'user1',
    name: 'Demo User',
    email: 'demo@test.com',
    phone: '+1234567890',
    country: 'US',
    language: 'en',
    password: 'password123',
  },
  {
    id: 'user2',
    name: 'Alex Doe',
    email: 'alex@test.com',
    phone: '+1987654321',
    country: 'US',
    language: 'en',
    password: 'test123',
  },
];
