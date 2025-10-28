import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function HomePageSkeleton() {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerRow}>
        <View style={styles.leftContent}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <Animated.View style={[styles.subtitleSkeleton, { opacity }]} />
        </View>
        <Animated.View style={[styles.avatarSkeleton, { opacity }]} />
      </View>
      
      {/* Balance card skeleton */}
      <Animated.View style={[styles.cardSkeleton, styles.tallCard, { opacity }]} />
      
      {/* Action cards skeleton */}
      <View style={styles.actionCardsRow}>
        <Animated.View style={[styles.actionCardSkeleton, { opacity }]} />
        <Animated.View style={[styles.actionCardSkeleton, { opacity }]} />
        <Animated.View style={[styles.actionCardSkeleton, { opacity }]} />
      </View>
      
      {/* Chart skeleton */}
      <Animated.View style={[styles.cardSkeleton, styles.chartCard, { opacity }]} />
      
      {/* Transactions skeleton */}
      <Animated.View style={[styles.cardSkeleton, styles.transactionsCard, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    paddingBottom: 80,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    gap: 8,
  },
  titleSkeleton: {
    width: 200,
    height: 32,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  subtitleSkeleton: {
    width: 160,
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  avatarSkeleton: {
    width: 40,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },
  cardSkeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  tallCard: {
    height: 160,
  },
  chartCard: {
    height: 200,
  },
  transactionsCard: {
    height: 280,
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCardSkeleton: {
    flex: 1,
    height: 112,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
});
