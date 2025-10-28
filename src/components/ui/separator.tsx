import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal' }: SeparatorProps) {
  return (
    <View 
      style={[
        styles.separator,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#e5e7eb',
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
