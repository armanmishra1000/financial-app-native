import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../../src/context';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { PaymentMethodItem } from '../../src/components/payment-method-item';
import { AddPaymentMethodDialog } from '../../src/components/add-payment-method-dialog';
import { Plus } from 'lucide-react-native';

export default function PaymentMethodsScreen() {
  const { paymentMethods } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Payment Methods</Text>
            <Text style={styles.subtitle}>Manage your payment options.</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsAddDialogOpen(true)}
            style={styles.addButton}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <PaymentMethodItem 
                key={method.id} 
                method={method} 
              />
            ))
          ) : (
            <Card>
              <CardContent style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>
                  No Payment Methods
                </Text>
                <Text style={styles.emptyDescription}>
                  Add a payment method to make deposits and withdrawals.
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsAddDialogOpen(true)}
                  style={styles.emptyButton}
                >
                  <Button style={styles.button}>
                    <Plus size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Add Payment Method</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3b82f6',
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
    color: '#111827',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
