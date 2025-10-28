import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user as initialUser, transactions as initialTransactions, notifications as initialNotifications, paymentMethods as initialPaymentMethods, Transaction, Notification, PaymentMethod, AuthUser, mockUsers } from "../lib/data";

interface User {
  name: string;
  balance: number;
  currency: string;
}

interface AppContextState {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (methodId: string) => void;
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
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authToken, setAuthToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = await getStoredData('app_user', initialUser);
      const storedTransactions = await getStoredData('app_transactions', initialTransactions);
      const storedNotifications = await getStoredData('app_notifications', initialNotifications);
      const storedPaymentMethods = await getStoredData('app_payment_methods', initialPaymentMethods);
      const storedAuthToken = await getStoredData('auth_token', null);
      
      setUser(storedUser);
      setTransactions(storedTransactions);
      setNotifications(storedNotifications);
      setPaymentMethods(storedPaymentMethods);
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
        await AsyncStorage.setItem('auth_token', JSON.stringify(authToken));
      } catch (error) {
        console.error("Error writing to AsyncStorage:", error);
      }
    };

    storeData();
  }, [user, transactions, notifications, paymentMethods, authToken, isHydrated]);

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

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(initialUser);
      setTransactions(initialTransactions);
      setNotifications(initialNotifications);
      setPaymentMethods(initialPaymentMethods);
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
      
      // Update user data
      setUser({
        name: foundUser.name,
        balance: initialUser.balance, // Keep existing balance
        currency: 'USD', // Default currency
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

      // Update user data
      setUser({
        name: newUser.name,
        balance: initialUser.balance, // Start with default balance
        currency: 'USD', // Default currency
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
    transactions, 
    addTransaction, 
    notifications, 
    markNotificationsAsRead, 
    paymentMethods, 
    addPaymentMethod, 
    deletePaymentMethod, 
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
