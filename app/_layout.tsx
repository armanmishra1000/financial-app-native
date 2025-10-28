import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from '../src/context';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
          <Stack.Screen name="profile/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="profile/payment-methods" options={{ headerShown: false }} />
        </Stack>
      </AppContextProvider>
    </SafeAreaProvider>
  );
}
