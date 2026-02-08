import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOrder } from '@/lib/revolut';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const orderId = searchParams.get('order_id');

    if (!token && !orderId) {
      return NextResponse.json({ error: 'Token o order_id requerido' }, { status: 400 });
    }

    // Find booking by token or by revolut order_id
    let booking;

    if (token) {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, trip_id, customer_name, customer_email, adults, children, total_price, currency, status, payment_status, completion_token, token_expires_at, details_completed')
        .eq('completion_token', token)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
      }
      booking = data;
    } else {
      // Find by revolut order_id through booking_payments
      const { data: payment } = await supabase
        .from('booking_payments')
        .select('booking_id')
        .eq('revolut_order_id', orderId)
        .single();

      if (!payment) {
        return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('id, trip_id, customer_name, customer_email, adults, children, total_price, currency, status, payment_status, completion_token, token_expires_at, details_completed')
        .eq('id', payment.booking_id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
      }
      booking = data;
    }

    // Check token expiration
    const isExpired = booking.token_expires_at && new Date(booking.token_expires_at) < new Date();

    // Get trip info
    const { data: trip } = await supabase
      .from('trips')
      .select('title, price, price_value, departure_date, duration')
      .eq('id', booking.trip_id)
      .single();

    // Check Revolut payment status if needed
    let paymentCompleted = booking.payment_status !== 'pending';
    if (!paymentCompleted && orderId) {
      try {
        const revolutOrder = await getOrder(orderId);
        if (revolutOrder.state === 'COMPLETED') {
          paymentCompleted = true;
          // Update payment status
          await supabase
            .from('booking_payments')
            .update({ revolut_status: 'completed' })
            .eq('revolut_order_id', orderId);
          await supabase
            .from('bookings')
            .update({ payment_status: 'partial' })
            .eq('id', booking.id);
        }
      } catch {
        // Revolut check failed, proceed with DB status
      }
    }

    return NextResponse.json({
      booking_id: booking.id,
      token: booking.completion_token,
      customer_email: booking.customer_email,
      customer_name: booking.customer_name,
      adults: booking.adults,
      children: booking.children,
      total_price: booking.total_price,
      currency: booking.currency,
      details_completed: booking.details_completed,
      is_expired: isExpired,
      token_expires_at: booking.token_expires_at,
      payment_completed: paymentCompleted,
      trip: trip ? {
        title: trip.title,
        price: trip.price,
        price_value: trip.price_value,
        departure_date: trip.departure_date,
        duration: trip.duration,
      } : null,
    });
  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
