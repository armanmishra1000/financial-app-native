import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, useColorScheme } from 'react-native';

import { getThemeColors, ResolvedTheme, ThemeColors } from '../theme/colors';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isDarkMode: boolean;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextState | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('dark');
  const [hasLoadedTheme, setHasLoadedTheme] = React.useState(false);
  const systemColorScheme = useColorScheme();

  const applyThemePreference = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    const colorScheme = nextTheme === 'system' ? null : nextTheme;
    const appearanceWithSetter = Appearance as typeof Appearance & {
      setColorScheme?: (scheme: 'light' | 'dark' | null) => void;
    };
    appearanceWithSetter.setColorScheme?.(colorScheme);
  }, []);

  // Load theme from storage on mount
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          applyThemePreference(storedTheme as Theme);
        } else {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, 'dark');
          applyThemePreference('dark');
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
        applyThemePreference('dark');
      } finally {
        setHasLoadedTheme(true);
      }
    };

    void loadTheme();
  }, [applyThemePreference]);

  const resolvedTheme = React.useMemo<ResolvedTheme>(() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }, [systemColorScheme, theme]);

  const colors = React.useMemo(() => getThemeColors(resolvedTheme), [resolvedTheme]);

  const setTheme = React.useCallback(
    async (newTheme: Theme) => {
      if (theme === newTheme && hasLoadedTheme) {
        return;
      }

      applyThemePreference(newTheme);

      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.error('Error saving theme to storage:', error);
      }
    },
    [applyThemePreference, hasLoadedTheme, theme],
  );

  const toggleTheme = React.useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDarkMode: resolvedTheme === 'dark',
      colors,
      setTheme,
      toggleTheme,
    }),
    [colors, resolvedTheme, setTheme, theme, toggleTheme],
  );

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

export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}
