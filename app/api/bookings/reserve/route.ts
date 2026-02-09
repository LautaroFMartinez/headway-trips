import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateBookingToken, getTokenExpiration } from '@/lib/booking-tokens';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { render } from '@react-email/components';
import { NewBookingNotificationEmail } from '@/lib/email-templates/NewBookingNotificationEmail';

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
      .select('id, title, price_value, group_size_max, booking_count, departure_date, available, start_dates')
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

    // Calculate price
    const totalPrice = trip.price_value * totalPassengers;

    // Generate token
    const token = generateBookingToken();
    const tokenExpiresAt = getTokenExpiration();

    // Determine travel_date
    const travelDate = selected_date || trip.departure_date || new Date().toISOString().split('T')[0];

    // Find/create client by email
    let resolvedClientId: string | null = null;
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', customer_email.trim())
      .limit(1)
      .single();

    if (existingClient) {
      resolvedClientId = existingClient.id;
    } else {
      const { data: newClient } = await supabase
        .from('clients')
        .insert({
          full_name: customer_name.trim(),
          email: customer_email.trim(),
        })
        .select('id')
        .single();
      if (newClient) {
        resolvedClientId = newClient.id;
      }
    }

    // Create booking (pending, no payment)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        trip_id,
        client_id: resolvedClientId,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim(),
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

    // Send notification email to reservas@headwaytrips.com
    if (process.env.RESEND_API_KEY) {
      try {
        const emailHtml = await render(
          NewBookingNotificationEmail({
            customerName: customer_name.trim(),
            customerEmail: customer_email.trim(),
            tripTitle: trip.title,
            tripId: trip.id,
            passengers: totalPassengers,
            totalPrice,
            currency: 'USD',
            travelDate,
            bookingId: booking.id,
            withPayment: false,
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
            to: 'reservas@headwaytrips.com',
            subject: `Nueva reserva - ${trip.title} - ${customer_name.trim()}`,
            html: emailHtml,
          }),
        });
      } catch (emailError) {
        console.error('Error sending booking notification email:', emailError);
      }
    }

    return NextResponse.json({
      token,
      booking_id: booking.id,
      total_price: totalPrice,
    });
  } catch (error) {
    console.error('Reserve error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
