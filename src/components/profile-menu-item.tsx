import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

export function ProfileMenuItem({ icon: Icon, label, onPress }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Icon size={20} color="#6b7280" />
      </View>
      <Text style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#f3f4f6',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
