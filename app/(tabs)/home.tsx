import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react-native';

import { useData, useAppState } from '../../src/context';
import { useInvestmentCalculations } from '../../src/hooks/useInvestmentCalculations';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Avatar } from '../../src/components/ui/avatar';
import { TransactionItem } from '../../src/components/transaction-item';
import { ActionCard } from '../../src/components/action-card';
import { BalanceChart } from '../../src/components/balance-chart';
import { formatCurrency } from '../../src/lib/utils';
import { plans, Plan } from '../../src/lib/data';
import { HomePageSkeleton } from '../../src/components/home-page-skeleton';
import { Briefcase, BarChart2, Wallet, TrendingUp, Clock, Lock, Unlock } from 'lucide-react-native';
import { calculateCurrentValue, calculateDailyRate, calculateDaysRemaining, calculateProgress, isInvestmentLocked, getDaysUntilUnlock, formatLockExpiry } from '../../src/lib/investment-utils';
import { convertFromUSD } from '../../src/lib/currency-utils';

export default function HomeScreen() {
  const { user, transactions, investments } = useData();
  const { getInvestmentCurrentValue } = useInvestmentCalculations();
  const { isHydrated } = useAppState();
  const router = useRouter();
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(true);
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

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prevState => !prevState);
  };

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Active Investment Card Component
  const ActiveInvestmentCard = ({ investment }: { investment: any }) => {
    const currentValue = getInvestmentCurrentValue(investment.id);
    const profit = currentValue - investment.amount;
    const profitPercent = ((profit / investment.amount) * 100);
    
    // Get plan details
    const plan = plans.find((p: Plan) => p.id === investment.planId);
    const daysRemaining = plan ? calculateDaysRemaining(investment.startDate, plan.duration_days) : 0;
    const progress = plan ? calculateProgress(investment.startDate, plan.duration_days) : 0;
    
    // Check lock status
    const isLocked = isInvestmentLocked(investment.lockedUntil);
    const daysUntilUnlock = getDaysUntilUnlock(investment.lockedUntil);
    
    // Convert amounts to display currency
    const displayAmount = convertFromUSD(investment.amount, user.displayCurrency);
    const displayCurrentValue = convertFromUSD(currentValue, user.displayCurrency);
    const displayProfit = convertFromUSD(profit, user.displayCurrency);
    
    return (
      <Card style={styles.investmentCard}>
        <CardContent style={styles.investmentCardContent}>
          <View style={styles.investmentHeader}>
            <View>
              <Text style={styles.investmentTitle}>{investment.planName}</Text>
              <Text style={styles.investmentSubtitle}>
                Started: {new Date(investment.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.investmentStatus}>
              <Text style={styles.investmentStatusText}>Active</Text>
            </View>
          </View>
          
          {/* Lock Status Indicator */}
          <View style={styles.lockStatus}>
            <View style={styles.lockStatusHeader}>
              {isLocked ? (
                <>
                  <Lock size={14} color="#dc2626" />
                  <Text style={styles.lockStatusTextLocked}>🔒 Locked</Text>
                </>
              ) : (
                <>
                  <Unlock size={14} color="#059669" />
                  <Text style={styles.lockStatusTextUnlocked}>🔓 Unlocked</Text>
                </>
              )}
            </View>
            <Text style={styles.lockStatusDescription}>
              {isLocked 
                ? `Withdrawals blocked until ${formatLockExpiry(investment.lockedUntil)}`
                : 'Withdrawals allowed'
              }
            </Text>
            {isLocked && (
              <Text style={styles.lockStatusDays}>
                {daysUntilUnlock} days remaining
              </Text>
            )}
          </View>
          
          <View style={styles.investmentMetrics}>
            <View style={styles.investmentMetric}>
              <Text style={styles.investmentMetricLabel}>Original</Text>
              <Text style={styles.investmentMetricValue}>
                {formatCurrency(displayAmount, user.displayCurrency)}
              </Text>
            </View>
            <View style={styles.investmentMetric}>
              <Text style={styles.investmentMetricLabel}>Current</Text>
              <Text style={styles.investmentMetricValue}>
                {formatCurrency(displayCurrentValue, user.displayCurrency)}
              </Text>
            </View>
            <View style={styles.investmentMetric}>
              <Text style={styles.investmentMetricLabel}>Profit</Text>
              <Text style={[styles.investmentMetricValue, styles.profitText]}>
                +{formatCurrency(displayProfit, user.displayCurrency)}
              </Text>
              <Text style={[styles.profitPercent, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
          
          <View style={styles.investmentProgress}>
            <View style={styles.progressHeader}>
              <Clock size={14} color="#6b7280" />
              <Text style={styles.progressText}>
                {daysRemaining} days remaining
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
          </View>
        </CardContent>
      </Card>
    );
  };

  if (!isHydrated) {
    return <HomePageSkeleton />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.space}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Welcome, {user.name.split(' ')[0]}!</Text>
            <Text style={styles.subtitle}>Here is your financial overview.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar
              src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name.replace(/\s/g, '')}`}
              fallback={userInitials}
              size={40}
            />
          </TouchableOpacity>
          </View>

        <Card>
          <CardHeader>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>Account Balance</Text>
              <TouchableOpacity 
                style={styles.balanceToggle}
                onPress={toggleBalanceVisibility}
              >
                {isBalanceVisible ? <EyeOff size={16} color="#6b7280" /> : <Eye size={16} color="#6b7280" />}
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.balanceAmountContainer}>
              <View style={[
                styles.balanceBlurContainer,
                !isBalanceVisible && styles.balanceBlurred
              ]}>
                <Text style={[
                  styles.balanceAmount,
                  !isBalanceVisible && styles.balanceHidden
                ]}>
                  {formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}
                </Text>
              </View>
            </View>
            <View style={styles.balanceChange}>
              <ArrowUpRight size={16} color="#059669" />
              <Text style={styles.balanceChangeText}>+5.2% in last 24h</Text>
            </View>
          </CardContent>
        </Card>

        {Platform.OS !== 'web' ? (
          <BalanceChart 
            transactions={transactions} 
            currentBalance={user.balance} 
            currency={user.displayCurrency} 
          />
        ) : (
          <Card>
            <CardHeader>
              <Text style={styles.sectionTitle}>Balance Overview</Text>
            </CardHeader>
            <CardContent>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>
                  📊 Chart available on mobile app
                </Text>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Active Investments Section */}
        {investments.filter(inv => inv.status === 'Active').length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Investments</Text>
              <TrendingUp size={20} color="#059669" />
            </View>
            <View style={styles.investmentsList}>
              {investments
                .filter(inv => inv.status === 'Active')
                .map(investment => (
                  <ActiveInvestmentCard key={investment.id} investment={investment} />
                ))}
            </View>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionCard href="/invest" icon={Briefcase} title="Invest" />
            <ActionCard href="/plans" icon={BarChart2} title="Plans" />
            <ActionCard href="/wallet" icon={Wallet} title="Wallet" />
          </View>
        </View>

        <Card>
          <CardHeader>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.transactionsList}>
              {transactions.slice(0, 3).map(tx => (
                <TransactionItem key={tx.id} transaction={tx} displayCurrency={user.displayCurrency} />
              ))}
            </View>
            <Button 
              variant="link"
              onPress={() => router.push('/wallet')}
            >
              View All
            </Button>
          </CardContent>
        </Card>
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
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: 4,
  },

  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  balanceToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceAmountContainer: {
    marginTop: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -1.5,
  },
  balanceBlurContainer: {
    overflow: 'hidden',
  },
  balanceBlurred: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  balanceHidden: {
    opacity: 0.1,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  balanceChangeText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  transactionsList: {
    gap: 0,
  },
  
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentsList: {
    gap: 16,
  },
  investmentCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  investmentCardContent: {
    gap: 16,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.3,
  },
  investmentSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  investmentStatus: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  investmentStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#22c55e',
  },
  investmentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentMetric: {
    alignItems: 'center',
    flex: 1,
  },
  investmentMetricLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  investmentMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  profitText: {
    color: '#059669',
  },
  profitPercent: {
    fontSize: 10,
    marginTop: 2,
  },
  profitPositive: {
    color: '#059669',
  },
  profitNegative: {
    color: '#dc2626',
  },
  investmentProgress: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressPercent: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  lockStatus: {
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  lockStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockStatusTextLocked: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  lockStatusTextUnlocked: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  lockStatusDescription: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 20,
  },
  lockStatusDays: {
    fontSize: 10,
    color: '#dc2626',
    marginLeft: 20,
    fontWeight: '500',
  },
});
