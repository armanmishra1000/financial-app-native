import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { Control, Controller, FieldValues, FieldPath } from 'react-hook-form';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  control?: Control<any>;
  name?: string;
}

export function Input({ label, error, helperText, style, control, name, ...props }: InputProps) {
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <View style={styles.container}>
            {label && (
              <Text style={styles.label}>
                {label}
              </Text>
            )}
            <TextInput
              style={[
                styles.input,
                (fieldError?.message || error) && styles.inputError,
                style
              ]}
              placeholderTextColor="#9ca3af"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              {...props}
            />
            {(fieldError?.message || error) && (
              <Text style={styles.error}>
                {fieldError?.message || error}
              </Text>
            )}
            {helperText && !(fieldError?.message || error) && (
              <Text style={styles.helper}>
                {helperText}
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
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text style={styles.helper}>
          {helperText}
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
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  error: {
    fontSize: 14,
    color: '#ef4444',
  },
  helper: {
    fontSize: 14,
    color: '#6b7280',
  },
});
