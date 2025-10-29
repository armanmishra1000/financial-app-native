import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Keyboard, Platform, Animated, Easing, StyleProp, ViewStyle, FlexAlignType } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useData, useThemeColors } from '../../src/context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Select } from '../../src/components/ui/select';
import { CurrencyToggle } from '../../src/components/ui/currency-toggle';
import { ConfirmationModal } from '../../src/components/ui/confirmation-modal';
import { SuccessModal } from '../../src/components/ui/success-modal';
import { plans, Plan } from '../../src/lib/data';
import { formatCurrency } from '../../src/lib/utils';
import { calculateExpectedReturn, formatDailyRate, getROIBreakdown, formatLockExpiry } from '../../src/lib/investment-utils';
import { convertFromUSD, convertToUSD, getExchangeRateString } from '../../src/lib/currency-utils';
import { spacingScale, typographyScale } from '../../src/constants/layout';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import type { ThemeColors } from '../../src/theme/colors';

export default function InvestScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ plan?: string }>();
  const { user, processInvestment } = useData();
  const colors = useThemeColors();

  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(plans[1]);
  const [amount, setAmount] = React.useState<string>("500");
  const [investmentCurrency, setInvestmentCurrency] = React.useState<string>(user.displayCurrency);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [confirmModalData, setConfirmModalData] = React.useState({
    title: '',
    message: '',
    amountUSD: 0
  });
  const [successModalData, setSuccessModalData] = React.useState({
    title: '',
    message: ''
  });
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;
  const {
    horizontalContentPadding,
    maxContentWidth,
    isMedium,
    isExpanded,
    safeAreaInsets,
  } = useResponsiveLayout();
  const themeStyles = React.useMemo(() => createInvestThemeStyles(colors), [colors]);

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

  const handlePlanChange = React.useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
    if (plan && (!amount || parseFloat(amount) < plan.min_deposit)) {
      setAmount(plan.min_deposit.toString());
    }
  }, [amount]);

  // Convert amounts for display
  const displayBalance = React.useMemo(() => {
    return convertFromUSD(user.balance, investmentCurrency);
  }, [user.balance, investmentCurrency]);

  const displayMinDeposit = React.useMemo(() => {
    const minDeposit = selectedPlan?.min_deposit ?? 1;
    return convertFromUSD(minDeposit, investmentCurrency);
  }, [investmentCurrency, selectedPlan]);

  const investmentCalculation = React.useMemo(() => {
    if (!selectedPlan || !amount) return null;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return null;
    
    // Convert to USD for calculation
    const amountUSD = investmentCurrency === 'USD' ? numericAmount : convertToUSD(numericAmount, investmentCurrency);
    
    return calculateExpectedReturn(amountUSD, selectedPlan.roi_percent, selectedPlan.duration_days);
  }, [selectedPlan, amount, investmentCurrency]);

  const roiBreakdown = React.useMemo(() => {
    if (!selectedPlan) return null;
    return getROIBreakdown(selectedPlan.roi_percent);
  }, [selectedPlan]);

  const executeInvestment = React.useCallback((amountUSD: number) => {
    console.log('executeInvestment called with amountUSD:', amountUSD);
    if (!selectedPlan) {
      console.log('❌ Error: No selected plan');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Calling processInvestment...');
      const result = processInvestment({ planId: selectedPlan.id, amountUSD });
      setIsLoading(false);
      console.log('📋 processInvestment result:', result);

      if (!result.success) {
        console.log('❌ Investment failed:', result.error);
        Alert.alert("Investment Failed", result.error);
        return;
      }

      console.log('✅ Investment successful!');
      const displayAmount = investmentCurrency === 'USD' ? amountUSD : convertFromUSD(amountUSD, investmentCurrency);
      const lockExpiryDisplay = formatLockExpiry(result.investment.lockedUntil);

      // Show success modal instead of Alert.alert
      console.log('🏆 Showing success modal');
      setSuccessModalData({
        title: "Investment Successful!",
        message: `Your investment of ${formatCurrency(displayAmount, investmentCurrency)} in ${selectedPlan.name} has been processed. You'll start earning daily compound interest!\n\n⚠️ 30-Day Lock Period: Withdrawals blocked until ${lockExpiryDisplay}`
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.log('💥 Unexpected error in executeInvestment:', error);
      setIsLoading(false);
      Alert.alert("Unexpected Error", "Something went wrong while processing your investment. Please try again.");
    }
  }, [selectedPlan, investmentCurrency, processInvestment, convertFromUSD, formatCurrency, formatLockExpiry, router]);

  const handleInvest = React.useCallback(() => {
    console.log('handleInvest called');
    const numericAmount = parseFloat(amount);

    // Validation checks
    if (!selectedPlan || isNaN(numericAmount) || numericAmount <= 0) {
      console.log('❌ Validation failed: Invalid plan or amount');
      Alert.alert("Invalid Investment", "Please check the plan and amount.");
      return;
    }

    // Convert to USD for validation
    const amountUSD = investmentCurrency === 'USD' ? numericAmount : convertToUSD(numericAmount, investmentCurrency);
    console.log(`Investment details: Plan=${selectedPlan.name}, Amount=${numericAmount} ${investmentCurrency} ($${amountUSD} USD)`);

    if (amountUSD < 1) {
      console.log('❌ Validation failed: Amount too low');
      Alert.alert("Amount Too Low", `Amount must be at least ${formatCurrency(displayMinDeposit, investmentCurrency)}.`);
      return;
    }

    if (user.balance < amountUSD) {
      console.log('❌ Validation failed: Insufficient balance');
      Alert.alert("Insufficient Balance", `You don't have enough balance. Available: ${formatCurrency(displayBalance, investmentCurrency)}`);
      return;
    }

    console.log('✅ Validation passed, showing confirmation modal');
    
    // Ensure keyboard is dismissed before showing modal
    Keyboard.dismiss();
    
    // Show custom modal instead of Alert.alert
    setConfirmModalData({
      title: "Confirm Investment",
      message: `Invest ${formatCurrency(numericAmount, investmentCurrency)} in ${selectedPlan.name}?`,
      amountUSD: amountUSD
    });
    setShowConfirmModal(true);
  }, [selectedPlan, amount, investmentCurrency, user.balance, processInvestment, displayBalance, displayMinDeposit, convertFromUSD, formatCurrency, executeInvestment]);

  React.useEffect(() => {
    const paramValue = Array.isArray(searchParams.plan) ? searchParams.plan[0] : searchParams.plan;
    if (!paramValue) {
      return;
    }

    const matchingPlan = plans.find(plan => plan.id === paramValue);
    if (matchingPlan) {
      setSelectedPlan(matchingPlan);
      setAmount(matchingPlan.min_deposit.toString());
    }
  }, [searchParams.plan]);

  const planItems = React.useMemo(() => (
    plans.map((plan) => {
      const minimumDepositDisplay = formatCurrency(
        convertFromUSD(plan.min_deposit, investmentCurrency),
        investmentCurrency,
      );

      return {
        label: plan.name,
        value: plan.id,
        description: `${plan.roi_percent}% ROI • ${plan.duration_days} days • Min ${minimumDepositDisplay}`,
      };
    })
  ), [investmentCurrency]);

  return (
    <Animated.View
      style={[
        styles.container,
        themeStyles.container,
        { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
      ]}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, contentContainerStyle]}>
        <View style={[styles.space, isExpanded ? styles.spaceExpanded : null]}>
          <View style={styles.header}>
            <Text style={[styles.title, themeStyles.title]}>Make an Investment</Text>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>Choose a plan and enter an amount to invest.</Text>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Review your investment and estimated returns below.</CardDescription>
            </CardHeader>
            <CardContent style={[styles.cardContent, (isMedium || isExpanded) ? styles.cardContentWide : null]}>
              <View style={styles.formSpace}>
                <Select
                  label="Investment Plan"
                  value={selectedPlan?.id}
                  onValueChange={handlePlanChange}
                  items={planItems}
                  placeholder="Select a plan"
                  modalTitle="Select Investment Plan"
                  helperText="Compare each plan’s ROI, duration, and minimum deposit."
                />

                <View style={styles.amountSection}>
                  <View style={styles.amountHeader}>
                    <Text style={[styles.amountLabel, themeStyles.amountLabel]}>Amount to Invest ({investmentCurrency})</Text>
                    <Text style={[styles.balanceText, themeStyles.balanceText]}>
                      Balance: {formatCurrency(displayBalance, investmentCurrency)}
                    </Text>
                  </View>
                  <Input
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="e.g., 500"
                    keyboardType="numeric"
                  />
                  {selectedPlan && (
                    <Text style={[styles.helperText, themeStyles.helperText]}>
                      Minimum deposit: {formatCurrency(displayMinDeposit, investmentCurrency)}
                    </Text>
                  )}
                </View>

                {/* Currency Toggle */}
                <View style={styles.currencySection}>
                  <Text style={[styles.currencyLabel, themeStyles.currencyLabel]}>Display Currency</Text>
                  <CurrencyToggle
                    value={investmentCurrency}
                    onValueChange={setInvestmentCurrency}
                    options={['USD', user.displayCurrency].filter((code, index, arr) => arr.indexOf(code) === index)}
                  />
                  {investmentCurrency !== 'USD' && (
                    <Text style={[styles.exchangeRateText, themeStyles.exchangeRateText]}>
                      {getExchangeRateString('USD', investmentCurrency)}
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.summarySection,
                  themeStyles.summarySection,
                  (isMedium || isExpanded) ? styles.summarySectionWide : null,
                ]}
              >
                <Text style={[styles.summaryTitle, themeStyles.summaryTitle]}>Summary</Text>
                
                {/* Investment Details */}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, themeStyles.summaryLabel]}>Your Investment</Text>
                  <Text style={[styles.summaryValue, themeStyles.summaryValue]}>
                    {formatCurrency(parseFloat(amount) || 0, investmentCurrency)}
                  </Text>
                </View>
                
                {/* 30-Day Lock Warning */}
                <View style={[styles.lockWarning, themeStyles.lockWarning]}>
                  <Text style={[styles.lockWarningTitle, themeStyles.lockWarningTitle]}>⚠️ 30-Day Lock Period</Text>
                  <Text style={[styles.lockWarningText, themeStyles.lockWarningText]}>
                    Withdrawals will be blocked for 30 days after investment. This protects your investment and ensures compound interest growth.
                  </Text>
                </View>
                
                {/* ROI Breakdown */}
                {roiBreakdown && (
                  <View style={[styles.breakdownSection, themeStyles.breakdownSection]}>
                    <Text style={[styles.breakdownTitle, themeStyles.breakdownTitle]}>ROI Breakdown</Text>
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownLabel, themeStyles.breakdownLabel]}>National Bond</Text>
                      <Text style={[styles.breakdownValue, themeStyles.breakdownValue]}>{roiBreakdown.bond_percent}%</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownLabel, themeStyles.breakdownLabel]}>Platform Bonus</Text>
                      <Text style={[styles.breakdownValue, themeStyles.breakdownValue]}>+{roiBreakdown.platform_percent}%</Text>
                    </View>
                    <View style={[styles.breakdownDivider, themeStyles.breakdownDivider]} />
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownTotalLabel, themeStyles.breakdownTotalLabel]}>Total APY</Text>
                      <Text style={[styles.breakdownTotalValue, themeStyles.breakdownTotalValue]}>{roiBreakdown.total_percent}%</Text>
                    </View>
                  </View>
                )}
                
                {/* Compound Interest Details */}
                {investmentCalculation && (
                  <View style={styles.compoundSection}>
                    <Text style={[styles.compoundTitle, themeStyles.compoundTitle]}>Expected Returns</Text>
                    <View style={styles.compoundRow}>
                      <Text style={[styles.compoundLabel, themeStyles.compoundLabel]}>Daily Rate</Text>
                      <Text style={[styles.compoundValue, themeStyles.compoundValue]}>{formatDailyRate(investmentCalculation.dailyRate)}</Text>
                    </View>
                    <View style={styles.compoundRow}>
                      <Text style={[styles.compoundLabel, themeStyles.compoundLabel]}>Daily Earnings</Text>
                      <Text style={[styles.compoundValue, themeStyles.compoundValue]}>
                        +{formatCurrency(convertFromUSD(investmentCalculation.dailyEarnings, investmentCurrency), investmentCurrency)}
                      </Text>
                    </View>
                    <View style={styles.compoundRow}>
                      <Text style={[styles.compoundLabel, themeStyles.compoundLabel]}>Total Growth ({selectedPlan?.duration_days} days)</Text>
                      <Text style={[styles.profitValue, themeStyles.profitValue]}>
                        +{formatCurrency(convertFromUSD(investmentCalculation.profit, investmentCurrency), investmentCurrency)}
                      </Text>
                    </View>
                    <View style={[styles.summaryDivider, themeStyles.summaryDivider]} />
                    <View style={styles.summaryRow}>
                      <Text style={[styles.totalLabel, themeStyles.totalLabel]}>Final Value</Text>
                      <Text style={[styles.totalValue, themeStyles.totalValue]}>
                        {formatCurrency(convertFromUSD(investmentCalculation.total, investmentCurrency), investmentCurrency)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
          
          <Button 
            onPress={handleInvest} 
            disabled={isLoading}
            style={styles.confirmButton}
          >
            {isLoading ? "Processing..." : "Confirm Investment"}
          </Button>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        title={confirmModalData.title}
        message={confirmModalData.message}
        onConfirm={() => {
          console.log('✅ User confirmed investment in modal');
          setShowConfirmModal(false);
          executeInvestment(confirmModalData.amountUSD);
        }}
        onCancel={() => {
          console.log('❌ User cancelled investment in modal');
          setShowConfirmModal(false);
        }}
      />
      
      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title={successModalData.title}
        message={successModalData.message}
        onClose={() => {
          console.log('🏠 Closing success modal and navigating home');
          setShowSuccessModal(false);
          router.push('/home');
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typographyScale.subtitle,
  },
  cardContent: {
    gap: spacingScale.lg,
  },
  cardContentWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingScale.xl,
  },
  formSpace: {
    gap: spacingScale.lg,
    flex: 1,
  },
  amountSection: {
    gap: spacingScale.xs,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacingScale.xs,
  },
  amountLabel: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  balanceText: {
    fontSize: typographyScale.caption,
  },
  helperText: {
    fontSize: typographyScale.caption,
  },
  currencySection: {
    gap: spacingScale.sm,
  },
  currencyLabel: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  exchangeRateText: {
    fontSize: typographyScale.caption,
    textAlign: 'center',
    marginTop: spacingScale.xs,
  },
  summarySection: {
    padding: spacingScale.md,
    borderRadius: spacingScale.xs,
    gap: spacingScale.sm,
  },
  summarySectionWide: {
    flex: 1,
    maxWidth: 420,
    alignSelf: 'stretch',
  },
  summaryTitle: {
    fontSize: typographyScale.subtitle,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typographyScale.bodySmall,
  },
  summaryValue: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  profitValue: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    marginVertical: spacingScale.xs,
  },
  totalLabel: {
    fontSize: typographyScale.title,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  totalValue: {
    fontSize: typographyScale.title,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  confirmButton: {
    marginTop: spacingScale.sm,
  },
  breakdownSection: {
    marginTop: spacingScale.md,
    padding: spacingScale.sm,
    borderRadius: spacingScale.xs,
    gap: spacingScale.xs,
  },
  breakdownTitle: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '600',
    marginBottom: spacingScale.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: typographyScale.caption,
  },
  breakdownValue: {
    fontSize: typographyScale.caption,
    fontWeight: '500',
  },
  breakdownDivider: {
    height: 1,
    marginVertical: spacingScale.xs,
  },
  breakdownTotalLabel: {
    fontSize: typographyScale.caption,
    fontWeight: '600',
  },
  breakdownTotalValue: {
    fontSize: typographyScale.caption,
    fontWeight: '600',
  },
  compoundSection: {
    marginTop: spacingScale.md,
    gap: spacingScale.xs,
  },
  compoundTitle: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '600',
    marginBottom: spacingScale.xs,
  },
  compoundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compoundLabel: {
    fontSize: typographyScale.caption,
  },
  compoundValue: {
    fontSize: typographyScale.caption,
    fontWeight: '500',
  },
  lockWarning: {
    marginTop: spacingScale.md,
    padding: spacingScale.sm,
    borderRadius: spacingScale.xs,
    gap: spacingScale.xs,
  },
  lockWarningTitle: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '600',
  },
  lockWarningText: {
    fontSize: typographyScale.caption,
    lineHeight: 18,
  },
});

const createInvestThemeStyles = (colors: ThemeColors) => ({
  container: {
    backgroundColor: colors.background,
  },
  title: {
    color: colors.heading,
  },
  subtitle: {
    color: colors.textMuted,
  },
  amountLabel: {
    color: colors.text,
  },
  balanceText: {
    color: colors.textMuted,
  },
  helperText: {
    color: colors.textMuted,
  },
  currencyLabel: {
    color: colors.text,
  },
  exchangeRateText: {
    color: colors.textMuted,
  },
  summarySection: {
    backgroundColor: colors.surfaceSubtle,
  },
  summaryTitle: {
    color: colors.heading,
  },
  summaryLabel: {
    color: colors.textMuted,
  },
  summaryValue: {
    color: colors.text,
  },
  profitValue: {
    color: colors.success,
  },
  summaryDivider: {
    backgroundColor: colors.divider,
  },
  totalLabel: {
    color: colors.heading,
  },
  totalValue: {
    color: colors.heading,
  },
  breakdownSection: {
    backgroundColor: colors.primarySurface,
  },
  breakdownTitle: {
    color: colors.primary,
  },
  breakdownLabel: {
    color: colors.textMuted,
  },
  breakdownValue: {
    color: colors.text,
  },
  breakdownDivider: {
    backgroundColor: colors.divider,
  },
  breakdownTotalLabel: {
    color: colors.primary,
  },
  breakdownTotalValue: {
    color: colors.primary,
  },
  compoundTitle: {
    color: colors.success,
  },
  compoundLabel: {
    color: colors.textMuted,
  },
  compoundValue: {
    color: colors.success,
  },
  lockWarning: {
    backgroundColor: colors.warningSurface,
  },
  lockWarningTitle: {
    color: colors.warning,
  },
  lockWarningText: {
    color: colors.warning,
  },
});
