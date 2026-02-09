import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { render } from '@react-email/components';
import { BookingConfirmationEmail } from '@/lib/email-templates/BookingConfirmationEmail';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface PassengerData {
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  birth_date: string;
  passport_number: string;
  passport_issuing_country: string;
  passport_expiry_date: string;
  instagram: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  dietary_notes: string;
  allergies: string;
  additional_notes: string;
  is_adult: boolean;
}

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
    const { token, passengers } = body as { token: string; passengers: PassengerData[] };

    // Validate
    if (!token || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const primary = passengers[0];
    if (!primary.full_name || !primary.email || !primary.phone) {
      return NextResponse.json({ error: 'Faltan datos del pasajero principal' }, { status: 400 });
    }

    // Find booking by token
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, trip_id, adults, children, total_price, currency, details_completed, token_expires_at')
      .eq('completion_token', token)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    if (booking.token_expires_at && new Date(booking.token_expires_at) < new Date()) {
      // Auto-renew expired token so user can still complete
      await supabase
        .from('bookings')
        .update({ token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })
        .eq('id', booking.id);
    }

    // Remove existing booking_passengers and their clients (from admin-created or previous partial submission)
    const { data: existingBP } = await supabase
      .from('booking_passengers')
      .select('id, client_id')
      .eq('booking_id', booking.id);

    if (existingBP && existingBP.length > 0) {
      // Delete existing booking_passengers
      await supabase
        .from('booking_passengers')
        .delete()
        .eq('booking_id', booking.id);

      // Delete orphaned clients that were created for these passengers
      const orphanClientIds = existingBP.map((bp) => bp.client_id).filter(Boolean) as string[];
      if (orphanClientIds.length > 0) {
        await supabase
          .from('clients')
          .delete()
          .in('id', orphanClientIds);
      }
    }

    // Create a client and booking_passenger for each passenger
    let primaryClientId: string | null = null;

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      // Build notes
      const notesParts: string[] = [];
      if (p.instagram) notesParts.push(`Instagram: ${p.instagram}`);
      if (p.dietary_notes) notesParts.push(`Dieta: ${p.dietary_notes}`);
      if (p.allergies) notesParts.push(`Alergias: ${p.allergies}`);
      if (p.additional_notes) notesParts.push(`Notas: ${p.additional_notes}`);
      const notes = notesParts.length > 0 ? notesParts.join('\n') : null;

      // Create client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          full_name: p.full_name,
          email: p.email || null,
          phone: p.phone || null,
          nationality: p.nationality || null,
          birth_date: p.birth_date || null,
          passport_number: p.passport_number || null,
          passport_issuing_country: p.passport_issuing_country || null,
          passport_expiry_date: p.passport_expiry_date || null,
          emergency_contact_name: p.emergency_contact_name || null,
          emergency_contact_phone: p.emergency_contact_phone || null,
          notes,
        })
        .select('id')
        .single();

      if (clientError) {
        console.error(`Error creating client for passenger ${i}:`, clientError);
        continue;
      }

      if (i === 0 && client) {
        primaryClientId = client.id;
      }

      // Create booking passenger
      await supabase.from('booking_passengers').insert({
        booking_id: booking.id,
        client_id: client?.id || null,
        full_name: p.full_name,
        nationality: p.nationality || null,
        birth_date: p.birth_date || null,
        document_type: p.passport_number ? 'Passport' : null,
        document_number: p.passport_number || null,
        email: p.email || null,
        phone: p.phone || null,
        dietary_restrictions: p.dietary_notes || null,
        emergency_contact_name: p.emergency_contact_name || null,
        emergency_contact_phone: p.emergency_contact_phone || null,
        is_adult: p.is_adult,
      });
    }

    // Update booking with primary passenger info
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        client_id: primaryClientId,
        customer_name: primary.full_name,
        customer_email: primary.email,
        customer_phone: primary.phone,
        details_completed: true,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }

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
            customerName: primary.full_name,
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
            to: primary.email,
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
