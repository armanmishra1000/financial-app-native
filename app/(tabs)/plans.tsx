import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing, StyleProp, ViewStyle, FlexAlignType } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ArrowRight } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Badge } from '../../src/components/ui/badge';
import { plans, Plan } from '../../src/lib/data';
import { calculateDailyRate, formatDailyRate, getROIBreakdown } from '../../src/lib/investment-utils';
import { useData } from '../../src/context';
import { spacingScale, typographyScale } from '../../src/constants/layout';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';

interface PlanCardProps {
  plan: Plan;
  recommended?: boolean;
  onPress: () => void;
  displayCurrency?: string;
  isWideLayout?: boolean;
}

const PlanCard = ({ plan, recommended, onPress, displayCurrency = 'USD', isWideLayout = false }: PlanCardProps) => {
  const dailyRate = calculateDailyRate(plan.roi_percent);
  const roiBreakdown = getROIBreakdown(plan.roi_percent);
  const cardLayoutStyle = isWideLayout ? styles.planCardWide : styles.planCardFull;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.planCard, recommended ? styles.planCardRecommended : null, cardLayoutStyle]}>
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
  const {
    horizontalContentPadding,
    maxContentWidth,
    isMedium,
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

  const handleInvestPress = (planId: string) => {
    router.push(`/invest?plan=${planId}`);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, contentContainerStyle]}>
        <View style={[styles.space, isExpanded ? styles.spaceExpanded : null]}>
          <View style={styles.header}>
            <Text style={styles.title}>Investment Plans</Text>
            <Text style={styles.subtitle}>Explore our plans to grow your savings.</Text>
          </View>
          
          <View style={[styles.plansList, (isMedium || isExpanded) ? styles.plansListWide : null]}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                recommended={index === 1}
                onPress={() => handleInvestPress(plan.id)}
                displayCurrency={user.displayCurrency}
                isWideLayout={isMedium || isExpanded}
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
    width: '100%',
  },
  space: {
    gap: spacingScale.lg,
    width: '100%',
  },
  spaceExpanded: {
    gap: spacingScale.xl,
  },
  header: {
    gap: spacingScale.xs,
  },
  title: {
    fontSize: typographyScale.headline,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typographyScale.subtitle,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  plansList: {
    gap: spacingScale.md,
  },
  plansListWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  planCard: {
    padding: spacingScale.lg,
  },
  planCardFull: {
    width: '100%',
  },
  planCardWide: {
    flex: 1,
    minWidth: 280,
    maxWidth: 420,
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
    gap: spacingScale.md,
    paddingTop: 0,
  },
  roiSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacingScale.xs,
  },
  roiPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: -1.5,
  },
  roiLabel: {
    fontSize: typographyScale.bodySmall,
    color: '#6b7280',
  },
  detailsSection: {
    gap: spacingScale.sm,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: spacingScale.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingScale.xs,
  },
  detailText: {
    fontSize: typographyScale.bodySmall,
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
    fontSize: typographyScale.bodySmall,
    color: '#059669',
    fontWeight: '500',
    marginTop: spacingScale.xs,
  },
  breakdownSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    padding: spacingScale.sm,
    borderRadius: spacingScale.xs,
    gap: spacingScale.xs,
    marginVertical: spacingScale.sm,
  },
  breakdownTitle: {
    fontSize: typographyScale.caption,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: spacingScale.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: typographyScale.caption,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: typographyScale.caption,
    fontWeight: '500',
    color: '#111827',
  },
});
