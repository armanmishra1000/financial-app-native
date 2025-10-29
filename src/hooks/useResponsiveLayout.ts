import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BREAKPOINTS,
  LayoutWidthClass,
  contentMaxWidths,
  horizontalPaddingByWidth,
  spacingScale,
  typographyScale,
} from '../constants/layout';

export interface ResponsiveLayoutValues {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  widthClass: LayoutWidthClass;
  isCompact: boolean;
  isMedium: boolean;
  isExpanded: boolean;
  horizontalContentPadding: number;
  maxContentWidth: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing: typeof spacingScale;
  typography: typeof typographyScale;
  shouldShowNavigationRail: boolean;
}

const resolveWidthClass = (width: number): LayoutWidthClass => {
  if (width <= BREAKPOINTS.compactMaxWidth) {
    return LayoutWidthClass.Compact;
  }

  if (width <= BREAKPOINTS.mediumMaxWidth) {
    return LayoutWidthClass.Medium;
  }

  return LayoutWidthClass.Expanded;
};

export const useResponsiveLayout = (): ResponsiveLayoutValues => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const widthClass = useMemo(() => resolveWidthClass(width), [width]);

  const isCompact = widthClass === LayoutWidthClass.Compact;
  const isMedium = widthClass === LayoutWidthClass.Medium;
  const isExpanded = widthClass === LayoutWidthClass.Expanded;

  const horizontalContentPadding = useMemo(
    () => horizontalPaddingByWidth[widthClass],
    [widthClass]
  );

  const maxContentWidth = useMemo(
    () => contentMaxWidths[widthClass],
    [widthClass]
  );

  const orientation: 'portrait' | 'landscape' = width >= height ? 'landscape' : 'portrait';

  const shouldShowNavigationRail = isMedium || isExpanded;

  return {
    width,
    height,
    orientation,
    widthClass,
    isCompact,
    isMedium,
    isExpanded,
    horizontalContentPadding,
    maxContentWidth,
    safeAreaInsets: {
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
    },
    spacing: spacingScale,
    typography: typographyScale,
    shouldShowNavigationRail,
  };
};
