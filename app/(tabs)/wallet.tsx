import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing, StyleProp, ViewStyle, FlexAlignType } from 'react-native';
import { ArrowDownToLine, ArrowUpFromLine, FilterX } from 'lucide-react-native';
import { useData, useThemeColors } from '../../src/context';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { TransactionItem } from '../../src/components/transaction-item';
import { SegmentedControl } from '../../src/components/ui/segmented-control';
import { AccountDetails } from '../../src/components/account-details';
import { formatCurrency } from '../../src/lib/utils';
import { Transaction } from '../../src/lib/data';
import { isInvestmentLocked, formatLockExpiry } from '../../src/lib/investment-utils';
import { convertFromUSD, convertToUSD } from '../../src/lib/currency-utils';
import { spacingScale, typographyScale } from '../../src/constants/layout';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import type { ThemeColors } from '../../src/theme/colors';

type DialogType = 'Deposit' | 'Withdrawal' | null;


export default function WalletScreen() {
  const { user, transactions, addTransaction, investments } = useData();
  const colors = useThemeColors();
  const [dialogOpen, setDialogOpen] = React.useState<DialogType>(null);
  const [filter, setFilter] = React.useState<Transaction['type'] | 'All'>('All');
  
  const [amount, setAmount] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
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
  const themeStyles = React.useMemo(() => createWalletThemeStyles(colors), [colors]);

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
    
    // Use filter state
    if (filter !== 'All') {
      filtered = transactions.filter(tx => tx.type === filter);
    }
    
    return filtered;
  }, [transactions, filter]);

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

    // Convert input amount to USD for storage and validation
    const amountInUSD = user.displayCurrency === 'USD' 
      ? numericAmount 
      : convertToUSD(numericAmount, user.displayCurrency);

    if (dialogOpen === 'Withdrawal' && amountInUSD > user.balance) {
      Alert.alert(
        "Insufficient Funds", 
        `You don't have enough balance. Available: ${formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}`
      );
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
        amount: dialogOpen === 'Deposit' ? amountInUSD : -amountInUSD,
        description: dialogOpen === 'Deposit' ? 'Bank Transfer' : 'To Bank Account',
      });

      setIsLoading(false);
      handleDialogClose();
      Alert.alert(
        "Success",
        `${dialogOpen} of ${formatCurrency(numericAmount, user.displayCurrency)} completed successfully!`
      );
    }, 1000);
  };

  const filterOptions: (Transaction['type'] | 'All')[] = ['All', 'Deposit', 'Withdrawal', 'Investment', 'Payout'];

  return (
    <Animated.View
      style={[
        styles.container,
        themeStyles.container,
        { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
      ]}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, contentContainerStyle]}>
        <View style={[styles.space, isExpanded ? styles.spaceExpanded : null]}>
          <View style={styles.header}>
            <Text style={[styles.title, themeStyles.title]}>Wallet</Text>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>
              Manage your funds and transactions.
            </Text>
          </View>

          

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <Text style={[styles.balanceLabel, themeStyles.balanceLabel]}>Total Balance</Text>
            <Text style={[styles.balanceAmount, themeStyles.balanceAmount]}>{formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}</Text>
          </CardHeader>
          <CardContent>
            {/* Action buttons */}
            {
              <View style={[styles.actionButtons, isMedium ? styles.actionButtonsUnwrapped : null]}>
                <Button 
                  variant="outline"
                  size="lg"
                  onPress={() => handleDialogOpen('Deposit')}
                  style={[styles.actionButton, themeStyles.actionButton]}
                >
                  <ArrowDownToLine size={16} color={colors.text} />
                  <Text style={[styles.actionButtonText, themeStyles.actionButtonText]}>Deposit</Text>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onPress={() => handleDialogOpen('Withdrawal')}
                  style={[styles.actionButton, themeStyles.actionButton]}
                >
                  <ArrowUpFromLine size={16} color={colors.text} />
                  <Text style={[styles.actionButtonText, themeStyles.actionButtonText]}>Withdraw</Text>
                </Button>
              </View>
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter buttons */}
            {
              <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <View style={styles.filterButtons}>
                    {filterOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.filterButton,
                          themeStyles.filterButton,
                          filter === option && styles.filterButtonActive,
                          filter === option && themeStyles.filterButtonActive,
                        ]}
                        onPress={() => setFilter(option)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          themeStyles.filterButtonText,
                          filter === option && styles.filterButtonTextActive,
                          filter === option && themeStyles.filterButtonTextActive,
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            }
            
            {filteredTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {filteredTransactions.map(tx => (
                  <View key={tx.id} style={[styles.transactionItem, themeStyles.transactionItem]}>
                    <TransactionItem transaction={tx} displayCurrency={user.displayCurrency} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyStateIcon, themeStyles.emptyStateIcon]}>
                  <FilterX size={24} color={colors.iconMuted} />
                </View>
                <Text style={[styles.emptyStateTitle, themeStyles.emptyStateTitle]}>No Transactions Found</Text>
                <Text style={[styles.emptyStateDescription, themeStyles.emptyStateDescription]}>
                  There are no transactions that match your selected filter.
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Modal - Only show in Wallet mode */}
      {dialogOpen && (
        <Modal
          visible={!!dialogOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleDialogClose}
        >
        <View style={[styles.modalContainer, themeStyles.modalContainer]}>
          <View style={[styles.modalHeader, themeStyles.modalHeader]}>
            <Text style={[styles.modalTitle, themeStyles.modalTitle]}>{dialogOpen} Funds</Text>
            <Text style={[styles.modalDescription, themeStyles.modalDescription]}>
              Enter the amount you wish to {dialogOpen?.toLowerCase()}. Your current balance is {formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}.
            </Text>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, themeStyles.inputLabel]}>Amount</Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                placeholder={`Amount in ${user.displayCurrency}`}
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </View>
          </View>
          <View style={[styles.modalFooter, themeStyles.modalFooter]}>
            <Button 
              style={[styles.cancelButton, themeStyles.cancelButton]}
              textStyle={[styles.cancelButtonText, themeStyles.cancelButtonText]}
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
  scrollView: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: spacingScale.xs,
    letterSpacing: -1.5,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingScale.md,
  },
  actionButtonsUnwrapped: {
    flexWrap: 'nowrap',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingScale.xs,
    paddingVertical: spacingScale.xs,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: typographyScale.bodySmall,
  },
  filterSection: {
    marginBottom: spacingScale.md,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacingScale.xs,
  },
  filterButton: {
    paddingHorizontal: spacingScale.md,
    paddingVertical: spacingScale.xs,
    borderRadius: 20,
  },
  filterButtonActive: {
  },
  filterButtonText: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  filterButtonTextActive: {
  },
  transactionsList: {
    gap: 0,
  },
  transactionItem: {
    borderBottomWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacingScale.xxl,
    paddingHorizontal: spacingScale.lg,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingScale.md,
  },
  emptyStateTitle: {
    fontSize: typographyScale.title,
    fontWeight: '600',
    marginBottom: spacingScale.xs,
  },
  emptyStateDescription: {
    fontSize: typographyScale.bodySmall,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    padding: spacingScale.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typographyScale.headline,
    fontWeight: 'bold',
    marginBottom: spacingScale.xs,
  },
  modalDescription: {
    fontSize: typographyScale.body,
    lineHeight: 24,
  },
  modalContent: {
    padding: spacingScale.lg,
  },
  inputSection: {
    gap: spacingScale.xs,
  },
  inputLabel: {
    fontSize: typographyScale.body,
    fontWeight: '500',
  },
  amountInput: {
    marginTop: spacingScale.xs,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacingScale.md,
    padding: spacingScale.lg,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
  },
  confirmButton: {
    flex: 1,
  },
  confirmButtonText: {
    fontWeight: '600',
  },
});

const createWalletThemeStyles = (colors: ThemeColors) => ({
  container: {
    backgroundColor: colors.background,
  },
  title: {
    color: colors.heading,
  },
  subtitle: {
    color: colors.textMuted,
  },
  balanceLabel: {
    color: colors.textMuted,
  },
  balanceAmount: {
    color: colors.heading,
  },
  actionButton: {
    backgroundColor: colors.mutedSurface,
  },
  actionButtonText: {
    color: colors.text,
  },
  filterButton: {
    backgroundColor: colors.mutedSurface,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.primaryForeground,
  },
  transactionItem: {
    borderBottomColor: colors.divider,
  },
  emptyStateIcon: {
    backgroundColor: colors.mutedSurface,
  },
  emptyStateTitle: {
    color: colors.heading,
  },
  emptyStateDescription: {
    color: colors.textMuted,
  },
  modalContainer: {
    backgroundColor: colors.surface,
  },
  modalHeader: {
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    color: colors.heading,
  },
  modalDescription: {
    color: colors.textMuted,
  },
  inputLabel: {
    color: colors.text,
  },
  modalFooter: {
    borderTopColor: colors.divider,
  },
  cancelButton: {
    backgroundColor: colors.mutedSurface,
  },
  cancelButtonText: {
    color: colors.text,
  },
});
