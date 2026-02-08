import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Use service role to query bookings (RLS may block anon reads)
    const { createClient } = await import('@supabase/supabase-js');
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: bookings, error: bookingsError } = await adminSupabase
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
      .eq('customer_email', user.email)
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

    return NextResponse.json({ bookings: bookingsWithPaid, email: user.email });
  } catch (error) {
    console.error('My bookings error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
