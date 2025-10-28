import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { ArrowDownToLine, ArrowUpFromLine, FilterX } from 'lucide-react-native';
import { useAppContext } from '../../src/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { TransactionItem } from '../../src/components/transaction-item';
import { SegmentedControl } from '../../src/components/ui/segmented-control';
import { AccountDetails } from '../../src/components/account-details';
import { formatCurrency } from '../../src/lib/utils';
import { Transaction } from '../../src/lib/data';
import { isInvestmentLocked, formatLockExpiry } from '../../src/lib/investment-utils';
import { convertFromUSD } from '../../src/lib/currency-utils';

type DialogType = 'Deposit' | 'Withdrawal' | null;
type ViewMode = 'Wallet' | 'Retire';

export default function WalletScreen() {
  const { user, transactions, addTransaction, investments } = useAppContext();
  const [dialogOpen, setDialogOpen] = React.useState<DialogType>(null);
  const [filter, setFilter] = React.useState<Transaction['type'] | 'All'>('All');
  const [viewMode, setViewMode] = React.useState<ViewMode>('Wallet');
  const [amount, setAmount] = React.useState('');
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

  const filteredTransactions = React.useMemo(() => {
    let filtered = transactions;
    
    // If in Retire mode, only show Deposit/Withdrawal
    if (viewMode === 'Retire') {
      filtered = transactions.filter(tx => 
        tx.type === 'Deposit' || tx.type === 'Withdrawal'
      );
    } else {
      // Wallet mode: use filter state
      if (filter !== 'All') {
        filtered = transactions.filter(tx => tx.type === filter);
      }
    }
    
    return filtered;
  }, [transactions, filter, viewMode]);

  const handleDialogOpen = (type: DialogType) => {
    setDialogOpen(type);
    setAmount('');
  };

  const handleDialogClose = () => {
    setDialogOpen(null);
    setAmount('');
  };

  const handleSubmit = () => {
    if (!dialogOpen) return;
    
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
      return;
    }

    if (dialogOpen === 'Withdrawal' && numericAmount > user.balance) {
      Alert.alert("Insufficient Funds", "You don't have enough balance for this withdrawal.");
      return;
    }

    // Check for locked investments before withdrawal
    if (dialogOpen === 'Withdrawal') {
      const lockedInvestments = investments.filter(inv => 
        inv.status === 'Active' && isInvestmentLocked(inv.lockedUntil)
      );

      if (lockedInvestments.length > 0) {
        const earliestUnlock = lockedInvestments
          .map(inv => inv.lockedUntil)
          .sort()[0]; // Get earliest unlock date
        
        Alert.alert(
          "Withdrawal Blocked",
          `You have ${lockedInvestments.length} locked investment(s). Withdrawals are not allowed until all investments unlock.\n\nEarliest unlock: ${formatLockExpiry(earliestUnlock)}`
        );
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      addTransaction({
        type: dialogOpen,
        amount: dialogOpen === 'Deposit' ? numericAmount : -numericAmount,
        description: dialogOpen === 'Deposit' ? 'Bank Transfer' : 'To Bank Account',
      });

      setIsLoading(false);
      handleDialogClose();
      Alert.alert(
        "Success",
        `${dialogOpen} of ${formatCurrency(convertFromUSD(numericAmount, user.displayCurrency), user.displayCurrency)} completed successfully!`
      );
    }, 1000);
  };

  const filterOptions: (Transaction['type'] | 'All')[] = ['All', 'Deposit', 'Withdrawal', 'Investment', 'Payout'];
  const viewModeOptions: ViewMode[] = ['Wallet', 'Retire'];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.space}>
          <View style={styles.header}>
            <Text style={styles.title}>{viewMode === 'Wallet' ? 'Wallet' : 'Retire'}</Text>
            <Text style={styles.subtitle}>
              {viewMode === 'Wallet' ? 'Manage your funds and transactions.' : 'View your retirement account details and transaction history.'}
            </Text>
          </View>

          {/* Segmented Control */}
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            options={viewModeOptions}
          />

        {/* Account Details - Only in Retire mode */}
        {viewMode === 'Retire' && <AccountDetails />}

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}</Text>
          </CardHeader>
          <CardContent>
            {/* Action buttons - Only in Wallet mode */}
            {viewMode === 'Wallet' && (
              <View style={styles.actionButtons}>
                <Button 
                  variant="outline"
                  size="lg"
                  onPress={() => handleDialogOpen('Deposit')}
                  style={styles.actionButton}
                >
                  <ArrowDownToLine size={16} color="#374151" />
                  <Text style={styles.actionButtonText}>Deposit</Text>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onPress={() => handleDialogOpen('Withdrawal')}
                  style={styles.actionButton}
                >
                  <ArrowUpFromLine size={16} color="#374151" />
                  <Text style={styles.actionButtonText}>Withdraw</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter buttons - Only in Wallet mode */}
            {viewMode === 'Wallet' && (
              <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <View style={styles.filterButtons}>
                    {filterOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.filterButton,
                          filter === option && styles.filterButtonActive
                        ]}
                        onPress={() => setFilter(option)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          filter === option && styles.filterButtonTextActive
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
            
            {filteredTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {filteredTransactions.map(tx => (
                  <View key={tx.id} style={styles.transactionItem}>
                    <TransactionItem transaction={tx} displayCurrency={user.displayCurrency} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <FilterX size={24} color="#6b7280" />
                </View>
                <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
                <Text style={styles.emptyStateDescription}>
                  {viewMode === 'Retire' 
                    ? 'There are no deposit or withdrawal transactions in your retirement account.'
                    : 'There are no transactions that match your selected filter.'
                  }
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Modal - Only show in Wallet mode */}
      {dialogOpen && viewMode === 'Wallet' && (
        <Modal
          visible={!!dialogOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleDialogClose}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{dialogOpen} Funds</Text>
            <Text style={styles.modalDescription}>
              Enter the amount you wish to {dialogOpen?.toLowerCase()}. Your current balance is {formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}.
            </Text>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount</Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                placeholder={`Amount in ${user.displayCurrency}`}
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Button 
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              onPress={handleDialogClose}
            >
              Cancel
            </Button>
            <Button 
              style={styles.confirmButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Confirm ${dialogOpen}`}
            </Button>
          </View>
        </View>
      </Modal>
      )}
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
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
    letterSpacing: -1.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  transactionsList: {
    gap: 0,
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  modalContent: {
    padding: 24,
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  amountInput: {
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 16,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
