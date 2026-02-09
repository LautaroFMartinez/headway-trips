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

    // Check token expiration — auto-renew if expired and details not yet completed
    let isExpired = booking.token_expires_at && new Date(booking.token_expires_at) < new Date();
    if (isExpired && !booking.details_completed) {
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('bookings')
        .update({ token_expires_at: newExpiry })
        .eq('id', booking.id);
      isExpired = false;
    }

    // Get trip info
    const { data: trip } = await supabase
      .from('trips')
      .select('title, price, price_value, departure_date, duration')
      .eq('id', booking.trip_id)
      .single();

    // Check Revolut payment status if needed
    // If no Revolut payments exist (admin-created booking), allow form access
    const { data: revolutPayments } = await supabase
      .from('booking_payments')
      .select('id')
      .eq('booking_id', booking.id)
      .not('revolut_order_id', 'is', null)
      .limit(1);
    const hasRevolutPayments = (revolutPayments?.length || 0) > 0;

    let paymentCompleted = booking.payment_status !== 'pending' || !hasRevolutPayments;
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

    // Fetch existing passenger data for pre-filling the form
    const { data: existingPassengers } = await supabase
      .from('booking_passengers')
      .select('full_name, email, phone, nationality, birth_date, document_number, emergency_contact_name, emergency_contact_phone, dietary_restrictions, is_adult, client_id')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: true });

    let passengersData: Record<string, unknown>[] = [];
    if (existingPassengers && existingPassengers.length > 0) {
      // Fetch client data for passport info and notes
      const clientIds = existingPassengers.map((p) => p.client_id).filter(Boolean) as string[];
      let clientsMap: Record<string, Record<string, unknown>> = {};
      if (clientIds.length > 0) {
        const { data: clients } = await supabase
          .from('clients')
          .select('id, passport_number, passport_issuing_country, passport_expiry_date, emergency_contact_name, emergency_contact_phone, notes')
          .in('id', clientIds);
        if (clients) {
          for (const c of clients) clientsMap[c.id] = c;
        }
      }

      passengersData = existingPassengers.map((p) => {
        const cl = p.client_id ? clientsMap[p.client_id] : null;
        // Parse notes for instagram, dietary, allergies, additional from client
        let instagram = '';
        let allergies = '';
        let additionalNotes = '';
        let dietaryFromClient = '';
        if (cl?.notes && typeof cl.notes === 'string') {
          for (const line of (cl.notes as string).split('\n')) {
            if (line.startsWith('Instagram: ')) instagram = line.replace('Instagram: ', '');
            else if (line.startsWith('Dieta: ')) dietaryFromClient = line.replace('Dieta: ', '');
            else if (line.startsWith('Alergias: ')) allergies = line.replace('Alergias: ', '');
            else if (line.startsWith('Notas: ')) additionalNotes = line.replace('Notas: ', '');
          }
        }
        return {
          full_name: p.full_name || '',
          email: p.email || '',
          phone: p.phone || '',
          nationality: p.nationality || '',
          birth_date: p.birth_date || '',
          passport_number: p.document_number || (cl?.passport_number as string) || '',
          passport_issuing_country: (cl?.passport_issuing_country as string) || '',
          passport_expiry_date: (cl?.passport_expiry_date as string) || '',
          instagram,
          emergency_contact_name: p.emergency_contact_name || (cl?.emergency_contact_name as string) || '',
          emergency_contact_phone: p.emergency_contact_phone || (cl?.emergency_contact_phone as string) || '',
          dietary_notes: p.dietary_restrictions || dietaryFromClient || '',
          allergies,
          additional_notes: additionalNotes,
          is_adult: p.is_adult ?? true,
        };
      });
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
      existing_passengers: passengersData,
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
