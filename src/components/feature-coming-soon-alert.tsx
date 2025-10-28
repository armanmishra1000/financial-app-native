import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/modal';
import { Button } from './ui/button';

interface FeatureComingSoonAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeatureComingSoonAlert({ open, onOpenChange }: FeatureComingSoonAlertProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Coming Soon</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <View style={styles.content}>
          <Text style={styles.description}>
            This feature is currently under development and will be available in a future update.
          </Text>
          <Text style={styles.description}>
            Thank you for your patience!
          </Text>
        </View>
      </ModalContent>
      <ModalFooter>
        <Button 
          onPress={() => onOpenChange(false)}
          style={styles.button}
        >
          Got it
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});
