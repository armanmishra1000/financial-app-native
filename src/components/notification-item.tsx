import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Notification } from '../lib/data';
import { format } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <Card>
      <CardContent style={styles.content}>
        <View style={styles.header}>
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {notification.title}
              </Text>
              {!notification.read && (
                <Badge variant="default">New</Badge>
              )}
            </View>
            <Text style={styles.description}>
              {notification.description}
            </Text>
            <Text style={styles.date}>
              {format(new Date(notification.date), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '500',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
});
