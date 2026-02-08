import {
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

interface BookingConfirmationEmailProps {
  customerName: string;
  tripTitle: string;
  departureDate?: string;
  totalPrice: number;
  currency: string;
  passengers: number;
}

export function BookingConfirmationEmail({
  customerName,
  tripTitle,
  departureDate,
  totalPrice,
  currency,
  passengers,
}: BookingConfirmationEmailProps) {
  const formattedDate = departureDate
    ? new Date(departureDate + 'T00:00:00').toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <EmailLayout preview={`Reserva confirmada - ${tripTitle}`}>
      <Heading style={styles.heading}>
        ¡Reserva confirmada, {customerName}!
      </Heading>

      <Text style={styles.paragraph}>
        Tu reserva para <strong>{tripTitle}</strong> ha sido confirmada exitosamente. A continuación los detalles:
      </Text>

      <Section style={styles.detailsBox}>
        <Text style={styles.detailLabel}>Viaje</Text>
        <Text style={styles.detailValue}>{tripTitle}</Text>

        {formattedDate && (
          <>
            <Text style={styles.detailLabel}>Fecha de salida</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </>
        )}

        <Text style={styles.detailLabel}>Pasajeros</Text>
        <Text style={styles.detailValue}>{passengers}</Text>

        <Text style={styles.detailLabel}>Precio total</Text>
        <Text style={styles.detailValue}>
          {currency} ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      </Section>

      <Section style={styles.stepsBox}>
        <Heading as="h3" style={styles.stepsTitle}>Próximos pasos</Heading>
        <Text style={styles.stepText}>
          Nuestro equipo se pondrá en contacto contigo para coordinar los detalles finales del viaje. Si necesitas agregar más pasajeros o tienes preguntas, no dudes en escribirnos.
        </Text>
      </Section>

      <Text style={styles.thankYou}>
        ¡Gracias por elegir Headway Trips!
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
  detailsBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  },
  detailLabel: {
    color: '#15803d',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: '600',
    margin: '12px 0 0',
  },
  detailValue: {
    margin: '4px 0 0',
    color: colors.text,
    fontSize: '16px',
    fontWeight: '500',
  },
  stepsBox: {
    backgroundColor: colors.background,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  stepsTitle: {
    margin: '0 0 12px',
    color: colors.text,
    fontSize: '16px',
    fontWeight: '600',
  },
  stepText: {
    margin: '0',
    color: '#3f3f46',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  thankYou: {
    margin: '0',
    color: colors.primary,
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center' as const,
  },
};

export default BookingConfirmationEmail;
