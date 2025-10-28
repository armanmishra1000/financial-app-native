import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform, Animated } from 'react-native';

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  style, 
  textStyle, 
  onPress, 
  disabled = false 
}: ButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: false,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#d1d5db',
        };
      case 'secondary':
        return {
          backgroundColor: '#f3f4f6',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        };
      default:
        return {
          backgroundColor: '#3b82f6',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
        };
      case 'lg':
        return {
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 8,
        };
      case 'icon':
        return {
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 8,
        };
      default:
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        };
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          color: '#374151',
        };
      case 'secondary':
        return {
          color: '#111827',
        };
      case 'ghost':
        return {
          color: '#374151',
        };
      case 'link':
        return {
          color: '#3b82f6',
        };
      default:
        return {
          color: '#ffffff',
        };
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: 12,
        };
      case 'lg':
        return {
          fontSize: 16,
        };
      default:
        return {
          fontSize: 14,
        };
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          disabled && styles.buttonDisabled,
          style
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          getTextStyles(),
          getTextSizeStyles(),
          textStyle
        ]}>
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
