import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { Briefcase, Wallet, BarChart2 } from 'lucide-react-native';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { convertFromUSD } from '../lib/currency-utils';
import { spacingScale, typographyScale } from '../constants/layout';
import { useThemeColors } from '../context';

interface TransactionItemProps {
  transaction: Transaction;
  displayCurrency?: string;
}

const transactionIcons = {
  Investment: Briefcase,
  Deposit: Wallet,
  Payout: BarChart2,
  Withdrawal: Wallet,
};

const statusVariants: { [key in Transaction['status']]: "secondary" | "outline" | "destructive" } = {
  Completed: "secondary",
  Pending: "outline",
  Failed: "destructive",
};

export function TransactionItem({ transaction, displayCurrency = 'USD' }: TransactionItemProps) {
  const isPositive = transaction.amount > 0;
  const Icon = transactionIcons[transaction.type];
  const colors = useThemeColors();
  
  // Convert amount to display currency
  const displayAmount = convertFromUSD(transaction.amount, displayCurrency);
  
  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: colors.divider },
      ]}
    >
      {/* Icon with colored background */}
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: isPositive ? colors.successSurface : colors.mutedSurface,
        },
      ]}>
        <Icon size={20} color={isPositive ? colors.success : colors.icon} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.text }]}>{transaction.description}</Text>
        <View style={styles.metadata}>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {format(new Date(transaction.date), "MMM d, yyyy")}
          </Text>
          <Badge variant={statusVariants[transaction.status]}>
            {transaction.status}
          </Badge>
        </View>
      </View>
      
      <Text
        style={[
          styles.amount,
          {
            color: isPositive ? colors.success : colors.danger,
          },
        ]}
      >
        {isPositive ? '+' : ''}{formatCurrency(Math.abs(displayAmount), displayCurrency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingScale.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacingScale.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingScale.md,
  },
  content: {
    flex: 1,
  },
  description: {
    fontWeight: '600',
    fontSize: typographyScale.body,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingScale.xs,
    marginTop: spacingScale.xs,
  },
  date: {
    fontSize: typographyScale.bodySmall,
  },
  amount: {
    fontWeight: '600',
    fontSize: typographyScale.body,
    textAlign: 'right',
  },
});
