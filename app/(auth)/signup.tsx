import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useAppState, useThemeColors } from '../../src/context';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';
import { Select } from '../../src/components/ui/select';
import { countries, languages } from '../../src/lib/countries';


const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Please select a country'),
  language: z.string().min(1, 'Please select a language'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don’t match',
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signup } = useAuth();
  const { isHydrated } = useAppState();
  const colors = useThemeColors();
  const themedStyles = useMemo(() => createStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);
  

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: 'US',
      language: 'en',
      password: '',
      confirmPassword: '',
    },
  });

  

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const result = await signup(data);
      
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
    <ScrollView style={themedStyles.container} showsVerticalScrollIndicator={false}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>Create Account</Text>
        <Text style={themedStyles.subtitle}>Join us and start investing</Text>
      </View>

      <Card style={themedStyles.card}>
        <View style={themedStyles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...{ control, name: 'name' }}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
            {...{ control, name: 'email' }}
          />

          <Input
            label="Phone Number"
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            error={errors.phone?.message}
            {...{ control, name: 'phone' }}
          />

          <Select
            label="Country"
            placeholder="Select your country"
            items={countries.map(country => ({
              label: `${country.flag} ${country.name}`,
              value: country.code,
            }))}
            value={watch('country')}
            onValueChange={(value) => setValue('country', value)}
            error={errors.country?.message}
          />

          <Select
            label="Language"
            placeholder="Select your preferred language"
            items={languages.map(lang => ({
              label: lang.name,
              value: lang.code,
            }))}
            value={watch('language')}
            onValueChange={(value) => setValue('language', value)}
            error={errors.language?.message}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            error={errors.password?.message}
            {...{ control, name: 'password' }}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            error={errors.confirmPassword?.message}
            {...{ control, name: 'confirmPassword' }}
          />

          {errors.root?.message && (
            <Text style={themedStyles.errorText}>{errors.root.message}</Text>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={themedStyles.button}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <View style={themedStyles.footer}>
            <Text style={themedStyles.footerText}>Already have an account? </Text>
            <Button
              variant="link"
              onPress={() => router.push('/(auth)/login')}
            >
              Sign In
            </Button>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginVertical: 32,
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
  });
