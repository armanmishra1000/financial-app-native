import { Platform } from 'react-native';

export enum LayoutWidthClass {
  Compact = 'compact',
  Medium = 'medium',
  Expanded = 'expanded',
}

export const BREAKPOINTS = {
  compactMaxWidth: 599,
  mediumMaxWidth: 839,
} as const;

export const spacingScale = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export type SpacingToken = keyof typeof spacingScale;

export const typographyScale = {
  display: 34,
  headline: 28,
  title: 22,
  subtitle: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
} as const;

export type TypographyToken = keyof typeof typographyScale;

export const contentMaxWidths: Record<LayoutWidthClass, number> = {
  [LayoutWidthClass.Compact]: 540,
  [LayoutWidthClass.Medium]: 720,
  [LayoutWidthClass.Expanded]: 960,
};

export const horizontalPaddingByWidth: Record<LayoutWidthClass, number> = {
  [LayoutWidthClass.Compact]: spacingScale.lg,
  [LayoutWidthClass.Medium]: spacingScale.xl,
  [LayoutWidthClass.Expanded]: spacingScale.xxl,
};

export const navigationRailMinWidth = 600;

export const defaultTouchableHitSlop = Platform.select({
  android: { top: 12, bottom: 12, left: 12, right: 12 },
  ios: { top: 10, bottom: 10, left: 10, right: 10 },
  default: { top: 8, bottom: 8, left: 8, right: 8 },
});
