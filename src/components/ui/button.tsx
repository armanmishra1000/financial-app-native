import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated, StyleProp } from 'react-native';

import { useThemeColors } from '../../context';

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
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
  const childArray = React.Children.toArray(children);
  const hasOnlyTextChildren = childArray.every(
    (child) => typeof child === 'string' || typeof child === 'number'
  );
  const colors = useThemeColors();
  
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
          borderColor: colors.border,
        };
      case 'secondary':
        return {
          backgroundColor: colors.mutedSurface,
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
          backgroundColor: colors.primary,
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
          color: colors.text,
        };
      case 'secondary':
        return {
          color: colors.text,
        };
      case 'ghost':
        return {
          color: colors.text,
        };
      case 'link':
        return {
          color: colors.link,
        };
      default:
        return {
          color: colors.primaryForeground,
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
    <Animated.View 
      style={{ transform: [{ scale: scaleAnim }] }}
      pointerEvents="box-none"
    >
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
        {hasOnlyTextChildren ? (
          <Text
            style={[
              styles.buttonText,
              getTextStyles(),
              getTextSizeStyles(),
              textStyle
            ]}
          >
            {children}
          </Text>
        ) : (
          childArray.map((child, index) => {
            if (typeof child === 'string' || typeof child === 'number') {
              return (
                <Text
                  key={`button-text-${index}`}
                  style={[
                    styles.buttonText,
                    getTextStyles(),
                    getTextSizeStyles(),
                    textStyle
                  ]}
                >
                  {child}
                </Text>
              );
            }

            if (React.isValidElement(child)) {
              return React.cloneElement(child, { key: `button-node-${index}` });
            }

            return (
              <React.Fragment key={`button-fragment-${index}`}>
                {child}
              </React.Fragment>
            );
          })
        )}
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
