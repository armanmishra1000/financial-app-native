import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../src/context';

const lastUpdated = '2025-12-08';

export default function PrivacyPolicyScreen() {
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Last updated: {lastUpdated}</Text>
        <Text style={styles.bodyText}>
          Financial App provides tools to view balances, projections, and manage payment methods. This policy explains how we handle your information.
        </Text>
      </View>

      <Section title="Information we collect" styles={styles}>
        <Bullet text="Account data: name, email, display currency, profile preferences." styles={styles} />
        <Bullet text="Financial/payment data: tokenized payment method details and billing metadata from our processors. We do not store full card numbers." styles={styles} />
        <Bullet text="Usage and device data: app interactions, device model, OS, language, crash/diagnostics, IP-derived region." styles={styles} />
        <Bullet text="Support data: information you share in tickets or chat." styles={styles} />
      </Section>

      <Section title="How we use information" styles={styles}>
        <Bullet text="Provide and improve the app experience." styles={styles} />
        <Bullet text="Process payments and personalize currency and notifications." styles={styles} />
        <Bullet text="Prevent fraud and maintain security." styles={styles} />
        <Bullet text="Support you and meet legal or regulatory duties." styles={styles} />
      </Section>

      <Section title="Legal bases (where applicable)" styles={styles}>
        <Bullet text="Performance of a contract to deliver the service." styles={styles} />
        <Bullet text="Legitimate interests such as security and improvement." styles={styles} />
        <Bullet text="Consent, for marketing where required." styles={styles} />
        <Bullet text="Legal obligations such as tax or KYC/AML where applicable." styles={styles} />
      </Section>

      <Section title="Sharing" styles={styles}>
        <Bullet text="Service providers for hosting, analytics, and payment processing under contractual safeguards." styles={styles} />
        <Bullet text="Compliance and fraud prevention partners when required." styles={styles} />
        <Bullet text="Legal requests when compelled by law." styles={styles} />
        <Bullet text="We do not sell personal data." styles={styles} />
      </Section>

      <Section title="Data retention" styles={styles}>
        <Bullet text="Account and profile data: kept while your account is active." styles={styles} />
        <Bullet text="Transaction and payment records: retained up to 7 years for compliance and accounting." styles={styles} />
        <Bullet text="Support logs: typically 2 years." styles={styles} />
        <Bullet text="We delete or anonymize data when no longer needed or when you request deletion, subject to legal holds." styles={styles} />
      </Section>

      <Section title="Security" styles={styles}>
        <Text style={styles.bodyText}>
          We use encryption in transit and at rest, access controls, and monitoring. No method is 100% secure; contact us if you suspect unauthorized access.
        </Text>
      </Section>

      <Section title="Your rights" styles={styles}>
        <Bullet text="Access, correct, delete, restrict, opt-out of marketing, and request a copy of your data where applicable." styles={styles} />
        <Bullet text="Request via support@example.com. We may need to verify your identity." styles={styles} />
      </Section>

      <Section title="Children" styles={styles}>
        <Text style={styles.bodyText}>Not intended for under 18. We do not knowingly collect data from children.</Text>
      </Section>

      <Section title="International transfers" styles={styles}>
        <Text style={styles.bodyText}>
          We may transfer data to other countries with safeguards such as Standard Contractual Clauses.
        </Text>
      </Section>

      <Section title="Changes" styles={styles}>
        <Text style={styles.bodyText}>
          We will update this policy as needed and post the new date. Material changes will include a notice in-app.
        </Text>
      </Section>

      <Section title="Contact" styles={styles}>
        <Text style={styles.bodyText}>
          support@example.com (privacy) or Attn: Privacy, Financial App, [Company Address].
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
