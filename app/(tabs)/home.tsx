import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react-native';

import { useAppContext } from '../../src/context/app-context';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Avatar } from '../../src/components/ui/avatar';
import { TransactionItem } from '../../src/components/transaction-item';
import { ActionCard } from '../../src/components/action-card';
import { BalanceChart } from '../../src/components/balance-chart';
import { formatCurrency } from '../../src/lib/utils';
import { HomePageSkeleton } from '../../src/components/home-page-skeleton';
import { Briefcase, BarChart2, Wallet } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, transactions, isHydrated } = useAppContext();
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
                  {formatCurrency(user.balance, user.currency)}
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
            currency={user.currency} 
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
                <TransactionItem key={tx.id} transaction={tx} />
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
});
