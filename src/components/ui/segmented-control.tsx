import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SegmentedControl({ value, onChange, options }: SegmentedControlProps) {
  const indicatorAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    const currentIndex = options.indexOf(value);
    Animated.timing(indicatorAnim, {
      toValue: currentIndex,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [value, options]);

  const handlePress = (option: string, index: number) => {
    onChange(option);
  };

  const segmentWidth = (100 / options.length) - 1; // Account for gaps

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option}
            style={[styles.segment, { width: `${segmentWidth}%` }]}
            onPress={() => handlePress(option, index)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.segmentText,
              value === option && styles.segmentTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${segmentWidth}%`,
              transform: [{
                translateX: indicatorAnim.interpolate({
                  inputRange: [0, options.length - 1],
                  outputRange: ['0%', `${(options.length - 1) * 100}%`],
                })
              }]
            }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  background: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
    height: 44,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
    zIndex: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  segmentTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
