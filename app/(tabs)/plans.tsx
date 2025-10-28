import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Badge } from '../../src/components/ui/badge';
import { plans, Plan } from '../../src/lib/data';
import { formatCurrency } from '../../src/lib/utils';
import { calculateDailyRate, formatDailyRate, getROIBreakdown } from '../../src/lib/investment-utils';
import { convertFromUSD } from '../../src/lib/currency-utils';
import { useData } from '../../src/context';

interface PlanCardProps {
  plan: Plan;
  recommended?: boolean;
  onPress: () => void;
  displayCurrency?: string;
}

const PlanCard = ({ plan, recommended, onPress, displayCurrency = 'USD' }: PlanCardProps) => {
  const dailyRate = calculateDailyRate(plan.roi_percent);
  const roiBreakdown = getROIBreakdown(plan.roi_percent);
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={recommended ? styles.planCardRecommended : styles.planCard}>
        <CardHeader>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>Daily compound interest growth</CardDescription>
            </View>
            {recommended && <Badge>Recommended</Badge>}
          </View>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <View style={styles.roiSection}>
            <Text style={styles.roiPercentage}>{plan.roi_percent}%</Text>
            <Text style={styles.roiLabel}>APY</Text>
            <Text style={styles.dailyRate}>{formatDailyRate(dailyRate)} daily</Text>
          </View>
          
          {/* ROI Breakdown */}
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Returns Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>National Bond</Text>
              <Text style={styles.breakdownValue}>{roiBreakdown.bond_percent}%</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Bonus</Text>
              <Text style={styles.breakdownValue}>+{roiBreakdown.platform_percent}%</Text>
            </View>
          </View>
          
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="#6b7280" />
              <Text style={styles.detailText}>{plan.duration_days} days duration</Text>
            </View>
          </View>
        </CardContent>
        <CardFooter>
          <Button 
            style={recommended ? styles.buttonPrimary : styles.buttonSecondary}
            textStyle={recommended ? styles.buttonTextPrimary : styles.buttonTextSecondary}
            onPress={onPress}
          >
            Invest Now <ArrowRight size={16} color={recommended ? "#ffffff" : "#3b82f6"} />
          </Button>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
};

export default function PlansScreen() {
  const router = useRouter();
  const { user } = useData();
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

  const handleInvestPress = (planId: string) => {
    router.push(`/invest?plan=${planId}`);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.space}>
          <View style={styles.header}>
            <Text style={styles.title}>Investment Plans</Text>
            <Text style={styles.subtitle}>Explore our plans to grow your savings.</Text>
          </View>
          
          <View style={styles.plansList}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                recommended={index === 1}
                onPress={() => handleInvestPress(plan.id)}
                displayCurrency={user.displayCurrency}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
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
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  plansList: {
    gap: 16,
  },
  planCard: {
    padding: 20,
  },
  planCardRecommended: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  
  cardContent: {
    gap: 20,
    paddingTop: 0,
  },
  roiSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  roiPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: -1.5,
  },
  roiLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  detailsSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailTextBold: {
    fontWeight: '600',
    color: '#111827',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#3b82f6',
  },
  dailyRate: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginTop: 2,
  },
  breakdownSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 6,
    marginVertical: 12,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#111827',
  },
});
