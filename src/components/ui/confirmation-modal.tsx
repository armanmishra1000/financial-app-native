import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useThemeColors } from '../../context';
import { Button } from './button';
import { spacingScale, typographyScale } from '../../constants/layout';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonVariant?: 'default' | 'destructive';
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonVariant = 'default'
}: ConfirmationModalProps) {
  const colors = useThemeColors();
  
  const themeStyles = React.useMemo(() => createModalStyles(colors), [colors]);

  const handleBackdropPress = () => {
    onCancel();
  };

  const handleConfirmPress = () => {
    onConfirm();
  };

  const handleCancelPress = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableOpacity 
        style={themeStyles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <View style={themeStyles.modalContent}>
          <TouchableOpacity activeOpacity={1}>
            <View style={themeStyles.modalCard}>
              <Text style={themeStyles.modalTitle}>{title}</Text>
              <Text style={themeStyles.modalMessage}>{message}</Text>
              
              <View style={themeStyles.buttonContainer}>
                <View style={themeStyles.buttonWrapper}>
                  <Button
                    onPress={handleCancelPress}
                    variant="outline"
                    style={themeStyles.cancelButton}
                  >
                    {cancelText}
                  </Button>
                </View>
                
                <View style={themeStyles.buttonWrapper}>
                  <Button
                    onPress={handleConfirmPress}
                    variant={confirmButtonVariant === 'destructive' ? 'default' : 'default'}
                    style={themeStyles.confirmButton}
                  >
                    {confirmText}
                  </Button>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createModalStyles = (colors: any) => StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: spacingScale.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: spacingScale.md,
    padding: spacingScale.lg,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: typographyScale.headline,
    fontWeight: 'bold',
    color: colors.heading,
    marginBottom: spacingScale.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: typographyScale.body,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacingScale.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacingScale.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
});
