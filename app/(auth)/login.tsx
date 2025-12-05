import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useAppState, useThemeColors } from '../../src/context';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { isHydrated } = useAppState();
  const colors = useThemeColors();
  const themedStyles = useMemo(() => createStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        router.replace('/(auth)/verify-otp');
      } else {
        setError('root', { message: result.error });
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <View style={themedStyles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>Welcome Back</Text>
        <Text style={themedStyles.subtitle}>Sign in to your account</Text>
      </View>

      <Card style={themedStyles.card}>
        <View style={themedStyles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
            {...{ control, name: 'email' }}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password?.message}
            {...{ control, name: 'password' }}
          />

          {errors.root?.message && (
            <Text style={themedStyles.errorText}>{errors.root.message}</Text>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={themedStyles.button}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <View style={themedStyles.footer}>
            <Text style={themedStyles.footerText}>Don't have an account? </Text>
            <Button
              variant="link"
              onPress={() => router.push('/(auth)/signup')}
            >
              Sign Up
            </Button>
          </View>
        </View>
      </Card>

      <View style={themedStyles.demoInfo}>
        <Text style={themedStyles.demoTitle}>Demo Accounts:</Text>
        <Text style={themedStyles.demoText}>Email: demo@test.com</Text>
        <Text style={themedStyles.demoText}>Password: password123</Text>
        <Text style={themedStyles.demoText}>Email: alex@test.com</Text>
        <Text style={themedStyles.demoText}>Password: test123</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.heading,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textMuted,
    },
    card: {
      padding: 24,
      marginBottom: 24,
    },
    form: {
      gap: 16,
    },
    button: {
      marginTop: 8,
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 14,
    },
    demoInfo: {
      backgroundColor: colors.surfaceSubtle,
      padding: 16,
      borderRadius: 8,
    },
    demoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    demoText: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
  });
