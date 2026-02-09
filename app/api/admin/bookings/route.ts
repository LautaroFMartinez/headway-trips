import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateBookingToken } from '@/lib/booking-tokens';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de reservas con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';
    const tripId = searchParams.get('trip_id') || '';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('bookings')
      .select('*, trips(title, image), clients(id, full_name)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (tripId) {
      query = query.eq('trip_id', tripId);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: bookings, count, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    // Obtener totales pagados por booking
    const bookingIds = (bookings || []).map((b) => b.id);
    let paidTotals: Record<string, number> = {};

    if (bookingIds.length > 0) {
      const { data: payments } = await supabase
        .from('booking_payments')
        .select('booking_id, amount, revolut_status')
        .in('booking_id', bookingIds);

      if (payments) {
        paidTotals = payments
          .filter((p) => !p.revolut_status || p.revolut_status === 'completed')
          .reduce((acc: Record<string, number>, p) => {
            acc[p.booking_id] = (acc[p.booking_id] || 0) + Number(p.amount);
            return acc;
          }, {});
      }
    }

    const bookingsWithPaid = (bookings || []).map((b) => ({
      ...b,
      total_paid: paidTotals[b.id] || 0,
    }));

    return NextResponse.json({
      bookings: bookingsWithPaid,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva reserva (desde admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    const required = ['trip_id', 'customer_name', 'customer_email', 'travel_date', 'adults', 'total_price'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    // Si viene client_id (desde admin), usarlo directamente.
    // Si no, auto-crear cliente desde los datos del formulario público.
    let clientId: string | null = body.client_id || null;
    if (!clientId && body.customer_name) {
      try {
        const { data: client } = await supabase
          .from('clients')
          .insert({
            full_name: body.customer_name,
            email: body.customer_email || null,
            phone: body.customer_phone || null,
          })
          .select('id')
          .single();

        if (client) clientId = client.id;
      } catch {
        // Best-effort: si falla la creación del cliente, la reserva se crea igual
      }
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        trip_id: body.trip_id,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        travel_date: body.travel_date,
        adults: body.adults || 1,
        children: body.children || 0,
        total_price: body.total_price,
        currency: body.currency || 'USD',
        status: body.status || 'pending',
        payment_status: body.payment_status || 'pending',
        special_requests: body.special_requests || null,
        internal_notes: body.internal_notes || null,
        client_id: clientId,
        completion_token: generateBookingToken(),
        token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        details_completed: false,
      })
      .select('*, trips(title, image)')
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ error: 'Error al crear la reserva', details: error.message }, { status: 500 });
    }

    // Actualizar booking_count del viaje (best-effort)
    try {
      const passengerCount = (body.adults || 1) + (body.children || 0);
      const { data: tripData } = await supabase
        .from('trips')
        .select('booking_count')
        .eq('id', body.trip_id)
        .single();

      await supabase
        .from('trips')
        .update({ booking_count: (tripData?.booking_count || 0) + passengerCount })
        .eq('id', body.trip_id);
    } catch {
      // Silently fail - booking_count update is best-effort
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
