import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing, StyleProp, ViewStyle, FlexAlignType } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Bell, CreditCard, Shield, FileText, HelpCircle, LogOut, SunMoon, Globe } from 'lucide-react-native';
import { useData, useAuth } from '../../src/context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Avatar } from '../../src/components/ui/avatar';
import { Switch } from '../../src/components/ui/switch';
import { Select } from '../../src/components/ui/select';
import { getSupportedCurrencyCodes, getCurrencyDisplayName } from '../../src/lib/currency-utils';
import { spacingScale, typographyScale } from '../../src/constants/layout';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';

type MenuIcon = React.ComponentType<{ size?: number; color?: string }>;

export default function ProfileScreen() {
  const { user, setDisplayCurrency } = useData();
  const { logout } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;
  const {
    horizontalContentPadding,
    maxContentWidth,
    isExpanded,
    safeAreaInsets,
  } = useResponsiveLayout();

  const contentContainerStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => ({
      paddingHorizontal: horizontalContentPadding,
      paddingTop: spacingScale.xl,
      paddingBottom: spacingScale.xxl + safeAreaInsets.bottom,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center' as FlexAlignType,
    }),
    [horizontalContentPadding, maxContentWidth, safeAreaInsets.bottom],
  );

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

  const ProfileMenuItem = ({ icon: Icon, label, onPress }: { icon: MenuIcon; label: string; onPress: () => void }) => (
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
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, contentContainerStyle]}>
          <View style={[styles.space, isExpanded ? styles.spaceExpanded : null]}>
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
                <View style={styles.menuItemSeparator} />
                <View style={styles.menuItem}>
                  <View style={styles.menuItemIcon}>
                    <Globe size={20} color="#6b7280" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemLabel}>Display Currency</Text>
                    <Select
                      value={user.displayCurrency}
                      onValueChange={setDisplayCurrency}
                      items={getSupportedCurrencyCodes().map(code => ({
                        label: getCurrencyDisplayName(code),
                        value: code
                      }))}
                      placeholder="Select currency"
                    />
                  </View>
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
    width: '100%',
  },
  space: {
    gap: spacingScale.lg,
    width: '100%',
  },
  spaceExpanded: {
    gap: spacingScale.xl,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacingScale.xl,
    gap: spacingScale.md,
  },
  userName: {
    fontSize: typographyScale.title,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.3,
  },
  userDescription: {
    fontSize: typographyScale.body,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingScale.sm,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: spacingScale.xs,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingScale.md,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: typographyScale.body,
    fontWeight: '500',
    color: '#111827',
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'column',
    gap: spacingScale.xs,
  },
  currencySelect: {
    marginTop: spacingScale.xs,
  },
  menuItemSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: spacingScale.xs,
  },
  logoutButton: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingScale.xs,
    paddingVertical: spacingScale.xs,
  },
  logoutButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: typographyScale.bodySmall,
  },
  comingSoonOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacingScale.lg,
  },
  comingSoonModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: spacingScale.lg,
    alignItems: 'center',
    gap: spacingScale.md,
    maxWidth: 320,
    width: '100%',
  },
  comingSoonTitle: {
    fontSize: typographyScale.title,
    fontWeight: 'bold',
    color: '#111827',
  },
  comingSoonDescription: {
    fontSize: typographyScale.body,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoonButton: {
    marginTop: spacingScale.sm,
  },
  scrollView: {
    flex: 1,
  },
});
