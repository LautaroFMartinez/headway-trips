import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface BookingCompletionEmailProps {
  customerName: string;
  tripTitle: string;
  completionUrl: string;
  expiresAt: string;
}

export function BookingCompletionEmail({
  customerName,
  tripTitle,
  completionUrl,
  expiresAt,
}: BookingCompletionEmailProps) {
  const expiresDate = new Date(expiresAt);
  const formattedExpiry = expiresDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <EmailLayout preview={`Completa tu reserva para ${tripTitle}`}>
      <Heading style={styles.heading}>
        ¡Pago recibido, {customerName}!
      </Heading>

      <Text style={styles.paragraph}>
        Hemos recibido tu depósito para <strong>{tripTitle}</strong>. Solo falta un paso: completar tus datos personales para confirmar tu reserva.
      </Text>

      <Section style={styles.ctaContainer}>
        <Button href={completionUrl} style={styles.ctaButton}>
          Completar mi reserva
        </Button>
      </Section>

      <Section style={styles.warningBox}>
        <Text style={styles.warningText}>
          Este enlace expira el <strong>{formattedExpiry}</strong>. Por favor, completa tus datos antes de esa fecha.
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        Si tienes alguna pregunta, no dudes en contactarnos.
      </Text>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    margin: '0 0 16px',
    color: colors.text,
    fontSize: '22px',
    fontWeight: '600',
  },
  paragraph: {
    margin: '0 0 20px',
    color: '#3f3f46',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
  },
  warningBox: {
    backgroundColor: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  warningText: {
    margin: '0',
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};

export default BookingCompletionEmail;
