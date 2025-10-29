import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AppContextProvider } from '../src/context';
import { useResponsiveLayout } from '../src/hooks/useResponsiveLayout';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const { safeAreaInsets } = useResponsiveLayout();

  return (
    <AppContextProvider>
      <SafeAreaView
        style={[styles.safeArea, { paddingTop: safeAreaInsets.top, paddingLeft: safeAreaInsets.left, paddingRight: safeAreaInsets.right }]}
        edges={['top', 'left', 'right']}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
          <Stack.Screen name="profile/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="profile/payment-methods" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
