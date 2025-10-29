export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  backgroundSubtle: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  heading: string;
  primary: string;
  primaryForeground: string;
  primarySurface: string;
  link: string;
  success: string;
  successForeground: string;
  successSurface: string;
  danger: string;
  dangerForeground: string;
  dangerSurface: string;
  warning: string;
  warningSurface: string;
  icon: string;
  iconMuted: string;
  iconActive: string;
  mutedSurface: string;
  overlay: string;
  divider: string;
  inputBackground: string;
  inputBorder: string;
  shadowColor: string;
}

const lightColors: ThemeColors = {
  background: '#f9fafb',
  backgroundSubtle: '#f3f4f6',
  surface: '#ffffff',
  surfaceSubtle: '#f9fafb',
  surfaceElevated: '#ffffff',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  heading: '#111827',
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  primarySurface: '#eff6ff',
  link: '#2563eb',
  success: '#059669',
  successForeground: '#ffffff',
  successSurface: '#d1fae5',
  danger: '#dc2626',
  dangerForeground: '#ffffff',
  dangerSurface: '#fee2e2',
  warning: '#f59e0b',
  warningSurface: '#fef3c7',
  icon: '#4b5563',
  iconMuted: '#9ca3af',
  iconActive: '#1d4ed8',
  mutedSurface: '#f3f4f6',
  overlay: 'rgba(17, 24, 39, 0.6)',
  divider: '#e5e7eb',
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  shadowColor: 'rgba(15, 23, 42, 0.12)',
};

const darkColors: ThemeColors = {
  background: '#000000',
  backgroundSubtle: '#0a0a0a',
  surface: '#121212',
  surfaceSubtle: '#1a1a1a',
  surfaceElevated: '#2a2a2a',
  border: '#333333',
  borderStrong: '#555555',
  text: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#a0a0a0',
  heading: '#ffffff',
  primary: '#60a5fa',
  primaryForeground: '#000000',
  primarySurface: '#1e3a8a',
  link: '#93c5fd',
  success: '#34d399',
  successForeground: '#000000',
  successSurface: '#065f46',
  danger: '#f87171',
  dangerForeground: '#000000',
  dangerSurface: '#7f1d1d',
  warning: '#fbbf24',
  warningSurface: '#78350f',
  icon: '#e0e0e0',
  iconMuted: '#a0a0a0',
  iconActive: '#ffffff',
  mutedSurface: '#1a1a1a',
  overlay: 'rgba(0, 0, 0, 0.7)',
  divider: '#333333',
  inputBackground: '#1a1a1a',
  inputBorder: '#555555',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
};

export const palettes: Record<ResolvedTheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

export function getThemeColors(theme: ResolvedTheme): ThemeColors {
  return palettes[theme];
}
