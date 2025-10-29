import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColors } from '../../context';
import { Button } from './button';
import { spacingScale, typographyScale } from '../../constants/layout';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function SuccessModal({
  visible,
  title,
  message,
  onClose
}: SuccessModalProps) {
  const colors = useThemeColors();
  
  const themeStyles = React.useMemo(() => createSuccessModalStyles(colors), [colors]);

  const handleBackdropPress = () => {
    onClose();
  };

  const handleOkPress = () => {
    onClose();
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
              {/* Success Icon */}
              <View style={themeStyles.iconContainer}>
                <Text style={themeStyles.successIcon}>✅</Text>
              </View>
              
              <Text style={themeStyles.modalTitle}>{title}</Text>
              
              <ScrollView 
                style={themeStyles.messageScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={themeStyles.messageContainer}
              >
                <Text style={themeStyles.modalMessage}>{message}</Text>
              </ScrollView>
              
              <View style={themeStyles.buttonContainer}>
                <Button
                  onPress={handleOkPress}
                  style={themeStyles.okButton}
                >
                  OK
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createSuccessModalStyles = (colors: any) => StyleSheet.create({
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacingScale.md,
  },
  successIcon: {
    fontSize: 48,
  },
  modalTitle: {
    fontSize: typographyScale.headline,
    fontWeight: 'bold',
    color: colors.heading,
    marginBottom: spacingScale.md,
    textAlign: 'center',
  },
  messageScroll: {
    maxHeight: 200,
  },
  messageContainer: {
    flexGrow: 1,
  },
  modalMessage: {
    fontSize: typographyScale.body,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacingScale.xl,
  },
  buttonContainer: {
    marginTop: spacingScale.sm,
  },
  okButton: {
    backgroundColor: colors.primary,
  },
});
