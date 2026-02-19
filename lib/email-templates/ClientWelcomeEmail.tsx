import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

interface ClientWelcomeEmailProps {
  name?: string;
}

export function ClientWelcomeEmail({ name }: ClientWelcomeEmailProps) {
  const greeting = name ? `¡Hola ${name}!` : '¡Hola!';

  return (
    <EmailLayout preview="Bienvenido a Headway Trips">
      <Heading style={styles.heading}>
        {greeting}
      </Heading>

      <Text style={styles.paragraph}>
        Bienvenido a Headway Trips. Ya formás parte de nuestros clientes: estamos para ayudarte a planear tu próxima aventura. Podés explorar nuestros destinos o contactarnos cuando lo necesites.
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

export default ClientWelcomeEmail;
