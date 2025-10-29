import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppContextProvider, useTheme, useThemeColors } from '../src/context';
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
      <ThemedRoot safeAreaInsets={safeAreaInsets} />
    </AppContextProvider>
  );
}

interface ThemedRootProps {
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

function ThemedRoot({ safeAreaInsets }: ThemedRootProps) {
  const colors = useThemeColors();
  const { resolvedTheme } = useTheme();

  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop: safeAreaInsets.top,
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
            backgroundColor: colors.background,
          },
        ]}
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
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
