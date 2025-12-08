import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { EditProfileForm } from '../../src/components/edit-profile-form';
import { useThemeColors } from '../../src/context';

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  const handleSuccess = () => {
    router.back();
  };

  return (
    <ScrollView style={themedStyles.container} contentContainerStyle={themedStyles.content}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>Edit Profile</Text>
        <Text style={themedStyles.subtitle}>Update your account information.</Text>
      </View>
        
      <EditProfileForm onSuccess={handleSuccess} />
    </ScrollView>
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
  });
