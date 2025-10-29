import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useThemeColors } from '../../context';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors = useThemeColors();

  const { backgroundColor, textColor, borderColor, borderWidth } = React.useMemo(() => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.mutedSurface,
          textColor: colors.text,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'destructive':
        return {
          backgroundColor: colors.dangerSurface,
          textColor: colors.dangerForeground,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.text,
          borderColor: colors.border,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.primaryForeground,
          borderColor: 'transparent',
          borderWidth: 0,
        };
    }
  }, [colors, variant]);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          borderWidth,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: textColor,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
