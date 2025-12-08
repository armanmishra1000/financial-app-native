import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { PaymentMethod } from '../lib/data';
import { useThemeColors } from '../context';

interface PaymentMethodItemProps {
  method: PaymentMethod;
}

export function PaymentMethodItem({ method }: PaymentMethodItemProps) {
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Card>
      <CardContent style={themedStyles.content}>
        <View style={themedStyles.header}>
          <View style={themedStyles.body}>
            <View style={themedStyles.titleRow}>
              <Text style={themedStyles.title}>
                {method.provider}
              </Text>
              <Badge variant="secondary">
                {method.type}
              </Badge>
            </View>
            <Text style={themedStyles.details}>
              •••• {method.last4}
            </Text>
            {method.expiry && (
              <Text style={themedStyles.expiry}>
                Expires {method.expiry}
              </Text>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
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
      color: colors.heading,
    },
    details: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 4,
    },
    expiry: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
