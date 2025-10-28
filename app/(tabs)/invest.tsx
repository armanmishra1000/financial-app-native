import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../src/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Select } from '../../src/components/ui/select';
import { plans, Plan } from '../../src/lib/data';
import { formatCurrency } from '../../src/lib/utils';

export default function InvestScreen() {
  const router = useRouter();
  const { user, addTransaction } = useAppContext();

  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(plans[1]);
  const [amount, setAmount] = React.useState<string>("500");
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

  const calculatedReturn = React.useMemo(() => {
    if (!selectedPlan || !amount) return 0;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return 0;
    return numericAmount * (selectedPlan.roi_percent / 100);
  }, [selectedPlan, amount]);

  const totalPayout = React.useMemo(() => {
    if (!amount) return 0;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return 0;
    return numericAmount + calculatedReturn;
  }, [amount, calculatedReturn]);

  const handleInvest = () => {
    const numericAmount = parseFloat(amount);

    // Validation checks
    if (!selectedPlan || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Investment", "Please check the plan and amount.");
      return;
    }

    if (numericAmount < selectedPlan.min_deposit) {
      Alert.alert("Amount Too Low", `Amount must be at least ${formatCurrency(selectedPlan.min_deposit, user.currency)}.`);
      return;
    }

    if (user.balance < numericAmount) {
      Alert.alert("Insufficient Balance", "You don't have enough balance to make this investment.");
      return;
    }

    // Confirmation dialog
    Alert.alert(
      "Confirm Investment",
      `Invest ${formatCurrency(numericAmount, user.currency)} in ${selectedPlan.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => processInvestment(numericAmount)
        }
      ]
    );
  };

  const processInvestment = (numericAmount: number) => {
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      addTransaction({
        type: 'Investment',
        amount: -numericAmount,
        description: selectedPlan!.name,
      });

      setIsLoading(false);
      
      Alert.alert(
        "Investment Successful!",
        `Your investment of ${formatCurrency(numericAmount, user.currency)} has been processed.`,
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
                    <Text style={styles.amountLabel}>Amount to Invest ({user.currency})</Text>
                    <Text style={styles.balanceText}>
                      Balance: {formatCurrency(user.balance, user.currency)}
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
                      Minimum deposit: {formatCurrency(selectedPlan.min_deposit, user.currency)}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Your Investment</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(parseFloat(amount) || 0, user.currency)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Estimated Profit ({selectedPlan?.roi_percent}%)
                  </Text>
                  <Text style={styles.profitValue}>
                    +{formatCurrency(calculatedReturn, user.currency)}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Payout</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(totalPayout, user.currency)}
                  </Text>
                </View>
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
});
