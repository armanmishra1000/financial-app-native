import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../src/context';

const quickAnswers = [
  'How to update your profile: Profile → Edit Profile → change name/email → Save.',
  'Change display currency: Profile → Account Settings → Display Currency → pick a currency.',
  'Manage payment methods: Profile → Payment Methods → add, update, or remove a card or account.',
  'Notification controls: Profile → Notifications → toggle the alerts you want.',
];

const paymentsAndTransfers = [
  'Adding a card or bank: stored via our PCI-compliant processor; we do not keep full card numbers.',
  'Transfer timing: most transfers post instantly; some can take 1–3 business days depending on your bank.',
  'Failed payments: confirm funds and card validity, then retry. If it repeats, contact support with the last 4 digits and time of attempt.',
];

export default function HelpCenterScreen() {
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>
          Get quick answers and learn how to get the most from Financial App. If you need a person, reach us at support@example.com.
        </Text>
      </View>

      <Section title="Quick answers" styles={styles}>
        {quickAnswers.map((item) => (
          <Bullet key={item} text={item} styles={styles} />
        ))}
      </Section>

      <Section title="Getting started" styles={styles}>
        <Text style={styles.bodyText}>
          Create an account, verify your email or phone if prompted, and secure your device with a passcode or biometric lock.
        </Text>
      </Section>

      <Section title="Payments & transfers" styles={styles}>
        {paymentsAndTransfers.map((item) => (
          <Bullet key={item} text={item} styles={styles} />
        ))}
      </Section>

      <Section title="Security & privacy" styles={styles}>
        <Text style={styles.bodyText}>
          We use encryption in transit and at rest. Never share one-time codes. Enable a device lock and keep your operating system up to date.
        </Text>
      </Section>

      <Section title="Disputes & complaints" styles={styles}>
        <Text style={styles.bodyText}>
          Email support@example.com with subject “Complaint” and include your name, device, and a short description. We acknowledge within 1 business day and aim to resolve within 10 business days.
        </Text>
      </Section>

      <Section title="Accessibility" styles={styles}>
        <Text style={styles.bodyText}>
          If you need alternative formats or assistance, email support@example.com with your preferred format.
        </Text>
      </Section>

      <Section title="Still need help?" styles={styles}>
        <Text style={styles.bodyText}>
          Email support@example.com or use in-app chat (if available). Hours: Mon–Fri, 9am–6pm local time. Typical first response: under 1 business day.
        </Text>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Bullet({ text, styles }: { text: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
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
      gap: 24,
    },
    header: {
      gap: 8,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.heading,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textMuted,
      lineHeight: 22,
    },
    section: {
      gap: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.heading,
    },
    sectionBody: {
      gap: 8,
    },
    bodyText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
      flex: 1,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    bullet: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
    },
  });
