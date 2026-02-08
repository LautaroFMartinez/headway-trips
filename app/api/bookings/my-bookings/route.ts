import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
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

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'No se encontró email' }, { status: 400 });
    }

    const { data: bookings, error: bookingsError } = await supabase
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
          cover_image,
          departure_date,
          duration
        ),
        booking_payments (
          id,
          amount,
          currency,
          payment_method,
          payment_date,
          revolut_status
        )
      `)
      .eq('customer_email', email)
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

    return NextResponse.json({ bookings: bookingsWithPaid, email });
  } catch (error) {
    console.error('My bookings error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
