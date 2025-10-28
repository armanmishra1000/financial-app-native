import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { PaymentMethod } from '../lib/data';

interface PaymentMethodItemProps {
  method: PaymentMethod;
}

export function PaymentMethodItem({ method }: PaymentMethodItemProps) {
  return (
    <Card>
      <CardContent style={styles.content}>
        <View style={styles.header}>
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {method.provider}
              </Text>
              <Badge variant="secondary">
                {method.type}
              </Badge>
            </View>
            <Text style={styles.details}>
              •••• {method.last4}
            </Text>
            {method.expiry && (
              <Text style={styles.expiry}>
                Expires {method.expiry}
              </Text>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '500',
    color: '#111827',
  },
  details: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  expiry: {
    fontSize: 14,
    color: '#6b7280',
  },
});
