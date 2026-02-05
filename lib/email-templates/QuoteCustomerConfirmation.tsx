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

interface QuoteCustomerConfirmationEmailProps {
  customerName: string;
  tripTitle: string;
}

export function QuoteCustomerConfirmationEmail({
  customerName,
  tripTitle,
}: QuoteCustomerConfirmationEmailProps) {
  return (
    <EmailLayout preview={`Recibimos tu solicitud para ${tripTitle}`}>
      <Heading style={styles.heading}>
        ¡Hola {customerName}!
      </Heading>

      <Text style={styles.paragraph}>
        Gracias por tu interés en viajar con nosotros. Hemos recibido tu solicitud de cotización y estamos preparando una propuesta personalizada para ti.
      </Text>

      {/* Trip Box */}
      <Section style={styles.tripBox}>
        <Text style={styles.tripLabel}>Destino solicitado</Text>
        <Heading as="h3" style={styles.tripTitle}>{tripTitle}</Heading>
      </Section>

      <Text style={styles.paragraph}>
        Nuestro equipo de expertos en viajes está trabajando en tu cotización. Te contactaremos en un plazo de <strong>24 a 48 horas hábiles</strong> con todos los detalles.
      </Text>

      {/* What's Next */}
      <Section style={styles.stepsBox}>
        <Heading as="h3" style={styles.stepsTitle}>¿Qué sigue?</Heading>
        
        <Section style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Revisamos tu solicitud y preparamos una propuesta a medida</Text>
        </Section>
        
        <Section style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Te enviamos el itinerario detallado con precios y opciones</Text>
        </Section>
        
        <Section style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Ajustamos los detalles según tus preferencias</Text>
        </Section>
      </Section>

      <Text style={styles.questionText}>
        ¿Tienes alguna pregunta mientras tanto? No dudes en contactarnos.
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
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  },
  tripLabel: {
    color: '#15803d',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: '600',
    margin: '0',
  },
  tripTitle: {
    margin: '8px 0 0',
    color: colors.text,
    fontSize: '18px',
    fontWeight: '600',
  },
  stepsBox: {
    backgroundColor: colors.background,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  stepsTitle: {
    margin: '0 0 16px',
    color: colors.text,
    fontSize: '16px',
    fontWeight: '600',
  },
  step: {
    marginBottom: '12px',
  },
  stepNumber: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: '50%',
    textAlign: 'center' as const,
    lineHeight: '24px',
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '12px',
  },
  stepText: {
    display: 'inline',
    color: '#3f3f46',
    fontSize: '14px',
    margin: '0',
  },
  questionText: {
    margin: '0 0 24px',
    color: colors.textMuted,
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  ctaContainer: {
    textAlign: 'center' as const,
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
};

export default QuoteCustomerConfirmationEmail;
