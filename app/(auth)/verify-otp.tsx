import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth, useAppState, useThemeColors } from '../../src/context';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';
import { OtpInput } from 'react-native-otp-entry';

export default function VerifyOTPScreen() {
  const { verify2FA } = useAuth();
  const { isHydrated } = useAppState();
  const colors = useThemeColors();
  const themedStyles = useMemo(() => createStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPComplete = async (code: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await verify2FA(code);
      
      if (result.success) {
        router.replace('/(tabs)/home');
      } else {
        setError(result.error || 'Invalid code');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setCountdown(60);
    setCanResend(false);
    setOtpCode('');
    setError('');
    // In a real app, this would trigger sending a new OTP
    console.log('OTP resent (mock)');
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
        <Text style={themedStyles.title}>Verify Your Identity</Text>
        <Text style={themedStyles.subtitle}>
          We've sent a 6-digit code to your email
        </Text>
      </View>

      <Card style={themedStyles.card}>
        <View style={themedStyles.content}>
          <Text style={themedStyles.instruction}>
            Enter the verification code below
          </Text>

          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtpCode(text)}
            onFilled={handleOTPComplete}
            disabled={isLoading}
          />

          {error && (
            <Text style={themedStyles.errorText}>{error}</Text>
          )}

          <View style={themedStyles.resendContainer}>
            <Text style={themedStyles.resendText}>Didn't receive the code?</Text>
            <Button
              variant="link"
              onPress={handleResendOTP}
              disabled={!canResend || isLoading}
            >
              {canResend ? 'Resend Code' : `Resend (${countdown}s)`}
            </Button>
          </View>

          <View style={themedStyles.demoInfo}>
            <Text style={themedStyles.demoTitle}>Demo Mode:</Text>
            <Text style={themedStyles.demoText}>Any 6-digit number will work</Text>
          </View>
        </View>
      </Card>

      {isLoading && (
        <View style={themedStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={themedStyles.loadingText}>Verifying...</Text>
        </View>
      )}
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
      textAlign: 'center',
    },
    card: {
      padding: 24,
    },
    content: {
      alignItems: 'center',
      gap: 24,
    },
    instruction: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
      textAlign: 'center',
    },
    resendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    resendText: {
      color: colors.textMuted,
      fontSize: 14,
    },
    demoInfo: {
      backgroundColor: colors.surfaceSubtle,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    demoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    demoText: {
      fontSize: 12,
      color: colors.textMuted,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text,
      fontSize: 16,
      marginTop: 8,
    },
  });
