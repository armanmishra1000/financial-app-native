import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user as initialUser, transactions as initialTransactions, notifications as initialNotifications, paymentMethods as initialPaymentMethods, Transaction, Notification, PaymentMethod, Investment } from "../lib/data";
import { calculateDailyRate, calculateCurrentValue, calculateDaysRemaining, calculateProgress, calculateLockExpiry, isInvestmentLocked } from "../lib/investment-utils";

// Explicit type definitions to avoid complex inference
export interface User {
  name: string;
  balance: number;
  currency: string;
  displayCurrency: string;
}

export interface TransactionInput {
  type: 'Investment' | 'Withdrawal' | 'Deposit' | 'Payout';
  amount: number;
  description: string;
}

export interface PaymentMethodInput {
  type: 'Card' | 'Bank';
  provider: string;
  last4: string;
  expiry?: string;
}

export interface InvestmentInput {
  planId: string;
  planName: string;
  amount: number;
  currency: string;
}

export interface DataState {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setDisplayCurrency: (currency: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethodInput) => void;
  deletePaymentMethod: (methodId: string) => void;
  investments: Investment[];
  createInvestment: (investment: InvestmentInput) => void;
}

// Explicit type for the context value
type DataContextValue = DataState;

const DataContext = React.createContext<DataContextValue | undefined>(undefined);

const getStoredData = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from AsyncStorage for key "${key}":`, error);
    return fallback;
  }
};

export function DataProvider({ children, onHydrated }: { children: React.ReactNode; onHydrated?: () => void }) {
  const [user, setUser] = React.useState<User>(initialUser);
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(initialPaymentMethods);
  const [investments, setInvestments] = React.useState<Investment[]>([]);

  React.useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = await getStoredData('app_user', initialUser);
      const storedTransactions = await getStoredData('app_transactions', initialTransactions);
      const storedNotifications = await getStoredData('app_notifications', initialNotifications);
      const storedPaymentMethods = await getStoredData('app_payment_methods', initialPaymentMethods);
      const storedInvestments = await getStoredData('app_investments', []);
      
      setUser(storedUser);
      setTransactions(storedTransactions);
      setNotifications(storedNotifications);
      setPaymentMethods(storedPaymentMethods);
      setInvestments(storedInvestments);
      onHydrated?.(); // Signal that data has been loaded
    };

    loadStoredData();
  }, [onHydrated]);

  React.useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('app_user', JSON.stringify(user));
        await AsyncStorage.setItem('app_transactions', JSON.stringify(transactions));
        await AsyncStorage.setItem('app_notifications', JSON.stringify(notifications));
        await AsyncStorage.setItem('app_payment_methods', JSON.stringify(paymentMethods));
        await AsyncStorage.setItem('app_investments', JSON.stringify(investments));
      } catch (error) {
        console.error("Error writing to AsyncStorage:", error);
      }
    };

    storeData();
  }, [user, transactions, notifications, paymentMethods, investments]);

  const addTransaction = (transaction: TransactionInput) => {
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

  const addPaymentMethod = (method: PaymentMethodInput) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm${paymentMethods.length + 1}`,
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const deletePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
  };

  const createInvestment = (investment: InvestmentInput) => {
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

  

  const setDisplayCurrency = (currency: string) => {
    setUser(prev => ({ ...prev, displayCurrency: currency }));
  };

  // Explicitly typed context value to prevent type inference issues
  const value: DataContextValue = {
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
