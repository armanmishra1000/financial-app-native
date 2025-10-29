import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Briefcase, BarChart2, Wallet, User } from 'lucide-react-native';

import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { spacingScale, typographyScale } from '../../src/constants/layout';

const NAV_RAIL_WIDTH = 104;

export default function TabsLayout() {
  const { safeAreaInsets, shouldShowNavigationRail } = useResponsiveLayout();

  const tabBarStyle = useMemo(() => {
    if (shouldShowNavigationRail) {
      return { display: 'none' } as const;
    }

    return {
      backgroundColor: '#ffffff',
      borderTopColor: '#e5e7eb',
      borderTopWidth: 1,
      height: 60 + safeAreaInsets.bottom,
      paddingBottom: Math.max(spacingScale.xs, safeAreaInsets.bottom),
      paddingTop: spacingScale.xs,
    };
  }, [safeAreaInsets.bottom, shouldShowNavigationRail]);

  return (
    <View style={[layoutStyles.container, shouldShowNavigationRail ? layoutStyles.containerWithRail : null]}>
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle,
      }}
      tabBar={(props) => (
        shouldShowNavigationRail ? <NavigationRail {...props} /> : <BottomTabBar {...props} />
      )}
    >
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
    </View>
  );
}

function NavigationRail({ state, descriptors, navigation }: BottomTabBarProps) {
  const { safeAreaInsets } = useResponsiveLayout();

  return (
    <View
      style={[
        railStyles.container,
        {
          paddingTop: safeAreaInsets.top + spacingScale.sm,
          paddingBottom: Math.max(spacingScale.sm, safeAreaInsets.bottom),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let label = route.name;
        if (typeof options.tabBarLabel === 'string') {
          label = options.tabBarLabel;
        } else if (typeof options.title === 'string') {
          label = options.title;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? '#1d4ed8' : '#6b7280';
        const icon = options.tabBarIcon?.({ focused: isFocused, color, size: 24 }) ?? null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            style={[railStyles.item, isFocused && railStyles.itemFocused]}
          >
            <View style={railStyles.iconWrapper}>{icon}</View>
            <Text style={[railStyles.label, isFocused && railStyles.labelFocused]} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerWithRail: {
    paddingLeft: NAV_RAIL_WIDTH,
  },
});

const railStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: NAV_RAIL_WIDTH,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingHorizontal: spacingScale.sm,
  },
  item: {
    alignItems: 'center',
    borderRadius: spacingScale.sm,
    paddingVertical: spacingScale.md,
    gap: spacingScale.xs,
  },
  itemFocused: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  iconWrapper: {
    marginBottom: spacingScale.xs * 0.5,
  },
  label: {
    fontSize: typographyScale.caption,
    color: '#6b7280',
    textAlign: 'center',
  },
  labelFocused: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
});
