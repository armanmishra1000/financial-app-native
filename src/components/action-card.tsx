import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import { spacingScale, typographyScale } from '../constants/layout';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useThemeColors } from '../context';

interface ActionCardProps {
  href?: string;
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
}

export function ActionCard({ href, icon: Icon, title, onPress }: ActionCardProps) {
  const { isMedium, isExpanded } = useResponsiveLayout();
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  const colors = useThemeColors();

  const layoutStyles = React.useMemo(
    () => [
      (isMedium || isExpanded) ? styles.cardResponsive : styles.cardFullWidth,
      isExpanded ? styles.cardExpanded : null,
    ],
    [isMedium, isExpanded],
  );

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1.05,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressRelease = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (onPress) {
      onPress();
    } else if (href) {
      // Navigation will be handled by the screen
      console.log('Navigate to:', href);
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        ...layoutStyles,
        {
          backgroundColor: colors.mutedSurface,
        },
        { transform: [{ scale: animatedValue }] },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePressRelease}
        style={styles.touchable}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Icon size={28} color={colors.primary} style={styles.icon} />
          <Text style={[styles.title, { color: colors.primary }] }>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    minHeight: 112,
    overflow: 'hidden',
    flexGrow: 1,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardResponsive: {
    flex: 1,
    minWidth: 200,
  },
  cardExpanded: {
    maxWidth: 320,
  },
  touchable: {
    flex: 1,
    padding: spacingScale.md,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacingScale.xs,
    flex: 1,
  },
  icon: {
    // No margin needed, gap handles spacing
  },
  title: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '600',
    textAlign: 'left',
  },
});
