import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createOrder } from '@/lib/revolut';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Generate a Revolut payment link for a booking
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, customer_name, total_price, currency, trip_id, trips(title)')
      .eq('id', id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Calculate remaining amount
    const { data: payments } = await supabase
      .from('booking_payments')
      .select('amount, revolut_status')
      .eq('booking_id', id);

    const totalPaid = (payments || [])
      .filter((p) => !p.revolut_status || p.revolut_status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const remaining = Math.max(0, Number(booking.total_price) - totalPaid);

    const amount = body.amount ? Number(body.amount) : remaining;
    const currency = body.currency || booking.currency || 'USD';

    if (amount <= 0) {
      return NextResponse.json({ error: 'El monto debe ser mayor a 0' }, { status: 400 });
    }

    const tripTitle = (booking as Record<string, unknown>).trips
      ? ((booking as Record<string, unknown>).trips as { title: string }).title
      : booking.trip_id;

    // Create Revolut order
    const order = await createOrder(
      amount,
      currency,
      `Pago reserva - ${tripTitle} - ${booking.customer_name}`,
    );

    // Insert payment record with revolut data
    const { data: payment, error: insertError } = await supabase
      .from('booking_payments')
      .insert({
        booking_id: id,
        amount,
        currency,
        payment_method: 'revolut',
        revolut_order_id: order.id,
        revolut_status: 'pending',
        reference: order.checkout_url,
        payment_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting revolut payment:', insertError);
      return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 });
    }

    return NextResponse.json({
      checkout_url: order.checkout_url,
      order_id: order.id,
      payment_id: payment.id,
    });
  } catch (error) {
    console.error('Revolut link error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al generar link de pago' },
      { status: 500 },
    );
  }
}
