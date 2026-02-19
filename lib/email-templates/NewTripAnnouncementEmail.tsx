import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface NewTripAnnouncementEmailProps {
  tripTitle: string;
  tripId: string;
  subtitle?: string;
}

export function NewTripAnnouncementEmail({
  tripTitle,
  tripId,
  subtitle,
}: NewTripAnnouncementEmailProps) {
  const tripUrl = `${SITE_URL}/viaje/${tripId}`;

  return (
    <EmailLayout preview={`Nuevo viaje: ${tripTitle}`}>
      <Heading style={styles.heading}>
        Sumamos un nuevo destino
      </Heading>

      <Text style={styles.paragraph}>
        Te contamos que ya está disponible un nuevo viaje en Headway Trips.
      </Text>

      <Section style={styles.tripBox}>
        <Heading as="h3" style={styles.tripTitle}>{tripTitle}</Heading>
        {subtitle ? (
          <Text style={styles.tripSubtitle}>{subtitle}</Text>
        ) : null}
      </Section>

      <Section style={styles.ctaContainer}>
        <Button
          href={tripUrl}
          style={styles.ctaButton}
        >
          Ver este viaje
        </Button>
      </Section>
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
  tripBox: {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: colors.background,
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
  },
  tripTitle: {
    margin: '0 0 8px',
    color: colors.text,
    fontSize: '18px',
    fontWeight: '600',
  },
  tripSubtitle: {
    margin: '0',
    color: colors.textMuted,
    fontSize: '14px',
    lineHeight: '1.5',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    marginBottom: '32px',
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
};

export default NewTripAnnouncementEmail;
