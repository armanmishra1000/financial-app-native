import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from './ui/modal';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useData } from '../context';
import { formatCurrency } from '../lib/utils';
import { convertToUSD, convertFromUSD } from '../lib/currency-utils';
// import { toast } from 'sonner-native';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'Deposit' | 'Withdrawal';
}

export function TransactionDialog({ open, onOpenChange, type }: TransactionDialogProps) {
  const { user, addTransaction } = useData();
  const [amount, setAmount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      // toast.error("Please enter a valid positive amount.");
      setIsLoading(false);
      return;
    }

    // Convert input amount to USD for storage and validation
    const amountInUSD = user.displayCurrency === 'USD' 
      ? numericAmount 
      : convertToUSD(numericAmount, user.displayCurrency);

    if (type === 'Withdrawal' && amountInUSD > user.balance) {
      // toast.error("Insufficient funds for this withdrawal.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      addTransaction({
        type,
        amount: type === 'Deposit' ? amountInUSD : -amountInUSD,
        description: type === 'Deposit' ? 'Bank Transfer' : 'To Bank Account',
      });

      // toast.success(`${type} successful!`);
      setIsLoading(false);
      setAmount("");
      onOpenChange(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (!open) {
      setAmount("");
    }
  }, [open]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>{type} Funds</ModalTitle>
        <ModalDescription>
          Enter the amount you wish to {type.toLowerCase()}. Your current balance is {formatCurrency(convertFromUSD(user.balance, user.displayCurrency), user.displayCurrency)}.
        </ModalDescription>
      </ModalHeader>
      <ModalContent>
        <View style={styles.content}>
          <Input
            placeholder={`Amount in ${user.displayCurrency}`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
      </ModalContent>
      <ModalFooter>
        <Button 
          onPress={handleSubmit} 
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Processing..." : `Confirm ${type}`}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
