import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { render } from '@react-email/components';
import { BookingConfirmationEmail } from '@/lib/email-templates/BookingConfirmationEmail';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`booking-complete:${clientId}`, RATE_LIMITS.quotes);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      token,
      full_name,
      email,
      phone,
      nationality,
      birth_date,
      passport_number,
      passport_expiry_date,
      instagram,
      emergency_contact_name,
      emergency_contact_phone,
      dietary_notes,
      allergies,
      additional_notes,
    } = body;

    // Validate required
    if (!token || !full_name || !email || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Find booking by token
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, trip_id, adults, children, total_price, currency, details_completed, token_expires_at, customer_name')
      .eq('completion_token', token)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Check if already completed
    if (booking.details_completed) {
      return NextResponse.json({ error: 'Esta reserva ya fue completada' }, { status: 400 });
    }

    // Check token expiration
    if (booking.token_expires_at && new Date(booking.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'El enlace ha expirado. Contacta a soporte para asistencia.' },
        { status: 410 }
      );
    }

    // Build notes from extra fields
    const notesParts: string[] = [];
    if (instagram) notesParts.push(`Instagram: ${instagram}`);
    if (dietary_notes) notesParts.push(`Dieta: ${dietary_notes}`);
    if (allergies) notesParts.push(`Alergias: ${allergies}`);
    if (additional_notes) notesParts.push(`Notas: ${additional_notes}`);
    const notes = notesParts.length > 0 ? notesParts.join('\n') : null;

    // Create or find client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        full_name,
        email,
        phone,
        nationality: nationality || null,
        birth_date: birth_date || null,
        passport_number: passport_number || null,
        passport_expiry_date: passport_expiry_date || null,
        emergency_contact_name: emergency_contact_name || null,
        emergency_contact_phone: emergency_contact_phone || null,
        notes,
      })
      .select('id')
      .single();

    if (clientError || !client) {
      console.error('Error creating client:', clientError);
      return NextResponse.json({ error: 'Error al guardar datos del cliente' }, { status: 500 });
    }

    // Update booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        client_id: client.id,
        customer_name: full_name,
        customer_email: email,
        customer_phone: phone,
        details_completed: true,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }

    // Create booking passenger
    await supabase.from('booking_passengers').insert({
      booking_id: booking.id,
      full_name,
      nationality: nationality || null,
      birth_date: birth_date || null,
      document_type: passport_number ? 'Passport' : null,
      document_number: passport_number || null,
      email,
      phone,
      dietary_restrictions: dietary_notes || null,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_phone: emergency_contact_phone || null,
      is_adult: true,
    });

    // Get trip title for email
    const { data: trip } = await supabase
      .from('trips')
      .select('title, departure_date')
      .eq('id', booking.trip_id)
      .single();

    // Send confirmation email
    if (process.env.RESEND_API_KEY && trip) {
      try {
        const emailHtml = await render(
          BookingConfirmationEmail({
            customerName: full_name,
            tripTitle: trip.title,
            departureDate: trip.departure_date || undefined,
            totalPrice: booking.total_price,
            currency: booking.currency,
            passengers: booking.adults + (booking.children || 0),
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
            to: email,
            subject: `Reserva confirmada - ${trip.title}`,
            html: emailHtml,
          }),
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return NextResponse.json({ success: true, booking_id: booking.id });
  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
