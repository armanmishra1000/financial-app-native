import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../src/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Select } from '../../src/components/ui/select';
import { CurrencyToggle } from '../../src/components/ui/currency-toggle';
import { plans, Plan } from '../../src/lib/data';
import { formatCurrency } from '../../src/lib/utils';
import { calculateDailyRate, calculateExpectedReturn, formatDailyRate, getROIBreakdown, formatLockExpiry } from '../../src/lib/investment-utils';
import { convertFromUSD, convertToUSD, getExchangeRateString } from '../../src/lib/currency-utils';

export default function InvestScreen() {
  const router = useRouter();
  const { user, addTransaction, createInvestment } = useAppContext();

  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(plans[1]);
  const [amount, setAmount] = React.useState<string>("500");
  const [investmentCurrency, setInvestmentCurrency] = React.useState<string>(user.displayCurrency);
  const [isLoading, setIsLoading] = React.useState(false);
  
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

  const handlePlanChange = React.useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
    if (plan) {
      setAmount(plan.min_deposit.toString());
    }
  }, []);

  // Convert amounts for display
  const displayBalance = React.useMemo(() => {
    return convertFromUSD(user.balance, investmentCurrency);
  }, [user.balance, investmentCurrency]);

  const displayMinDeposit = React.useMemo(() => {
    if (!selectedPlan) return 0;
    return convertFromUSD(selectedPlan.min_deposit, investmentCurrency);
  }, [selectedPlan, investmentCurrency]);

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

  const handleInvest = () => {
    const numericAmount = parseFloat(amount);

    // Validation checks
    if (!selectedPlan || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Investment", "Please check the plan and amount.");
      return;
    }

    // Convert to USD for validation
    const amountUSD = investmentCurrency === 'USD' ? numericAmount : convertToUSD(numericAmount, investmentCurrency);

    if (amountUSD < selectedPlan.min_deposit) {
      Alert.alert("Amount Too Low", `Amount must be at least ${formatCurrency(displayMinDeposit, investmentCurrency)}.`);
      return;
    }

    if (user.balance < amountUSD) {
      Alert.alert("Insufficient Balance", `You don't have enough balance. Available: ${formatCurrency(displayBalance, investmentCurrency)}`);
      return;
    }

    // Confirmation dialog
    Alert.alert(
      "Confirm Investment",
      `Invest ${formatCurrency(numericAmount, investmentCurrency)} in ${selectedPlan.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => processInvestment(amountUSD)
        }
      ]
    );
  };

  const processInvestment = (amountUSD: number) => {
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      // Create the investment record (always store in USD)
      createInvestment({
        planId: selectedPlan!.id,
        planName: selectedPlan!.name,
        amount: amountUSD,
        currency: 'USD', // Always store in USD
      });

      // Create the transaction for the initial investment
      addTransaction({
        type: 'Investment',
        amount: -amountUSD,
        description: selectedPlan!.name,
      });

      setIsLoading(false);
      
      // Calculate lock expiry date for message
      const lockExpiry = new Date();
      lockExpiry.setDate(lockExpiry.getDate() + 30);
      
      // Convert back to display currency for message
      const displayAmount = investmentCurrency === 'USD' ? amountUSD : convertFromUSD(amountUSD, investmentCurrency);
      
      Alert.alert(
        "Investment Successful!",
        `Your investment of ${formatCurrency(displayAmount, investmentCurrency)} in ${selectedPlan!.name} has been processed. You'll start earning daily compound interest!\n\n⚠️ 30-Day Lock Period: Withdrawals blocked until ${formatLockExpiry(lockExpiry.toISOString())}`,
        [
          {
            text: "OK",
            onPress: () => router.push('/home')
          }
        ]
      );
    }, 500);
  };

  const planItems = plans.map(plan => ({
    label: `${plan.name} (${plan.roi_percent}% ROI)`,
    value: plan.id
  }));

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.space}>
          <View style={styles.header}>
            <Text style={styles.title}>Make an Investment</Text>
            <Text style={styles.subtitle}>Choose a plan and enter an amount to invest.</Text>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Review your investment and estimated returns below.</CardDescription>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.formSpace}>
                <Select
                  label="Investment Plan"
                  value={selectedPlan?.id}
                  onValueChange={handlePlanChange}
                  items={planItems}
                  placeholder="Select a plan"
                />

                <View style={styles.amountSection}>
                  <View style={styles.amountHeader}>
                    <Text style={styles.amountLabel}>Amount to Invest ({investmentCurrency})</Text>
                    <Text style={styles.balanceText}>
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
                    <Text style={styles.helperText}>
                      Minimum deposit: {formatCurrency(displayMinDeposit, investmentCurrency)}
                    </Text>
                  )}
                </View>

                {/* Currency Toggle */}
                <View style={styles.currencySection}>
                  <Text style={styles.currencyLabel}>Display Currency</Text>
                  <CurrencyToggle
                    value={investmentCurrency}
                    onValueChange={setInvestmentCurrency}
                    options={['USD', user.displayCurrency].filter((code, index, arr) => arr.indexOf(code) === index)}
                  />
                  {investmentCurrency !== 'USD' && (
                    <Text style={styles.exchangeRateText}>
                      {getExchangeRateString('USD', investmentCurrency)}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Summary</Text>
                
                {/* Investment Details */}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Your Investment</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(parseFloat(amount) || 0, investmentCurrency)}
                  </Text>
                </View>
                
                {/* 30-Day Lock Warning */}
                <View style={styles.lockWarning}>
                  <Text style={styles.lockWarningTitle}>⚠️ 30-Day Lock Period</Text>
                  <Text style={styles.lockWarningText}>
                    Withdrawals will be blocked for 30 days after investment. This protects your investment and ensures compound interest growth.
                  </Text>
                </View>
                
                {/* ROI Breakdown */}
                {roiBreakdown && (
                  <View style={styles.breakdownSection}>
                    <Text style={styles.breakdownTitle}>ROI Breakdown</Text>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>National Bond</Text>
                      <Text style={styles.breakdownValue}>{roiBreakdown.bond_percent}%</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Platform Bonus</Text>
                      <Text style={styles.breakdownValue}>+{roiBreakdown.platform_percent}%</Text>
                    </View>
                    <View style={styles.breakdownDivider} />
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownTotalLabel}>Total APY</Text>
                      <Text style={styles.breakdownTotalValue}>{roiBreakdown.total_percent}%</Text>
                    </View>
                  </View>
                )}
                
                {/* Compound Interest Details */}
                {investmentCalculation && (
                  <View style={styles.compoundSection}>
                    <Text style={styles.compoundTitle}>Expected Returns</Text>
                    <View style={styles.compoundRow}>
                      <Text style={styles.compoundLabel}>Daily Rate</Text>
                      <Text style={styles.compoundValue}>{formatDailyRate(investmentCalculation.dailyRate)}</Text>
                    </View>
                    <View style={styles.compoundRow}>
                      <Text style={styles.compoundLabel}>Daily Earnings</Text>
                      <Text style={styles.compoundValue}>
                        +{formatCurrency(convertFromUSD(investmentCalculation.dailyEarnings, investmentCurrency), investmentCurrency)}
                      </Text>
                    </View>
                    <View style={styles.compoundRow}>
                      <Text style={styles.compoundLabel}>Total Growth ({selectedPlan?.duration_days} days)</Text>
                      <Text style={styles.profitValue}>
                        +{formatCurrency(convertFromUSD(investmentCalculation.profit, investmentCurrency), investmentCurrency)}
                      </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.totalLabel}>Final Value</Text>
                      <Text style={styles.totalValue}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  cardContent: {
    gap: 24,
  },
  formSpace: {
    gap: 20,
  },
  amountSection: {
    gap: 8,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  balanceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
  },
  currencySection: {
    gap: 12,
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  exchangeRateText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  summarySection: {
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  profitValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  confirmButton: {
    marginTop: 8,
  },
  breakdownSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    gap: 8,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  breakdownTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  breakdownTotalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  compoundSection: {
    marginTop: 16,
    gap: 8,
  },
  compoundTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  compoundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compoundLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  compoundValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#059669',
  },
  lockWarning: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    gap: 6,
  },
  lockWarningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d97706',
  },
  lockWarningText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
  },
});
