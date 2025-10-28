import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextState {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextState | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load theme from storage on mount
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setThemeState(storedTheme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadTheme();
  }, []);

  // Apply theme changes
  React.useEffect(() => {
    if (!isHydrated) return;

    const applyTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // system theme - default to light for now
        // In a real app, you'd use Appearance API to detect system theme
        shouldBeDark = false;
      }

      setIsDarkMode(shouldBeDark);
    };

    applyTheme();
  }, [theme, isHydrated]);

  const setTheme = React.useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDarkMode, setTheme]);

  const value = { 
    theme, 
    isDarkMode, 
    setTheme, 
    toggleTheme 
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
