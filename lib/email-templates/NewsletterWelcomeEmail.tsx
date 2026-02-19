import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface NewsletterWelcomeEmailProps {
  name?: string;
}

export function NewsletterWelcomeEmail({ name }: NewsletterWelcomeEmailProps) {
  const greeting = name ? `¡Hola ${name}!` : '¡Hola!';

  return (
    <EmailLayout preview="Gracias por suscribirte - Headway Trips">
      <Heading style={styles.heading}>
        {greeting}
      </Heading>

      <Text style={styles.paragraph}>
        ¡Gracias por suscribirte a nuestro newsletter! Vas a recibir ofertas exclusivas y novedades sobre nuestros destinos y propuestas grupales antes que nadie.
      </Text>

      <Section style={styles.ctaContainer}>
        <Button
          href={SITE_URL}
          style={styles.ctaButton}
        >
          Ver destinos
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

export default NewsletterWelcomeEmail;
