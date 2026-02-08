import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

interface BookingReminderEmailProps {
  customerName: string;
  tripTitle: string;
  completionUrl: string;
}

export function BookingReminderEmail({
  customerName,
  tripTitle,
  completionUrl,
}: BookingReminderEmailProps) {
  return (
    <EmailLayout preview={`Recordatorio: completa tu reserva para ${tripTitle}`}>
      <Heading style={styles.heading}>
        Recordatorio: completa tu reserva
      </Heading>

      <Text style={styles.paragraph}>
        Hola {customerName}, te recordamos que tu reserva para <strong>{tripTitle}</strong> todavia tiene datos pendientes por completar.
      </Text>

      <Text style={styles.paragraph}>
        Para confirmar tu lugar, necesitamos que completes tus datos personales lo antes posible.
      </Text>

      <Section style={styles.ctaContainer}>
        <Button href={completionUrl} style={styles.ctaButton}>
          Completar mi reserva
        </Button>
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
};

export default BookingReminderEmail;
