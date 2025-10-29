import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user as initialUser, transactions as initialTransactions, notifications as initialNotifications, paymentMethods as initialPaymentMethods, Transaction, Notification, PaymentMethod, Investment, getPlanById } from "../lib/data";
import { calculateLockExpiry, isInvestmentLocked } from "../lib/investment-utils";

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

export interface ProcessInvestmentParams {
  planId: string;
  amountUSD: number;
}

export type ProcessInvestmentResult =
  | { success: true; investment: Investment; transaction: Transaction }
  | { success: false; error: string };

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
  processInvestment: (input: ProcessInvestmentParams) => ProcessInvestmentResult;
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
      const storedInvestments = await getStoredData<Investment[]>('app_investments', []);
      const normalizedInvestments = storedInvestments.map((investment) => ({
        ...investment,
        isLocked: isInvestmentLocked(investment.lockedUntil),
      }));
      
      setUser(storedUser);
      setTransactions(storedTransactions);
      setNotifications(storedNotifications);
      setPaymentMethods(storedPaymentMethods);
      setInvestments(normalizedInvestments);
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

  const processInvestment = ({ planId, amountUSD }: ProcessInvestmentParams): ProcessInvestmentResult => {
    console.log('🔄 processInvestment called with:', { planId, amountUSD });
    const plan = getPlanById(planId);
    if (!plan) {
      console.log('❌ Plan not found:', planId);
      return { success: false, error: 'Selected plan was not found.' };
    }

    if (Number.isNaN(amountUSD) || amountUSD <= 0) {
      console.log('❌ Invalid amount:', amountUSD);
      return { success: false, error: 'Investment amount must be greater than zero.' };
    }

    if (amountUSD < plan.min_deposit) {
      console.log('❌ Amount too low:', amountUSD, 'min deposit:', plan.min_deposit);
      return {
        success: false,
        error: `The minimum deposit for ${plan.name} is ${plan.min_deposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD.`,
      };
    }

    console.log('💰 Current user balance:', user.balance, 'Requested amount:', amountUSD);
    if (user.balance < amountUSD) {
      console.log('❌ Insufficient balance');
      return { success: false, error: "You don't have enough balance to complete this investment." };
    }

    try {
      const now = new Date();
      const startDate = now.toISOString();
      const expectedEndDate = new Date(now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString();
      const lockedUntil = calculateLockExpiry(startDate);
      const lockState = isInvestmentLocked(lockedUntil);

      const timestamp = Date.now();
      const investment: Investment = {
        id: `inv${timestamp}`,
        planId: plan.id,
        planName: plan.name,
        amount: amountUSD,
        currency: 'USD',
        startDate,
        expectedEndDate,
        lockedUntil,
        isLocked: lockState,
        status: 'Active',
      };

      const transaction: Transaction = {
        id: `txn${timestamp}`,
        type: 'Investment',
        status: 'Completed',
        amount: -amountUSD,
        date: startDate.split('T')[0],
        description: plan.name,
      };

      console.log('💸 Creating investment:', investment);
      console.log('📋 Creating transaction:', transaction);
      
      setInvestments(prev => [investment, ...prev]);
      setTransactions(prev => [transaction, ...prev]);
      setUser(prevUser => {
        const newBalance = prevUser.balance - amountUSD;
        console.log('💵 Updating user balance from', prevUser.balance, 'to', newBalance);
        return {
          ...prevUser,
          balance: newBalance,
        };
      });

      console.log('✅ Investment processed successfully!');
      return { success: true, investment, transaction };
    } catch (error) {
      console.log('💥 Error during investment processing:', error);
      return { success: false, error: 'An unexpected error occurred while processing your investment.' };
    }
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
    processInvestment,
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
