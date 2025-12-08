import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import { useThemeColors } from '../context';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

export function ProfileMenuItem({ icon: Icon, label, onPress }: ProfileMenuItemProps) {
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={themedStyles.container}
    >
      <View style={themedStyles.iconContainer}>
        <Icon size={20} color={colors.iconMuted} />
      </View>
      <Text style={themedStyles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    iconContainer: {
      height: 40,
      width: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      backgroundColor: colors.mutedSurface,
    },
    label: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
  });
