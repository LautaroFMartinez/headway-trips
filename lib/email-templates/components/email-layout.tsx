import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

// Brand colors
export const colors = {
  primary: '#0f766e',
  primaryLight: '#14b8a6',
  secondary: '#7c3aed',
  text: '#18181b',
  textMuted: '#71717a',
  textLight: '#a1a1aa',
  border: '#e4e4e7',
  background: '#f4f4f5',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#eab308',
  whatsapp: '#25D366',
};

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  variant?: 'customer' | 'admin';
}

/**
 * Base layout component for all email templates.
 * Provides consistent header, footer, and styling.
 */
export function EmailLayout({ preview, children, variant = 'customer' }: EmailLayoutProps) {
  const headerGradient = variant === 'admin'
    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
    : 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)';

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={{ ...styles.header, background: headerGradient }}>
            <Img
              src={`${SITE_URL}/icono.png`}
              width="40"
              height="40"
              alt="Headway Trips"
              style={styles.logo}
            />
            <Text style={styles.headerTitle}>Headway Trips</Text>
            <Text style={styles.headerSubtitle}>Tu próxima aventura comienza aquí</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>Headway Trips</Text>
            <Text style={styles.footerTagline}>Viajes personalizados a medida</Text>
            <Text style={styles.footerNote}>
              Este email fue enviado automáticamente por Headway Trips
            </Text>
            <Link href={SITE_URL} style={styles.footerLink}>
              www.headwaytrips.com
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: colors.background,
  },
  container: {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
  },
  header: {
    padding: '40px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
  },
  logo: {
    margin: '0 auto 12px',
  },
  headerTitle: {
    margin: '0',
    color: colors.white,
    fontSize: '28px',
    fontWeight: '600',
  },
  headerSubtitle: {
    margin: '8px 0 0',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
  },
  content: {
    backgroundColor: colors.white,
    padding: '40px',
  },
  footer: {
    backgroundColor: '#18181b',
    padding: '32px 40px',
    textAlign: 'center' as const,
    borderRadius: '0 0 12px 12px',
  },
  footerBrand: {
    margin: '0 0 8px',
    color: colors.white,
    fontSize: '16px',
    fontWeight: '500',
  },
  footerTagline: {
    margin: '0 0 16px',
    color: colors.textLight,
    fontSize: '13px',
  },
  footerNote: {
    margin: '0 0 8px',
    color: colors.textMuted,
    fontSize: '11px',
  },
  footerLink: {
    color: colors.primaryLight,
    fontSize: '12px',
    textDecoration: 'none',
  },
};
