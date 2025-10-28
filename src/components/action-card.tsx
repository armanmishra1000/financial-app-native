import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ActionCardProps {
  href?: string;
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
}

export function ActionCard({ href, icon: Icon, title, onPress }: ActionCardProps) {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

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
    <Animated.View style={[styles.card, { transform: [{ scale: animatedValue }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePressRelease}
        style={styles.touchable}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Icon size={28} color="#3b82f6" style={styles.icon} />
          <Text style={styles.title}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    height: 112,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  icon: {
    // No margin needed, gap handles spacing
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'left',
  },
});
