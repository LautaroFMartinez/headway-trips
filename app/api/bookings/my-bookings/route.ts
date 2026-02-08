import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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

    // Use clerkClient to reliably get user data
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Collect ALL email addresses from the Clerk user
    const allEmails = user.emailAddresses?.map((e) => e.emailAddress) || [];
    const primaryEmail = user.primaryEmailAddressId
      ? user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
      : null;

    // Use primary email first, otherwise first available
    const mainEmail = primaryEmail || allEmails[0];

    if (!mainEmail || allEmails.length === 0) {
      console.error('No email found for Clerk user:', userId);
      return NextResponse.json({ error: 'No se encontró email asociado a tu cuenta' }, { status: 400 });
    }

    // Query bookings matching ANY of the user's emails (case-insensitive)
    let query = supabase
      .from('bookings')
      .select(`
        id,
        trip_id,
        customer_name,
        customer_email,
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
      // Match any of the user's emails
      const orFilter = allEmails.map((e) => `customer_email.ilike.${e}`).join(',');
      query = query.or(orFilter);
    }

    const { data: bookings, error: bookingsError } = await query
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    // Calculate total paid per booking
    const bookingsWithPaid = (bookings || []).map((booking) => {
      const payments = Array.isArray(booking.booking_payments) ? booking.booking_payments : [];
      const totalPaid = payments
        .filter((p: { revolut_status?: string }) => !p.revolut_status || p.revolut_status === 'completed' || p.revolut_status === 'COMPLETED')
        .reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);

      return {
        ...booking,
        total_paid: totalPaid,
        payments_count: payments.length,
      };
    });

    return NextResponse.json({ bookings: bookingsWithPaid, email: mainEmail });
  } catch (error) {
    console.error('My bookings error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
