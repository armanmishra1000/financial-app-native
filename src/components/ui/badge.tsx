import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <View style={[
      styles.badge,
      variant === 'default' && styles.badgeDefault,
      variant === 'secondary' && styles.badgeSecondary,
      variant === 'destructive' && styles.badgeDestructive,
      variant === 'outline' && styles.badgeOutline
    ]}>
      <Text style={[
        styles.badgeText,
        variant === 'default' && styles.badgeTextDefault,
        variant === 'secondary' && styles.badgeTextSecondary,
        variant === 'destructive' && styles.badgeTextDestructive,
        variant === 'outline' && styles.badgeTextOutline
      ]}>
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
  badgeDefault: {
    backgroundColor: '#3b82f6',
  },
  badgeSecondary: {
    backgroundColor: '#f3f4f6',
  },
  badgeDestructive: {
    backgroundColor: '#ef4444',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeTextDefault: {
    color: '#ffffff',
  },
  badgeTextSecondary: {
    color: '#1f2937',
  },
  badgeTextDestructive: {
    color: '#ffffff',
  },
  badgeTextOutline: {
    color: '#1f2937',
  },
});
