import { Redirect, useRouter } from 'expo-router';
import { useAuth, useAppState } from '../src/context';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { isHydrated } = useAppState();
  const router = useRouter();

  useEffect(() => {
    // Force navigation when authentication state changes
    if (isHydrated) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
