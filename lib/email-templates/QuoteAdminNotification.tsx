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

interface QuoteAdminNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  tripTitle: string;
  tripId: string;
  travelDate?: string;
  adults: number;
  children: number;
  message?: string;
  quoteId: string;
}

export function QuoteAdminNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  customerCountry,
  tripTitle,
  tripId,
  travelDate,
  adults,
  children,
  message,
  quoteId,
}: QuoteAdminNotificationEmailProps) {
  const totalTravelers = adults + children;

  return (
    <EmailLayout preview={`Nueva cotización: ${tripTitle} - ${customerName}`} variant="admin">
      {/* Trip Banner */}
      <Section style={styles.tripBanner}>
        <Text style={styles.tripLabel}>Destino solicitado</Text>
        <Heading as="h2" style={styles.tripTitle}>{tripTitle}</Heading>
        <Link href={`${SITE_URL}/viaje/${tripId}`} style={styles.tripLink}>
          Ver viaje →
        </Link>
      </Section>

      {/* Customer Info Box */}
      <Section style={styles.infoBox}>
        <Heading as="h3" style={styles.infoBoxTitle}>Datos del Cliente</Heading>
        <Row>
          <Column style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </Column>
          <Column style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Email</Text>
            <Link href={`mailto:${customerEmail}`} style={styles.infoLink}>{customerEmail}</Link>
          </Column>
        </Row>
        {(customerPhone || customerCountry) && (
          <Row style={{ marginTop: '12px' }}>
            {customerPhone && (
              <Column style={styles.infoColumn}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Link href={`tel:${customerPhone}`} style={styles.infoLink}>{customerPhone}</Link>
              </Column>
            )}
            {customerCountry && (
              <Column style={styles.infoColumn}>
                <Text style={styles.infoLabel}>País</Text>
                <Text style={styles.infoValue}>{customerCountry}</Text>
              </Column>
            )}
          </Row>
        )}
      </Section>

      {/* Travel Details */}
      <Row style={styles.statsRow}>
        <Column style={styles.statBox}>
          <Text style={styles.statLabel}>Viajeros</Text>
          <Text style={styles.statValue}>
            {totalTravelers} {totalTravelers === 1 ? 'persona' : 'personas'}
          </Text>
          <Text style={styles.statDetail}>
            {adults} {adults === 1 ? 'adulto' : 'adultos'}
            {children > 0 && `, ${children} ${children === 1 ? 'niño' : 'niños'}`}
          </Text>
        </Column>
        <Column style={styles.statBoxWarning}>
          <Text style={styles.statLabelWarning}>Fecha de viaje</Text>
          <Text style={styles.statValueWarning}>
            {travelDate || 'Flexible'}
          </Text>
        </Column>
      </Row>

      {/* Message Box */}
      {message && (
        <Section style={styles.messageBox}>
          <Text style={styles.messageLabel}>Mensaje del cliente</Text>
          <Text style={styles.messageText}>{message}</Text>
        </Section>
      )}

      {/* CTA Button */}
      <Section style={styles.ctaContainer}>
        <Button
          href={`${SITE_URL}/admin/cotizaciones`}
          style={styles.ctaButton}
        >
          Ver en el Panel de Admin
        </Button>
      </Section>

      {/* Quote ID */}
      <Text style={styles.quoteId}>
        ID de cotización: {quoteId}
      </Text>
    </EmailLayout>
  );
}

const styles = {
  tripBanner: {
    backgroundColor: '#faf5ff',
    borderBottom: '1px solid #e9d5ff',
    padding: '24px',
    marginBottom: '24px',
    borderRadius: '8px',
  },
  tripLabel: {
    color: colors.secondary,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: '600',
    margin: '0',
  },
  tripTitle: {
    margin: '4px 0 8px',
    color: colors.text,
    fontSize: '20px',
    fontWeight: '600',
  },
  tripLink: {
    color: colors.secondary,
    fontSize: '13px',
    textDecoration: 'none',
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  infoBoxTitle: {
    margin: '0 0 16px',
    color: colors.text,
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  infoColumn: {
    width: '50%',
    paddingBottom: '12px',
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: '12px',
    margin: '0 0 4px',
  },
  infoValue: {
    color: colors.text,
    fontSize: '15px',
    fontWeight: '500',
    margin: '0',
  },
  infoLink: {
    color: colors.secondary,
    fontSize: '15px',
    textDecoration: 'none',
  },
  statsRow: {
    marginBottom: '24px',
  },
  statBox: {
    backgroundColor: '#eff6ff',
    padding: '16px 20px',
    borderRadius: '8px',
    width: '48%',
  },
  statBoxWarning: {
    backgroundColor: '#fef3c7',
    padding: '16px 20px',
    borderRadius: '8px',
    width: '48%',
  },
  statLabel: {
    color: '#1e40af',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 4px',
  },
  statLabelWarning: {
    color: '#d97706',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 4px',
  },
  statValue: {
    color: colors.text,
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
  },
  statValueWarning: {
    color: colors.text,
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
  },
  statDetail: {
    color: colors.textMuted,
    fontSize: '13px',
    margin: '4px 0 0',
  },
  messageBox: {
    backgroundColor: '#f0f9ff',
    borderLeft: '4px solid #0ea5e9',
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
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
  quoteId: {
    color: colors.textMuted,
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: '0',
  },
};

export default QuoteAdminNotificationEmail;
