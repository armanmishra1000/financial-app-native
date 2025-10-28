import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  items: Array<{ label: string; value: string }>;
  label?: string;
  error?: string;
  control?: Control<any>;
  name?: string;
}

export function Select({ 
  value, 
  onValueChange, 
  placeholder = "Select an option", 
  items,
  label,
  error,
  control,
  name
}: SelectProps) {
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value: fieldValue }, fieldState: { error: fieldError } }) => (
          <View style={styles.container}>
            {label && (
              <Text style={styles.label}>
                {label}
              </Text>
            )}
            <View style={[
              styles.pickerContainer,
              (fieldError?.message || error) && styles.pickerContainerError
            ]}>
              <Picker
                selectedValue={fieldValue}
                onValueChange={onChange}
                style={{ 
                  color: '#111827',
                  height: 48,
                }}
                itemStyle={{ color: '#111827' }}
              >
                {!fieldValue && (
                  <Picker.Item label={placeholder} value="" enabled={false} />
                )}
                {items.map((item) => (
                  <Picker.Item 
                    key={item.value} 
                    label={item.label} 
                    value={item.value} 
                  />
                ))}
              </Picker>
            </View>
            {(fieldError?.message || error) && (
              <Text style={styles.error}>
                {fieldError?.message || error}
              </Text>
            )}
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[
        styles.pickerContainer,
        error && styles.pickerContainerError
      ]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ 
            color: '#111827',
            height: 48,
          }}
          itemStyle={{ color: '#111827' }}
        >
          {!value && (
            <Picker.Item label={placeholder} value="" enabled={false} />
          )}
          {items.map((item) => (
            <Picker.Item 
              key={item.value} 
              label={item.label} 
              value={item.value} 
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  pickerContainerError: {
    borderColor: '#ef4444',
  },
  error: {
    fontSize: 14,
    color: '#ef4444',
  },
});
