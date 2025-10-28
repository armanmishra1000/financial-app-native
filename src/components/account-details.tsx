import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../context/app-context';

export function AccountDetails() {
  const { user } = useAppContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Holder</Text>
            <Text style={styles.detailValue}>{user.name || 'User'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>Retirement Account</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Currency</Text>
            <Text style={styles.detailValue}>{user.currency}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Badge variant="secondary">Active</Badge>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
