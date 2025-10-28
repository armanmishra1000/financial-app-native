import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../../src/context/app-context';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';
import { OtpInput } from 'react-native-otp-entry';

export default function VerifyOTPScreen() {
  const { verify2FA, isHydrated } = useAppContext();
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.instruction}>
            Enter the verification code below
          </Text>

          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtpCode(text)}
            onFilled={handleOTPComplete}
            disabled={isLoading}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <Button
              variant="link"
              onPress={handleResendOTP}
              disabled={!canResend || isLoading}
            >
              {canResend ? 'Resend Code' : `Resend (${countdown}s)`}
            </Button>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Mode:</Text>
            <Text style={styles.demoText}>Any 6-digit number will work</Text>
          </View>
        </View>
      </Card>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      )}
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
    color: '#374151',
    textAlign: 'center',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  otpInputText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  otpInputFocused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
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
    color: '#6b7280',
    fontSize: 14,
  },
  demoInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 8,
  },
});
