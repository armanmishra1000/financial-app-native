import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Bell, CreditCard, Shield, FileText, HelpCircle, LogOut, SunMoon } from 'lucide-react-native';
import { useAppContext } from '../../src/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Avatar } from '../../src/components/ui/avatar';
import { Switch } from '../../src/components/ui/switch';

export default function ProfileScreen() {
  const { user, logout } = useAppContext();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            Alert.alert("Logged Out", "You have been logged out successfully.");
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    const newTheme = checked ? 'Dark' : 'Light';
    Alert.alert("Theme Changed", `Theme changed to ${newTheme} Mode`);
  };

  const handleComingSoon = () => {
    setIsComingSoonOpen(true);
  };

  const ProfileMenuItem = ({ icon: Icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemIcon}>
        <Icon size={20} color="#6b7280" />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.space}>
            <Card>
              <CardContent style={styles.profileCard}>
                <Avatar
                  src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name.replace(/\s/g, '')}`}
                  fallback={userInitials}
                  size={96}
                />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userDescription}>Manage your account details.</Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileMenuItem
                  icon={User}
                  label="Edit Profile"
                  onPress={() => router.push('/profile/edit')}
                />
                <View style={styles.menuItemSeparator} />
                <ProfileMenuItem
                  icon={CreditCard}
                  label="Payment Methods"
                  onPress={() => router.push('/profile/payment-methods')}
                />
                <View style={styles.menuItemSeparator} />
                <ProfileMenuItem
                  icon={Bell}
                  label="Notifications"
                  onPress={() => router.push('/profile/notifications')}
                />
                <View style={styles.menuItemSeparator} />
                <View style={styles.menuItem}>
                  <View style={styles.menuItemIcon}>
                    <SunMoon size={20} color="#6b7280" />
                  </View>
                  <Text style={styles.menuItemLabel}>Dark Mode</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeChange}
                  />
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support & Legal</CardTitle>
                <CardDescription>Get help and legal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileMenuItem
                  icon={HelpCircle}
                  label="Help Center"
                  onPress={handleComingSoon}
                />
                <View style={styles.menuItemSeparator} />
                <ProfileMenuItem
                  icon={Shield}
                  label="Privacy Policy"
                  onPress={handleComingSoon}
                />
                <View style={styles.menuItemSeparator} />
                <ProfileMenuItem
                  icon={FileText}
                  label="Terms of Service"
                  onPress={handleComingSoon}
                />
              </CardContent>
            </Card>

            <Button 
              variant="outline"
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
              onPress={handleLogout}
            >
              <LogOut size={16} color="#374151" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </Button>
          </View>

        </ScrollView>
      </Animated.View>
      
      <Modal
        visible={isComingSoonOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsComingSoonOpen(false)}
      >
        <View style={styles.comingSoonOverlay}>
          <View style={styles.comingSoonModal}>
            <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
            <Text style={styles.comingSoonDescription}>
              This feature will be available in a future update.
            </Text>
            <Button onPress={() => setIsComingSoonOpen(false)}>
              Got it
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  space: {
    gap: 24,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.3,
  },
  userDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuItemSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  comingSoonOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  comingSoonModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    maxWidth: 320,
    width: '100%',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoonButton: {
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
});
