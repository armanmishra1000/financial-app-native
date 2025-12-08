import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useData, useThemeColors } from '../../src/context';
import { Card, CardContent } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { PaymentMethodItem } from '../../src/components/payment-method-item';
import { AddPaymentMethodDialog } from '../../src/components/add-payment-method-dialog';
import { Plus } from 'lucide-react-native';

export default function PaymentMethodsScreen() {
  const { paymentMethods } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      <ScrollView style={themedStyles.container} contentContainerStyle={themedStyles.content}>
        <View style={themedStyles.header}>
          <View>
            <Text style={themedStyles.title}>Payment Methods</Text>
            <Text style={themedStyles.subtitle}>Manage your payment options.</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsAddDialogOpen(true)}
            style={themedStyles.addButton}
          >
            <Plus size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        <View style={themedStyles.list}>
          {paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <PaymentMethodItem 
                key={method.id} 
                method={method} 
              />
            ))
          ) : (
            <Card>
              <CardContent style={themedStyles.emptyContent}>
                <Text style={themedStyles.emptyTitle}>
                  No Payment Methods
                </Text>
                <Text style={themedStyles.emptyDescription}>
                  Add a payment method to make deposits and withdrawals.
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsAddDialogOpen(true)}
                  style={themedStyles.emptyButton}
                >
                  <Button style={themedStyles.button}>
                    <Plus size={16} color={colors.primaryForeground} />
                    <Text style={themedStyles.buttonText}>Add Payment Method</Text>
                  </Button>
                </TouchableOpacity>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>

      <AddPaymentMethodDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 80,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.heading,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textMuted,
      marginTop: 4,
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 8,
    },
    list: {
      gap: 16,
    },
    emptyContent: {
      padding: 32,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.heading,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 16,
      textAlign: 'center',
    },
    emptyButton: {
      width: '100%',
    },
    button: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: '500',
    },
  });
