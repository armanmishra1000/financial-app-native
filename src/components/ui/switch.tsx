import React from 'react';
import { Switch as RNSwitch, View, Text, StyleSheet } from 'react-native';

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
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
        thumbColor={value ? '#ffffff' : '#9ca3af'}
        ios_backgroundColor="#e5e7eb"
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
    color: '#374151',
  },
});
