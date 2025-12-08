import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../src/context';

const lastUpdated = '2025-12-08';

export default function TermsOfServiceScreen() {
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>Last updated: {lastUpdated}</Text>
        <Text style={styles.bodyText}>
          By creating an account or using the app, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the service.
        </Text>
      </View>

      <Section title="Who can use the service" styles={styles}>
        <Bullet text="You must be at least 18." styles={styles} />
        <Bullet text="Use the app for lawful purposes and keep your login secure." styles={styles} />
      </Section>

      <Section title="What we provide" styles={styles}>
        <Text style={styles.bodyText}>
          Tools to view balances, projections, and manage payment methods. Projections are estimates only.
        </Text>
      </Section>

      <Section title="Accounts & security" styles={styles}>
        <Bullet text="Keep credentials confidential; you are responsible for activity under your account." styles={styles} />
        <Bullet text="Tell us immediately about unauthorized use." styles={styles} />
      </Section>

      <Section title="Payments & fees" styles={styles}>
        <Bullet text="Payment methods are processed by third-party providers; you authorize us to share necessary details with them." styles={styles} />
        <Bullet text="Any fees will be shown before you confirm a transaction. Taxes are your responsibility." styles={styles} />
      </Section>

      <Section title="Acceptable use" styles={styles}>
        <Bullet text="Do not engage in fraud, interfere with the service, scrape, reverse engineer, or violate laws." styles={styles} />
      </Section>

      <Section title="Intellectual property" styles={styles}>
        <Text style={styles.bodyText}>
          The app and its content belong to Financial App or its licensors. You get a personal, non-transferable, revocable license to use the app.
        </Text>
      </Section>

      <Section title="Third-party services" styles={styles}>
        <Text style={styles.bodyText}>
          Third-party links and processors are provided as-is. Their terms and privacy policies apply.
        </Text>
      </Section>

      <Section title="Disclaimers" styles={styles}>
        <Bullet text="The app is provided “as is.”" styles={styles} />
        <Bullet text="We do not guarantee accuracy, uptime, or that projections will match outcomes." styles={styles} />
        <Bullet text="Nothing here is financial, investment, tax, or legal advice." styles={styles} />
      </Section>

      <Section title="Limitation of liability" styles={styles}>
        <Text style={styles.bodyText}>
          To the fullest extent allowed by law, we are not liable for indirect or consequential damages. Our total liability for claims related to the service will not exceed the greater of the amount you paid us in the last 3 months or USD $50. Some jurisdictions do not allow all limitations; those limits apply only where permitted.
        </Text>
      </Section>

      <Section title="Indemnity" styles={styles}>
        <Text style={styles.bodyText}>
          You agree to indemnify us for losses arising from your violation of these Terms or misuse of the service.
        </Text>
      </Section>

      <Section title="Termination" styles={styles}>
        <Bullet text="You may stop using the app anytime." styles={styles} />
        <Bullet text="We may suspend or terminate for misuse or legal risk." styles={styles} />
        <Bullet text="Upon termination, your right to use the app ends; some clauses survive (IP, disclaimers, liability limits)." styles={styles} />
      </Section>

      <Section title="Changes" styles={styles}>
        <Text style={styles.bodyText}>
          We may update these Terms. We will post the new date and, for material changes, give in-app notice. Continued use means acceptance.
        </Text>
      </Section>

      <Section title="Governing law & disputes" styles={styles}>
        <Text style={styles.bodyText}>
          Governed by the laws of [Insert governing jurisdiction]. Disputes will be resolved in the courts of that jurisdiction, unless prohibited by applicable law.
        </Text>
      </Section>

      <Section title="Contact" styles={styles}>
        <Text style={styles.bodyText}>
          support@example.com or Attn: Legal, Financial App, [Company Address].
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
