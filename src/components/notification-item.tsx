import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Notification } from '../lib/data';
import { format } from 'date-fns';
import { useThemeColors } from '../context';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const colors = useThemeColors();
  const themedStyles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Card>
      <CardContent style={themedStyles.content}>
        <View style={themedStyles.header}>
          <View style={themedStyles.body}>
            <View style={themedStyles.titleRow}>
              <Text style={themedStyles.title}>
                {notification.title}
              </Text>
              {!notification.read && (
                <Badge variant="default">New</Badge>
              )}
            </View>
            <Text style={themedStyles.description}>
              {notification.description}
            </Text>
            <Text style={themedStyles.date}>
              {format(new Date(notification.date), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
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
      color: colors.heading,
    },
    description: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 4,
    },
    date: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 8,
    },
  });
