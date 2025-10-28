import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getCurrencyInfo, getCurrencyDisplayName } from '../../../src/lib/currency-utils';

interface CurrencyToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}

export function CurrencyToggle({ value, onValueChange, options, disabled = false }: CurrencyToggleProps) {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {options.map((option, index) => {
        const isActive = value === option;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const currencyInfo = getCurrencyInfo(option);
        
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              isActive && styles.activeOption,
              isFirst && styles.firstOption,
              isLast && styles.lastOption,
              disabled && styles.disabledOption,
            ]}
            onPress={() => !disabled && onValueChange(option)}
            disabled={disabled}
          >
            <Text style={[
              styles.optionText,
              isActive && styles.activeOptionText,
              disabled && styles.disabledOptionText,
            ]}>
              {currencyInfo ? `${currencyInfo.symbol} ${option}` : option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    minHeight: 36,
  },
  activeOption: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  firstOption: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  lastOption: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  disabledOption: {
    backgroundColor: 'transparent',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeOptionText: {
    color: '#111827',
    fontWeight: '600',
  },
  disabledOptionText: {
    color: '#9ca3af',
  },
});
