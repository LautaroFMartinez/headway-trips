import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/revolut';
import { render } from '@react-email/components';
import { BookingCompletionEmail } from '@/lib/email-templates/BookingCompletionEmail';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST - Revolut webhook handler
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('Revolut-Signature');
    const timestamp = request.headers.get('Revolut-Request-Timestamp');
    const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (webhookSecret && signature && timestamp) {
      const isValid = verifyWebhookSignature(rawBody, signature, timestamp, webhookSecret);
      if (!isValid) {
        console.error('Invalid Revolut webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const orderId = event.order_id;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Find the payment by revolut_order_id
    const { data: payment, error: findError } = await supabase
      .from('booking_payments')
      .select('id, booking_id, amount')
      .eq('revolut_order_id', orderId)
      .single();

    if (findError || !payment) {
      console.error('Payment not found for Revolut order:', orderId);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const eventType = event.event;

    if (eventType === 'ORDER_COMPLETED') {
      // Mark payment as completed
      await supabase
        .from('booking_payments')
        .update({ revolut_status: 'completed' })
        .eq('id', payment.id);

      // Recalculate booking payment_status
      await recalculatePaymentStatus(payment.booking_id);

      // Send completion email if details not yet completed
      await sendCompletionEmailIfNeeded(payment.booking_id);
    } else if (eventType === 'ORDER_CANCELLED' || eventType === 'ORDER_PAYMENT_FAILED' || eventType === 'ORDER_PAYMENT_DECLINED') {
      // Mark payment as cancelled/failed, set amount to 0
      await supabase
        .from('booking_payments')
        .update({
          revolut_status: eventType === 'ORDER_CANCELLED' ? 'cancelled' : 'failed',
          amount: 0,
        })
        .eq('id', payment.id);

      await recalculatePaymentStatus(payment.booking_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Revolut webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

async function recalculatePaymentStatus(bookingId: string) {
  const { data: booking } = await supabase
    .from('bookings')
    .select('total_price')
    .eq('id', bookingId)
    .single();

  if (!booking) return;

  const { data: payments } = await supabase
    .from('booking_payments')
    .select('amount, revolut_status')
    .eq('booking_id', bookingId);

  // Only count non-revolut payments and completed revolut payments
  const totalPaid = (payments || [])
    .filter((p) => !p.revolut_status || p.revolut_status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  let paymentStatus: string;
  if (totalPaid >= Number(booking.total_price)) {
    paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    paymentStatus = 'partial';
  } else {
    paymentStatus = 'pending';
  }

  await supabase
    .from('bookings')
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}

async function sendCompletionEmailIfNeeded(bookingId: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('customer_name, customer_email, trip_id, completion_token, token_expires_at, details_completed')
      .eq('id', bookingId)
      .single();

    if (!booking || booking.details_completed || !booking.completion_token) return;

    const { data: trip } = await supabase
      .from('trips')
      .select('title')
      .eq('id', booking.trip_id)
      .single();

    if (!trip) return;

    const completionUrl = `${SITE_URL}/reserva/completar?token=${booking.completion_token}`;

    const emailHtml = await render(
      BookingCompletionEmail({
        customerName: booking.customer_name,
        tripTitle: trip.title,
        completionUrl,
        expiresAt: booking.token_expires_at,
      })
    );

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Headway Trips <no-reply@headwaytrips.com>',
        to: booking.customer_email,
        subject: `Completa tu reserva - ${trip.title}`,
        html: emailHtml,
      }),
    });
  } catch (error) {
    console.error('Error sending completion email:', error);
  }
}
