import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user as initialUser, transactions as initialTransactions, notifications as initialNotifications, paymentMethods as initialPaymentMethods, Transaction, Notification, PaymentMethod, AuthUser, mockUsers, Plan, plans } from "../lib/data";
import { getCountryByCode } from "../lib/countries";
import { calculateDailyRate, calculateCurrentValue, calculateDaysRemaining, calculateProgress, calculateLockExpiry, isInvestmentLocked } from "../lib/investment-utils";

interface User {
  name: string;
  balance: number;
  currency: string; // Base storage currency (always USD)
  displayCurrency: string; // What user prefers to see
}

export type Investment = {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  startDate: string; // ISO string
  expectedEndDate: string; // ISO string
  status: 'Active' | 'Completed' | 'Cancelled';
  currency: string;
  lockedUntil: string; // ISO string - 30 days from start date
  isLocked: boolean; // Helper flag for quick lock status check
};

interface AppContextState {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setDisplayCurrency: (currency: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (methodId: string) => void;
  investments: Investment[];
  createInvestment: (investment: Omit<Investment, 'id' | 'startDate' | 'expectedEndDate' | 'status' | 'lockedUntil' | 'isLocked'>) => void;
  getInvestmentCurrentValue: (investmentId: string) => number;
  logout: () => void;
  isHydrated: boolean;
  // Authentication state
  isAuthenticated: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<AuthUser, 'id' | 'password'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = React.createContext<AppContextState | undefined>(undefined);

const getStoredData = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from AsyncStorage for key "${key}":`, error);
    return fallback;
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(initialUser);
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(initialPaymentMethods);
  const [investments, setInvestments] = React.useState<Investment[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authToken, setAuthToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = await getStoredData('app_user', initialUser);
      const storedTransactions = await getStoredData('app_transactions', initialTransactions);
      const storedNotifications = await getStoredData('app_notifications', initialNotifications);
      const storedPaymentMethods = await getStoredData('app_payment_methods', initialPaymentMethods);
      const storedInvestments = await getStoredData('app_investments', []);
      const storedAuthToken = await getStoredData('auth_token', null);
      
      setUser(storedUser);
      setTransactions(storedTransactions);
      setNotifications(storedNotifications);
      setPaymentMethods(storedPaymentMethods);
      setInvestments(storedInvestments);
      setAuthToken(storedAuthToken);
      setIsAuthenticated(!!storedAuthToken);
      setIsHydrated(true);
    };

    loadStoredData();
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('app_user', JSON.stringify(user));
        await AsyncStorage.setItem('app_transactions', JSON.stringify(transactions));
        await AsyncStorage.setItem('app_notifications', JSON.stringify(notifications));
        await AsyncStorage.setItem('app_payment_methods', JSON.stringify(paymentMethods));
        await AsyncStorage.setItem('app_investments', JSON.stringify(investments));
        await AsyncStorage.setItem('auth_token', JSON.stringify(authToken));
      } catch (error) {
        console.error("Error writing to AsyncStorage:", error);
      }
    };

    storeData();
  }, [user, transactions, notifications, paymentMethods, investments, authToken, isHydrated]);

  // Run investment growth simulation when app loads
  React.useEffect(() => {
    if (isHydrated && investments.length > 0) {
      simulateInvestmentGrowth();
    }
  }, [isHydrated, investments.length]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn${transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance + transaction.amount,
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm${paymentMethods.length + 1}`,
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const deletePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
  };

  const createInvestment = (investment: Omit<Investment, 'id' | 'startDate' | 'expectedEndDate' | 'status' | 'lockedUntil' | 'isLocked'>) => {
    const now = new Date();
    const startDate = now.toISOString();
    const expectedEndDate = new Date(now.getTime() + (investment.planId === 'p1' ? 7 : 
                                                      investment.planId === 'p2' ? 30 :
                                                      investment.planId === 'p3' ? 180 : 365) * 24 * 60 * 60 * 1000).toISOString();
    const lockedUntil = calculateLockExpiry(startDate);
    
    const newInvestment: Investment = {
      ...investment,
      id: `inv${investments.length + 1}`,
      startDate,
      expectedEndDate,
      lockedUntil,
      isLocked: true,
      status: 'Active',
    };
    
    setInvestments(prev => [...prev, newInvestment]);
  };

  const getInvestmentCurrentValue = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;
    
    // Find the plan to get ROI percentage
    const plan = plans.find((p: Plan) => p.id === investment.planId);
    if (!plan) return investment.amount;
    
    const dailyRate = calculateDailyRate(plan.roi_percent);
    return calculateCurrentValue(investment.amount, dailyRate, investment.startDate);
  };

  const simulateInvestmentGrowth = async () => {
    if (!isHydrated || investments.length === 0) return;
    
    try {
      // Get last app open date
      const lastOpenDate = await getStoredData('last_open_date', null);
      const now = new Date();
      
      // Process each active investment
      let totalEarnings = 0;
      const updatedInvestments = investments.map(investment => {
        if (investment.status !== 'Active') return investment;
        
        const plan = plans.find((p: Plan) => p.id === investment.planId);
        if (!plan) return investment;
        
        const dailyRate = calculateDailyRate(plan.roi_percent);
        const currentValue = calculateCurrentValue(investment.amount, dailyRate, investment.startDate);
        const earnings = currentValue - investment.amount;
        
        // Check if investment has matured
        const daysRemaining = calculateDaysRemaining(investment.startDate, plan.duration_days);
        if (daysRemaining === 0) {
          // Investment matured, create payout transaction
          addTransaction({
            type: 'Payout',
            amount: earnings,
            description: `${investment.planName} - Matured`,
          });
          
          return { ...investment, status: 'Completed' as const };
        }
        
        totalEarnings += earnings;
        return investment;
      });
      
      // Update investments
      setInvestments(updatedInvestments);
      
      // Add earnings to balance if there are any and time has passed
      if (totalEarnings > 0 && lastOpenDate) {
        const lastOpen = new Date(lastOpenDate);
        const hoursPassed = (now.getTime() - lastOpen.getTime()) / (1000 * 60 * 60);
        
        // Only add earnings if at least 1 hour has passed (to prevent constant updates)
        if (hoursPassed >= 1) {
          setUser(prevUser => ({
            ...prevUser,
            balance: prevUser.balance + totalEarnings,
          }));
          
          // Create a transaction for the earnings
          if (totalEarnings > 0.01) { // Only create transaction for meaningful earnings
            addTransaction({
              type: 'Payout',
              amount: totalEarnings,
              description: 'Investment Earnings',
            });
          }
        }
      }
      
      // Store current date as last open date
      await AsyncStorage.setItem('last_open_date', now.toISOString());
    } catch (error) {
      console.error('Error simulating investment growth:', error);
    }
  };

  const setDisplayCurrency = (currency: string) => {
    setUser(prev => ({ ...prev, displayCurrency: currency }));
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      // Use empty user state instead of initialUser to prevent showing Alex's profile
      const emptyUser = { name: '', balance: 0, currency: 'USD', displayCurrency: 'USD' };
      setUser(emptyUser);
      setTransactions(initialTransactions);
      setNotifications(initialNotifications);
      setPaymentMethods(initialPaymentMethods);
      setInvestments([]);
      setAuthToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Find user in mock database
      const foundUser = mockUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Generate mock token
      const token = `token_${Date.now()}_${foundUser.id}`;
      
      // Get user's country and set display currency accordingly
      const country = getCountryByCode(foundUser.country);
      const displayCurrency = country?.currency || 'USD';
      
      // Update user data
      setUser({
        name: foundUser.name,
        balance: initialUser.balance, // Keep existing balance
        currency: 'USD', // Base storage currency
        displayCurrency, // User's preferred display currency
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData: Omit<AuthUser, 'id' | 'password'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if email already exists
      const existingUser = mockUsers.find(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // In a real app, we'd save to database. For mock, we'll just proceed
      const newUser: AuthUser = {
        ...userData,
        id: `user_${Date.now()}`,
      };

      // Get user's country and set display currency accordingly
      const country = getCountryByCode(newUser.country);
      const displayCurrency = country?.currency || 'USD';

      // Update user data
      setUser({
        name: newUser.name,
        balance: initialUser.balance, // Start with default balance
        currency: 'USD', // Base storage currency
        displayCurrency, // User's preferred display currency
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const verify2FA = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Mock verification: any 6-digit code is valid
      if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        return { success: false, error: 'Invalid code. Please enter 6 digits.' };
      }

      // Generate and set auth token
      const token = `token_${Date.now()}`;
      setAuthToken(token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('2FA verification error:', error);
      return { success: false, error: 'Verification failed. Please try again.' };
    }
  };

  const value = { 
    user, 
    setUser, 
    setDisplayCurrency,
    transactions, 
    addTransaction, 
    notifications, 
    markNotificationsAsRead, 
    paymentMethods, 
    addPaymentMethod, 
    deletePaymentMethod, 
    investments,
    createInvestment,
    getInvestmentCurrentValue,
    simulateInvestmentGrowth,
    logout, 
    isHydrated,
    isAuthenticated,
    authToken,
    login,
    signup,
    verify2FA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
