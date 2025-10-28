import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../../src/context';
import { NotificationItem } from '../../src/components/notification-item';
import { format } from 'date-fns';

export default function NotificationsScreen() {
  const { notifications, markNotificationsAsRead } = useData();

  const handleMarkAllAsRead = () => {
    markNotificationsAsRead();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Stay updated with your account.</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity 
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllButtonText}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No Notifications
            </Text>
            <Text style={styles.emptyDescription}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  markAllButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  markAllButtonText: {
    color: '#ffffff',
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
    color: '#111827',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
