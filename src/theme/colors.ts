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
  background: '#0b1120',
  backgroundSubtle: '#111827',
  surface: '#111827',
  surfaceSubtle: '#0f172a',
  surfaceElevated: '#1f2937',
  border: '#1f2937',
  borderStrong: '#334155',
  text: '#f9fafb',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  heading: '#f8fafc',
  primary: '#60a5fa',
  primaryForeground: '#0b1120',
  primarySurface: '#1e3a8a',
  link: '#93c5fd',
  success: '#34d399',
  successForeground: '#042f2e',
  successSurface: '#065f46',
  danger: '#f87171',
  dangerForeground: '#450a0a',
  dangerSurface: '#7f1d1d',
  warning: '#fbbf24',
  warningSurface: '#78350f',
  icon: '#cbd5f5',
  iconMuted: '#64748b',
  iconActive: '#bfdbfe',
  mutedSurface: '#1f2937',
  overlay: 'rgba(15, 23, 42, 0.7)',
  divider: '#1e293b',
  inputBackground: '#0f172a',
  inputBorder: '#334155',
  shadowColor: 'rgba(2, 6, 23, 0.35)',
};

export const palettes: Record<ResolvedTheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

export function getThemeColors(theme: ResolvedTheme): ThemeColors {
  return palettes[theme];
}
