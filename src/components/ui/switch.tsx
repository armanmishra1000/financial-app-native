import React from 'react';
import { Switch as RNSwitch, View, Text, StyleSheet } from 'react-native';

import { useThemeColors } from '../../context';

interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Switch({ 
  value = false, 
  onValueChange, 
  disabled = false, 
  label
}: SwitchProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }] }>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.divider, true: colors.primary }}
        thumbColor={value ? colors.primaryForeground : colors.iconMuted}
        ios_backgroundColor={colors.divider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
