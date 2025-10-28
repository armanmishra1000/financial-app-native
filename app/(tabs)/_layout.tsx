import { Tabs } from 'expo-router';
import { Home, Briefcase, BarChart2, Wallet, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6366f1',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e5e7eb',
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
    }}>
      <Tabs.Screen name="home" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
      }} />
      <Tabs.Screen name="invest" options={{
        title: 'Invest',
        tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
      }} />
      <Tabs.Screen name="plans" options={{
        title: 'Plans',
        tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
      }} />
      <Tabs.Screen name="wallet" options={{
        title: 'Wallet',
        tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
      }} />
    </Tabs>
  );
}
