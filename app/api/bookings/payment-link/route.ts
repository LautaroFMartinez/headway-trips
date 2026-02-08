import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createOrder } from '@/lib/revolut';
import { generateBookingToken, getTokenExpiration } from '@/lib/booking-tokens';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`booking:${clientId}`, RATE_LIMITS.quotes);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { trip_id, adults, children, customer_name, customer_email, selected_date } = body;

    // Validate
    if (!trip_id || !adults || !customer_name || !customer_email) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (adults < 1 || adults > 20) {
      return NextResponse.json({ error: 'Número de adultos inválido' }, { status: 400 });
    }

    const childrenCount = children || 0;
    if (childrenCount < 0 || childrenCount > 20) {
      return NextResponse.json({ error: 'Número de niños inválido' }, { status: 400 });
    }

    // Get trip info
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, title, price_value, group_size_max, booking_count, departure_date, available, deposit_percentage, start_dates')
      .eq('id', trip_id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 });
    }

    if (!trip.available) {
      return NextResponse.json({ error: 'Este viaje no está disponible' }, { status: 400 });
    }

    // Validate selected_date if provided
    if (selected_date) {
      const validDates = trip.start_dates || [];
      if (validDates.length > 0 && !validDates.includes(selected_date)) {
        return NextResponse.json({ error: 'Fecha de salida no válida' }, { status: 400 });
      }
    }

    // Check capacity
    const totalPassengers = adults + childrenCount;
    const remaining = (trip.group_size_max || 20) - (trip.booking_count || 0);
    if (totalPassengers > remaining) {
      return NextResponse.json(
        { error: `Solo quedan ${remaining} cupos disponibles` },
        { status: 400 }
      );
    }

    // Calculate deposit
    const depositPct = (trip.deposit_percentage ?? 10) / 100;
    const totalPrice = trip.price_value * totalPassengers;
    const deposit = Math.round(totalPrice * depositPct * 100) / 100;

    // Generate token
    const token = generateBookingToken();
    const tokenExpiresAt = getTokenExpiration();

    // Determine travel_date: selected_date > departure_date > today
    const travelDate = selected_date || trip.departure_date || new Date().toISOString().split('T')[0];

    // Create booking (pending)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        trip_id,
        customer_name,
        customer_email,
        customer_phone: '',
        adults,
        children: childrenCount,
        subtotal: totalPrice,
        total_price: totalPrice,
        currency: 'USD',
        status: 'pending',
        payment_status: 'pending',
        travel_date: travelDate,
        completion_token: token,
        token_expires_at: tokenExpiresAt.toISOString(),
        details_completed: false,
      })
      .select('id')
      .single();

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 });
    }

    // Create Revolut order with redirect back to completion page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';
    const redirectUrl = `${siteUrl}/reserva/completar?token=${token}`;

    const order = await createOrder(
      deposit,
      'USD',
      `Depósito ${trip.deposit_percentage ?? 10}% - ${trip.title} (${totalPassengers} pasajero${totalPassengers > 1 ? 's' : ''})`,
      redirectUrl
    );

    // Create payment record
    await supabase.from('booking_payments').insert({
      booking_id: booking.id,
      amount: deposit,
      currency: 'USD',
      payment_method: 'revolut',
      reference: `Depósito 10%`,
      payment_date: new Date().toISOString().split('T')[0],
      revolut_order_id: order.id,
      revolut_status: 'pending',
    });

    return NextResponse.json({
      checkout_url: order.checkout_url,
      booking_id: booking.id,
      token,
      deposit,
      total_price: totalPrice,
    });
  } catch (error) {
    console.error('Payment link error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
