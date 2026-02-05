import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678';

interface ContactCustomerConfirmationEmailProps {
  name: string;
}

export function ContactCustomerConfirmationEmail({
  name,
}: ContactCustomerConfirmationEmailProps) {
  return (
    <EmailLayout preview="Recibimos tu mensaje - Headway Trips">
      <Heading style={styles.heading}>
        ¡Hola {name}!
      </Heading>

      <Text style={styles.paragraph}>
        Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
      </Text>

      <Text style={styles.paragraph}>
        Nuestro equipo suele responder en un plazo de <strong>24 a 48 horas hábiles</strong>. Si tu consulta es urgente, no dudes en contactarnos por WhatsApp.
      </Text>

      {/* WhatsApp CTA */}
      <Section style={styles.ctaContainer}>
        <Button
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          style={styles.whatsappButton}
        >
          Escribirnos por WhatsApp
        </Button>
      </Section>

      <Hr style={styles.divider} />

      <Text style={styles.exploreText}>
        Mientras tanto, te invitamos a explorar nuestros destinos
      </Text>

      <Section style={styles.ctaContainer}>
        <Button
          href={SITE_URL}
          style={styles.outlineButton}
        >
          Ver Destinos
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
  whatsappButton: {
    backgroundColor: colors.whatsapp,
    color: colors.white,
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
  divider: {
    border: 'none',
    borderTop: `1px solid ${colors.border}`,
    margin: '32px 0',
  },
  exploreText: {
    margin: '0 0 16px',
    color: colors.textMuted,
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    border: `2px solid ${colors.primary}`,
    color: colors.primary,
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
};

export default ContactCustomerConfirmationEmail;
