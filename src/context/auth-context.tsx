import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, mockUsers } from "../lib/data";
import { getCountryByCode } from "../lib/countries";

// Explicit type definitions to avoid complex inference
export interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<AuthUser, 'id' | 'password'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Explicit type for the context value
type AuthContextValue = AuthState;

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const getStoredData = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from AsyncStorage for key "${key}":`, error);
    return fallback;
  }
};

export function AuthProvider({ children, onHydrated }: { children: React.ReactNode; onHydrated?: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authToken, setAuthToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStoredData = async () => {
      const storedAuthToken = await getStoredData('auth_token', null);
      setAuthToken(storedAuthToken);
      setIsAuthenticated(!!storedAuthToken);
      onHydrated?.(); // Signal that auth data has been loaded
    };

    loadStoredData();
  }, [onHydrated]);

  React.useEffect(() => {
    if (authToken) {
      const storeData = async () => {
        try {
          await AsyncStorage.setItem('auth_token', JSON.stringify(authToken));
        } catch (error) {
          console.error("Error writing to AsyncStorage:", error);
        }
      };

      storeData();
    }
  }, [authToken]);

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
      
      // Set auth state immediately
      setAuthToken(token);
      setIsAuthenticated(true);

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

      // Set auth state immediately
      const token = `token_${Date.now()}_${newUser.id}`;
      setAuthToken(token);
      setIsAuthenticated(true);

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

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setAuthToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  // Explicitly typed context value to prevent type inference issues
  const value: AuthContextValue = {
    isAuthenticated,
    authToken,
    login,
    signup,
    verify2FA,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
