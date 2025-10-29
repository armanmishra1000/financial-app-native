import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { Briefcase, Wallet, BarChart2 } from 'lucide-react-native';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { convertFromUSD } from '../lib/currency-utils';
import { spacingScale, typographyScale } from '../constants/layout';

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
  
  // Convert amount to display currency
  const displayAmount = convertFromUSD(transaction.amount, displayCurrency);
  
  return (
    <View style={styles.container}>
      {/* Icon with colored background */}
      <View style={[
        styles.iconContainer,
        isPositive ? styles.iconContainerPositive : styles.iconContainerNeutral
      ]}>
        <Icon size={20} color={isPositive ? "#059669" : "#6b7280"} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{transaction.description}</Text>
        <View style={styles.metadata}>
          <Text style={styles.date}>
            {format(new Date(transaction.date), "MMM d, yyyy")}
          </Text>
          <Badge variant={statusVariants[transaction.status]}>
            {transaction.status}
          </Badge>
        </View>
      </View>
      
      <Text style={[styles.amount, isPositive && styles.amountPositive]}>
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
    borderBottomColor: '#e5e7eb',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacingScale.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingScale.md,
  },
  iconContainerPositive: {
    backgroundColor: '#d1fae5',
  },
  iconContainerNeutral: {
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  description: {
    fontWeight: '600',
    color: '#111827',
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
    color: '#6b7280',
  },
  amount: {
    fontWeight: '600',
    fontSize: typographyScale.body,
    textAlign: 'right',
  },
  amountPositive: {
    color: '#059669',
  },
  amountNegative: {
    color: '#dc2626',
  },
});
