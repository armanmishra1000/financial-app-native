import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useData, useThemeColors } from '../../src/context';
import { NotificationItem } from '../../src/components/notification-item';

export default function NotificationsScreen() {
  const { notifications, markNotificationsAsRead } = useData();
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  const handleMarkAllAsRead = () => {
    markNotificationsAsRead();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScrollView style={themedStyles.container} contentContainerStyle={themedStyles.content}>
      <View style={themedStyles.header}>
        <View>
          <Text style={themedStyles.title}>Notifications</Text>
          <Text style={themedStyles.subtitle}>Stay updated with your account.</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity 
            onPress={handleMarkAllAsRead}
            style={themedStyles.markAllButton}
          >
            <Text style={themedStyles.markAllButtonText}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={themedStyles.list}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
            />
          ))
        ) : (
          <View style={themedStyles.empty}>
            <Text style={themedStyles.emptyTitle}>
              No Notifications
            </Text>
            <Text style={themedStyles.emptyDescription}>
              You’re all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </View>
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    markAllButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 999,
    },
    markAllButtonText: {
      color: colors.primaryForeground,
      fontSize: 14,
      fontWeight: '500',
    },
    list: {
      gap: 16,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.heading,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
