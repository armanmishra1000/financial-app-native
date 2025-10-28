import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Transaction } from '../lib/data';
import { format } from 'date-fns';
import { formatCurrency } from '../lib/utils';

interface BalanceChartProps {
  transactions: Transaction[];
  currentBalance: number;
  currency: string;
}

type ChartDataPoint = {
  date: string;
  balance: number;
};

export function BalanceChart({ transactions, currentBalance, currency }: BalanceChartProps) {
  const chartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [{ date: format(new Date(), "MMM d"), balance: currentBalance }];
    }

    const history: ChartDataPoint[] = [];
    let runningBalance = currentBalance;

    history.push({
      date: format(new Date(), "MMM d"),
      balance: runningBalance,
    });

    // Sort transactions by date descending to process them chronologically backwards
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sortedTransactions.forEach(tx => {
      runningBalance -= tx.amount;
      history.push({
        date: format(new Date(tx.date), "MMM d"),
        balance: runningBalance,
      });
    });

    return history.reverse();
  }, [transactions, currentBalance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <View style={styles.chartContainer}>
          <CartesianChart 
            data={chartData} 
            xKey="date" 
            yKeys={["balance"]}
            domain={{ y: [0, 20] }}
          >
            {({ points }) => (
              <Line 
                points={points.balance} 
                color="#3b82f6"
                strokeWidth={2}
                curveType="natural"
              />
            )}
          </CartesianChart>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    height: 240,
    width: '100%',
  },
});
