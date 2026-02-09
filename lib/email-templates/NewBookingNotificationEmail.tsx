import {
  Button,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface NewBookingNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  tripTitle: string;
  tripId: string;
  passengers: number;
  totalPrice: number;
  currency: string;
  travelDate?: string;
  bookingId: string;
  withPayment: boolean;
}

export function NewBookingNotificationEmail({
  customerName,
  customerEmail,
  tripTitle,
  tripId,
  passengers,
  totalPrice,
  currency,
  travelDate,
  bookingId,
  withPayment,
}: NewBookingNotificationEmailProps) {
  const formattedDate = travelDate
    ? new Date(travelDate + 'T12:00:00').toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'No definida';

  return (
    <EmailLayout preview={`Nueva reserva - ${tripTitle} - ${customerName}`} variant="customer">
      <Text style={styles.intro}>
        Se ha generado una nueva reserva {withPayment ? 'con pago online' : 'sin pago previo'}.
      </Text>

      <Section style={styles.infoBox}>
        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cliente</Text>
          <Text style={styles.infoValue}>{customerName}</Text>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Link href={`mailto:${customerEmail}`} style={styles.infoLink}>{customerEmail}</Link>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Viaje</Text>
          <Text style={styles.infoValue}>{tripTitle}</Text>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha de salida</Text>
          <Text style={styles.infoValue}>{formattedDate}</Text>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pasajeros</Text>
          <Text style={styles.infoValue}>{passengers}</Text>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Precio total</Text>
          <Text style={styles.infoValue}>{currency} ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </Section>

        <Section style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de reserva</Text>
          <Text style={styles.infoValue}>{withPayment ? 'Con depósito Revolut' : 'Sin pago previo'}</Text>
        </Section>
      </Section>

      <Section style={styles.ctaContainer}>
        <Button
          href={`${SITE_URL}/admin/reservas`}
          style={styles.ctaButton}
        >
          Ver en el Panel de Admin
        </Button>
      </Section>

      <Text style={styles.bookingIdText}>
        ID de reserva: {bookingId}
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
  bookingIdText: {
    color: colors.textMuted,
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: '0',
  },
};

export default NewBookingNotificationEmail;
