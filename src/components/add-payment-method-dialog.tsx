import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from './ui/modal';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { useAppContext } from '../context/app-context';
// import { toast } from 'sonner-native';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  provider: z.enum(["Visa", "Mastercard"], { required_error: "Please select a card provider." }),
  cardNumber: z.string().length(16, "Card number must be 16 digits.").regex(/^\d+$/, "Card number must only contain digits."),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format."),
});

export function AddPaymentMethodDialog({ open, onOpenChange }: AddPaymentMethodDialogProps) {
  const { addPaymentMethod } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: undefined,
      cardNumber: "",
      expiry: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    setTimeout(() => {
      addPaymentMethod({
        type: 'Card',
        provider: values.provider,
        last4: values.cardNumber.slice(-4),
        expiry: values.expiry,
      });
      // toast.success("Payment method added successfully!");
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  }

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const providerOptions = [
    { label: "Visa", value: "Visa" },
    { label: "Mastercard", value: "Mastercard" }
  ];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Add New Card</ModalTitle>
        <ModalDescription>
          Enter your card details below. Your information is secure.
        </ModalDescription>
      </ModalHeader>
      <ModalContent>
        <View style={styles.content}>
          <Controller
            control={form.control}
            name="provider"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Card Provider"
                value={value}
                onValueChange={onChange}
                items={providerOptions}
                placeholder="Select a provider"
                error={form.formState.errors.provider?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="cardNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Card Number"
                placeholder="**** **** **** ****"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={16}
                error={form.formState.errors.cardNumber?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="expiry"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={value}
                onChangeText={onChange}
                error={form.formState.errors.expiry?.message}
              />
            )}
          />
        </View>
      </ModalContent>
      <ModalFooter>
        <Button 
          onPress={form.handleSubmit(onSubmit)} 
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Saving..." : "Add Card"}
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
