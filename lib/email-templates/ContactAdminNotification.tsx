import {
  Button,
  Column,
  Heading,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface ContactAdminNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  messageId: string;
}

export function ContactAdminNotificationEmail({
  name,
  email,
  phone,
  message,
  messageId,
}: ContactAdminNotificationEmailProps) {
  return (
    <EmailLayout preview={`Nuevo mensaje de contacto de ${name}`} variant="customer">
      <Text style={styles.intro}>
        Has recibido un nuevo mensaje a través del formulario de contacto de Headway Trips.
      </Text>

      {/* Contact Info Box */}
      <Section style={styles.infoBox}>
        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{name}</Text>
        </Section>
        
        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Link href={`mailto:${email}`} style={styles.infoLink}>{email}</Link>
        </Section>
        
        {phone && (
          <Section style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Link href={`tel:${phone}`} style={styles.infoLink}>{phone}</Link>
          </Section>
        )}
      </Section>

      {/* Message Box */}
      <Section style={styles.messageBox}>
        <Text style={styles.messageLabel}>Mensaje</Text>
        <Text style={styles.messageText}>{message}</Text>
      </Section>

      {/* CTA Button */}
      <Section style={styles.ctaContainer}>
        <Button
          href={`${SITE_URL}/admin/mensajes`}
          style={styles.ctaButton}
        >
          Ver en el Panel de Admin
        </Button>
      </Section>

      {/* Message ID */}
      <Text style={styles.messageIdText}>
        ID del mensaje: {messageId}
      </Text>
    </EmailLayout>
  );
}

const styles = {
  intro: {
    margin: '0 0 20px',
    color: colors.textMuted,
    fontSize: '14px',
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  infoRow: {
    marginBottom: '12px',
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 4px',
  },
  infoValue: {
    color: colors.text,
    fontSize: '16px',
    fontWeight: '500',
    margin: '0',
  },
  infoLink: {
    color: colors.primary,
    fontSize: '16px',
    textDecoration: 'none',
  },
  messageBox: {
    backgroundColor: '#fefce8',
    borderLeft: `4px solid ${colors.warning}`,
    padding: '16px 20px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '24px',
  },
  messageLabel: {
    color: colors.textMuted,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 8px',
  },
  messageText: {
    color: colors.text,
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
  },
  ctaContainer: {
    textAlign: 'center' as const,
    marginBottom: '16px',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
  messageIdText: {
    color: colors.textMuted,
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: '0',
  },
};

export default ContactAdminNotificationEmail;
