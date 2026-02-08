import { createClient } from '@supabase/supabase-js';
import { generateBookingToken, getTokenExpiration } from './booking-tokens';
import { resend, FROM_EMAIL } from './resend';
import { bookingReminderHtml, bookingReminderText } from './email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';
const REMINDER_INTERVAL_HOURS = 72;

interface ReminderResult {
  sent: number;
  errors: number;
  details: { bookingId: string; email: string; status: 'sent' | 'error'; error?: string }[];
}

export async function processBookingReminders(): Promise<ReminderResult> {
  const result: ReminderResult = { sent: 0, errors: 0, details: [] };

  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - REMINDER_INTERVAL_HOURS);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, customer_name, customer_email, trip_id, completion_token, token_expires_at, trips(title)')
    .eq('details_completed', false)
    .neq('status', 'cancelled')
    .or(`reminder_sent_at.is.null,reminder_sent_at.lt.${cutoff.toISOString()}`);

  if (error) {
    throw new Error(`Error querying bookings: ${error.message}`);
  }

  if (!bookings || bookings.length === 0) {
    return result;
  }

  for (const booking of bookings) {
    try {
      let token = booking.completion_token;
      const now = new Date();
      const tokenExpired = !booking.token_expires_at || new Date(booking.token_expires_at) < now;

      if (!token || tokenExpired) {
        token = generateBookingToken();
        const expiresAt = getTokenExpiration();

        const { error: updateError } = await supabase
          .from('bookings')
          .update({ completion_token: token, token_expires_at: expiresAt.toISOString() })
          .eq('id', booking.id);

        if (updateError) {
          throw new Error(`Error updating token: ${updateError.message}`);
        }
      }

      const completionUrl = `${SITE_URL}/reserva/completar?token=${token}`;
      const tripsData = booking.trips as { title: string }[] | { title: string } | null;
      const tripTitle = (Array.isArray(tripsData) ? tripsData[0]?.title : tripsData?.title) || booking.trip_id;

      if (!resend) {
        throw new Error('Resend not configured');
      }

      const [html, text] = await Promise.all([
        bookingReminderHtml({
          customerName: booking.customer_name,
          tripTitle,
          completionUrl,
        }),
        bookingReminderText({
          customerName: booking.customer_name,
          tripTitle,
          completionUrl,
        }),
      ]);

      const { error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: `Recordatorio: completa tu reserva para ${tripTitle}`,
        html,
        text,
      });

      if (sendError) {
        throw new Error(sendError.message);
      }

      await supabase
        .from('bookings')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', booking.id);

      result.sent++;
      result.details.push({ bookingId: booking.id, email: booking.customer_email, status: 'sent' });
    } catch (err) {
      result.errors++;
      result.details.push({
        bookingId: booking.id,
        email: booking.customer_email,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return result;
}
