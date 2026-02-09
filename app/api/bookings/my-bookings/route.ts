import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { generateBookingToken } from '@/lib/booking-tokens';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const allEmails = user.emailAddresses?.map((e) => e.emailAddress) || [];
    const primaryEmail = user.primaryEmailAddressId
      ? user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
      : null;
    const mainEmail = primaryEmail || allEmails[0];

    if (!mainEmail || allEmails.length === 0) {
      return NextResponse.json({ error: 'No se encontró email asociado a tu cuenta' }, { status: 400 });
    }

    // Query bookings
    let query = supabase
      .from('bookings')
      .select(`
        id,
        trip_id,
        customer_name,
        customer_email,
        customer_phone,
        adults,
        children,
        total_price,
        currency,
        status,
        payment_status,
        travel_date,
        details_completed,
        completion_token,
        token_expires_at,
        client_id,
        created_at,
        trips (
          id,
          title,
          image,
          departure_date,
          duration,
          duration_days
        ),
        booking_payments (
          id,
          amount,
          currency,
          payment_method,
          payment_date,
          revolut_status
        )
      `);

    if (allEmails.length === 1) {
      query = query.ilike('customer_email', allEmails[0]);
    } else {
      const orFilter = allEmails.map((e) => `customer_email.ilike.${e}`).join(',');
      query = query.or(orFilter);
    }

    const { data: bookings, error: bookingsError } = await query
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    // Generate completion_token for legacy bookings that don't have one
    const bookingsNeedingToken = (bookings || []).filter((b) => !b.completion_token);
    if (bookingsNeedingToken.length > 0) {
      await Promise.all(
        bookingsNeedingToken.map((b) =>
          supabase
            .from('bookings')
            .update({
              completion_token: generateBookingToken(),
              token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', b.id)
        )
      );
      const { data: updatedTokens } = await supabase
        .from('bookings')
        .select('id, completion_token')
        .in('id', bookingsNeedingToken.map((b) => b.id));
      if (updatedTokens) {
        for (const ut of updatedTokens) {
          const b = bookings?.find((bk) => bk.id === ut.id);
          if (b) (b as Record<string, unknown>).completion_token = ut.completion_token;
        }
      }
    }

    // Fetch booking_passengers and clients separately for completeness check
    const bookingIds = (bookings || []).map((b) => b.id);
    const clientIds = (bookings || []).map((b) => b.client_id).filter(Boolean) as string[];

    let passengersMap: Record<string, Record<string, unknown>[]> = {};
    let clientsMap: Record<string, Record<string, unknown>> = {};

    if (bookingIds.length > 0) {
      const { data: passengers } = await supabase
        .from('booking_passengers')
        .select('booking_id, full_name, email, phone, nationality, birth_date, document_number, emergency_contact_name, emergency_contact_phone, client_id')
        .in('booking_id', bookingIds);

      if (passengers) {
        for (const p of passengers) {
          if (!passengersMap[p.booking_id]) passengersMap[p.booking_id] = [];
          passengersMap[p.booking_id].push(p);
          if (p.client_id && !clientIds.includes(p.client_id)) {
            clientIds.push(p.client_id);
          }
        }
      }
    }

    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id, passport_number, passport_issuing_country, passport_expiry_date, nationality, birth_date, emergency_contact_name, emergency_contact_phone')
        .in('id', clientIds);

      if (clients) {
        for (const c of clients) {
          clientsMap[c.id] = c;
        }
      }
    }

    // Build response with computed details_completed
    const bookingsWithPaid = (bookings || []).map((booking) => {
      const payments = Array.isArray(booking.booking_payments) ? booking.booking_payments : [];
      const totalPaid = payments
        .filter((p: { revolut_status?: string }) => !p.revolut_status || p.revolut_status === 'completed' || p.revolut_status === 'COMPLETED')
        .reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);

      // Compute details_completed from actual passenger + client data
      const passengers = passengersMap[booking.id] || [];
      const expectedCount = (booking.adults || 0) + (booking.children || 0);
      let realDetailsCompleted = false;

      if (passengers.length >= expectedCount && expectedCount > 0) {
        // Has booking_passengers — check each one
        realDetailsCompleted = passengers.every((p, i) => {
          const cl = p.client_id ? clientsMap[p.client_id as string] : null;
          const bookingClient = booking.client_id ? clientsMap[booking.client_id] : null;
          const effectiveClient = cl || bookingClient;

          const hasBasic = !!(p.full_name && p.nationality && p.birth_date);
          const hasPassport = !!(
            (p.document_number || effectiveClient?.passport_number) &&
            effectiveClient?.passport_issuing_country &&
            effectiveClient?.passport_expiry_date
          );
          const hasEmergency = !!(
            (p.emergency_contact_name || effectiveClient?.emergency_contact_name) &&
            (p.emergency_contact_phone || effectiveClient?.emergency_contact_phone)
          );
          const hasContact = i === 0 ? !!(p.email && p.phone) : true;

          return hasBasic && hasPassport && hasEmergency && hasContact;
        });
      } else if (passengers.length === 0 && expectedCount === 1 && booking.client_id) {
        // Admin-created booking with no booking_passengers — check from client directly
        const cl = clientsMap[booking.client_id];
        if (cl) {
          const hasBasic = !!(cl.nationality && cl.birth_date);
          const hasPassport = !!(cl.passport_number && cl.passport_issuing_country && cl.passport_expiry_date);
          const hasEmergency = !!(cl.emergency_contact_name && cl.emergency_contact_phone);
          const hasContact = !!(booking.customer_email && booking.customer_phone);
          realDetailsCompleted = hasBasic && hasPassport && hasEmergency && hasContact;
        }
      }

      return {
        ...booking,
        total_paid: totalPaid,
        payments_count: payments.length,
        details_completed: realDetailsCompleted,
      };
    });

    return NextResponse.json({ bookings: bookingsWithPaid, email: mainEmail });
  } catch (error) {
    console.error('My bookings error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
