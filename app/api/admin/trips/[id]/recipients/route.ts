import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get trip title
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('title')
      .eq('id', id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 });
    }

    // Get bookings with active statuses
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('customer_name, customer_email')
      .eq('trip_id', id)
      .not('status', 'in', '("cancelled","refunded")');

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    // Deduplicate by email
    const recipientMap = new Map<string, { email: string; name: string }>();
    for (const booking of bookings || []) {
      if (booking.customer_email && !recipientMap.has(booking.customer_email)) {
        recipientMap.set(booking.customer_email, {
          email: booking.customer_email,
          name: booking.customer_name,
        });
      }
    }

    const recipients = Array.from(recipientMap.values());

    return NextResponse.json({
      tripTitle: trip.title,
      count: recipients.length,
      recipients,
    });
  } catch (error) {
    console.error('Get recipients error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
