import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Transaction } from '../lib/data';

interface TransactionFilterProps {
  selectedType: Transaction['type'] | 'All';
  onTypeChange: (type: Transaction['type'] | 'All') => void;
}

const filterOptions: Array<Transaction['type'] | 'All'> = [
  'All',
  'Deposit',
  'Withdrawal',
  'Investment',
  'Payout'
];

export function TransactionFilter({ selectedType, onTypeChange }: TransactionFilterProps) {
  return (
    <View style={styles.container}>
      {filterOptions.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onTypeChange(type)}
          style={[
            styles.filterButton,
            selectedType === type && styles.filterButtonActive
          ]}
        >
          <Text style={[
            styles.filterText,
            selectedType === type && styles.filterTextActive
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterTextActive: {
    color: '#ffffff',
  },
});
