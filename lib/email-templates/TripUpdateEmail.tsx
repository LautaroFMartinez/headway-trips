import {
  Heading,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './components/email-layout';

interface TripUpdateEmailProps {
  customerName: string;
  tripTitle: string;
  subject: string;
  messageBody: string;
}

export function TripUpdateEmail({
  customerName,
  tripTitle,
  subject,
  messageBody,
}: TripUpdateEmailProps) {
  const paragraphs = messageBody.split('\n').filter((line) => line.trim());

  return (
    <EmailLayout preview={`${subject} - ${tripTitle}`}>
      <Heading style={styles.heading}>
        {subject}
      </Heading>

      <Text style={styles.paragraph}>
        Hola {customerName},
      </Text>

      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      <Text style={styles.footer}>
        Este mensaje es referente a tu reserva para <strong>{tripTitle}</strong>.
      </Text>

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
  footer: {
    margin: '0 0 20px',
    color: '#71717a',
    fontSize: '14px',
    lineHeight: '1.6',
  },
};

export default TripUpdateEmail;
