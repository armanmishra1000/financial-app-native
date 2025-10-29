import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useThemeColors } from '../../context';
import { spacingScale, typographyScale } from '../../constants/layout';
import type { ThemeColors } from '../../theme/colors';

interface SelectItem {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface SharedSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  items: SelectItem[];
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  modalTitle?: string;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

type SelectProps<TFieldValues extends FieldValues = FieldValues> = SharedSelectProps & {
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
};

interface BaseSelectProps extends SharedSelectProps {
  error?: string;
}

const BaseSelect: React.FC<BaseSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select an option',
  items,
  label,
  error,
  helperText,
  disabled,
  modalTitle,
  style,
  triggerStyle,
  labelStyle,
  textStyle,
}) => {
  const colors = useThemeColors();
  const themeStyles = React.useMemo(() => createSelectThemeStyles(colors), [colors]);
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value),
    [items, value],
  );

  const handleOpen = React.useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = React.useCallback(
    (newValue: string) => {
      handleClose();
      onValueChange?.(newValue);
    },
    [handleClose, onValueChange],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: SelectItem }) => {
      const isSelected = item.value === value;
      const isItemDisabled = Boolean(item.disabled);

      return (
        <Pressable
          onPress={() => handleSelect(item.value)}
          disabled={isItemDisabled}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: isItemDisabled }}
          style={[
            styles.optionRow,
            themeStyles.optionRow,
            isSelected && themeStyles.optionRowSelected,
            isItemDisabled && themeStyles.optionRowDisabled,
          ]}
        >
          <View style={styles.optionTextWrapper}>
            <Text
              style={[
                styles.optionLabel,
                themeStyles.optionLabel,
                isSelected && themeStyles.optionLabelSelected,
                isItemDisabled && themeStyles.optionLabelDisabled,
              ]}
            >
              {item.label}
            </Text>
            {item.description ? (
              <Text
                style={[
                  styles.optionDescription,
                  themeStyles.optionDescription,
                  isItemDisabled && themeStyles.optionDescriptionDisabled,
                ]}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
          {isSelected ? <Check size={18} color={colors.primary} /> : null}
        </Pressable>
      );
    },
    [colors.primary, handleSelect, themeStyles, value],
  );

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, themeStyles.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <Pressable
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ expanded: isOpen, disabled }}
        style={[
          styles.trigger,
          themeStyles.trigger,
          disabled && themeStyles.triggerDisabled,
          error ? themeStyles.triggerError : null,
          triggerStyle,
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            themeStyles.triggerText,
            !selectedItem && themeStyles.placeholderText,
            textStyle,
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.iconMuted} />
      </Pressable>

      {error ? (
        <Text style={[styles.errorText, themeStyles.errorText]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.helperText, themeStyles.helperText]}>
          {helperText}
        </Text>
      ) : null}

      <Modal
        visible={isOpen}
        animationType="fade"
        transparent
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={handleClose} accessibilityRole="button" />
          <View style={[styles.modalSheet, themeStyles.modalSheet]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themeStyles.modalTitle]}>
                {modalTitle ?? label ?? placeholder}
              </Text>
              <Pressable
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.closeButton}
              >
                <X size={18} color={colors.iconMuted} />
              </Pressable>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={[styles.optionSeparator, themeStyles.optionSeparator]} />}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export function Select<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  onValueChange,
  error,
  ...props
}: SelectProps<TFieldValues>) {
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
          <BaseSelect
            {...props}
            value={value as string | undefined}
            error={fieldError?.message ?? error}
            onValueChange={(val) => {
              onChange(val);
              if (onValueChange) {
                onValueChange(val);
              }
            }}
          />
        )}
      />
    );
  }

  return (
    <BaseSelect
      {...props}
      error={error}
      onValueChange={onValueChange}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacingScale.xs,
  },
  label: {
    fontSize: typographyScale.bodySmall,
    fontWeight: '500',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingScale.md,
    paddingVertical: spacingScale.sm,
    borderWidth: 1,
    borderRadius: spacingScale.xs,
    minHeight: 48,
  },
  triggerText: {
    flex: 1,
    fontSize: typographyScale.body,
    fontWeight: '500',
    marginRight: spacingScale.sm,
  },
  helperText: {
    fontSize: typographyScale.caption,
  },
  errorText: {
    fontSize: typographyScale.caption,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: spacingScale.md,
    borderTopRightRadius: spacingScale.md,
    paddingVertical: spacingScale.lg,
    paddingHorizontal: spacingScale.lg,
    maxHeight: '80%',
    gap: spacingScale.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: typographyScale.subtitle,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacingScale.xs,
  },
  listContent: {
    paddingBottom: spacingScale.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingScale.sm,
    paddingHorizontal: spacingScale.sm,
    borderRadius: spacingScale.xs,
    gap: spacingScale.sm,
  },
  optionTextWrapper: {
    flex: 1,
    gap: spacingScale.xxs,
  },
  optionLabel: {
    fontSize: typographyScale.body,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: typographyScale.caption,
  },
  optionSeparator: {
    height: 1,
  },
});

const createSelectThemeStyles = (colors: ThemeColors) => ({
  label: {
    color: colors.text,
  },
  trigger: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  triggerText: {
    color: colors.text,
  },
  placeholderText: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  helperText: {
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
  },
  modalSheet: {
    backgroundColor: colors.surface,
  },
  modalTitle: {
    color: colors.heading,
  },
  optionRow: {
    backgroundColor: colors.surfaceSubtle,
  },
  optionRowSelected: {
    backgroundColor: colors.primarySurface,
  },
  optionRowDisabled: {
    opacity: 0.5,
  },
  optionLabel: {
    color: colors.text,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionLabelDisabled: {
    color: colors.textMuted,
  },
  optionDescription: {
    color: colors.textMuted,
  },
  optionDescriptionDisabled: {
    color: colors.textMuted,
  },
  optionSeparator: {
    backgroundColor: colors.divider,
  },
});
