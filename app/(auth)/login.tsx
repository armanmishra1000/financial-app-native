import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useAppState } from '../../src/context';
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
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.form}>
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
            <Text style={styles.errorText}>{errors.root.message}</Text>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button
              variant="link"
              onPress={() => router.push('/(auth)/signup')}
            >
              Sign Up
            </Button>
          </View>
        </View>
      </Card>

      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>Demo Accounts:</Text>
        <Text style={styles.demoText}>Email: demo@test.com</Text>
        <Text style={styles.demoText}>Password: password123</Text>
        <Text style={styles.demoText}>Email: alex@test.com</Text>
        <Text style={styles.demoText}>Password: test123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
    color: '#ef4444',
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
    color: '#6b7280',
    fontSize: 14,
  },
  demoInfo: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
});
