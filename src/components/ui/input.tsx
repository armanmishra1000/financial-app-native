import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { useThemeColors } from '../../context';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  control?: Control<any>;
  name?: string;
}

export function Input({ label, error, helperText, style, control, name, ...props }: InputProps) {
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
              placeholderTextColor={colors.textMuted}
              value={value ?? ''}
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
        placeholderTextColor={colors.textMuted}
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

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    input: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.danger,
    },
    error: {
      fontSize: 14,
      color: colors.danger,
    },
    helper: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
