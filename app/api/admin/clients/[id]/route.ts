import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un cliente con sus reservas
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Obtener reservas donde es titular
    const { data: directBookings } = await supabase
      .from('bookings')
      .select('id, trip_id, travel_date, status, payment_status, total_price, currency, created_at, trips(title, image)')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // Obtener reservas donde es pasajero secundario
    const { data: passengerEntries } = await supabase
      .from('booking_passengers')
      .select('booking_id')
      .eq('client_id', id);

    let allBookings = directBookings || [];

    if (passengerEntries && passengerEntries.length > 0) {
      const directIds = new Set(allBookings.map((b) => b.id));
      const extraIds = passengerEntries
        .map((p) => p.booking_id)
        .filter((bid) => !directIds.has(bid));

      if (extraIds.length > 0) {
        const { data: extraBookings } = await supabase
          .from('bookings')
          .select('id, trip_id, travel_date, status, payment_status, total_price, currency, created_at, trips(title, image)')
          .in('id', extraIds)
          .order('created_at', { ascending: false });

        if (extraBookings) {
          allBookings = [...allBookings, ...extraBookings];
        }
      }
    }

    return NextResponse.json({ ...client, bookings: allBookings });
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar cliente
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    const fields = [
      'full_name', 'email', 'phone', 'nationality', 'birth_date',
      'passport_number', 'passport_issuing_country', 'passport_expiry_date',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'notes',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field] || null;
      }
    }

    const { data: client, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return NextResponse.json({ error: 'Error al actualizar el cliente' }, { status: 500 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar cliente
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      return NextResponse.json({ error: 'Error al eliminar el cliente' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
