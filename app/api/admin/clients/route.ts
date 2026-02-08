import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de clientes con búsqueda y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,document_number.ilike.%${search}%,passport_number.ilike.%${search}%`
      );
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: clients, count, error } = await query;

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
    }

    // Obtener conteo de bookings por cliente
    const clientIds = (clients || []).map((c) => c.id);
    let bookingCounts: Record<string, number> = {};

    if (clientIds.length > 0) {
      const { data: countData } = await supabase
        .from('bookings')
        .select('client_id')
        .in('client_id', clientIds);

      if (countData) {
        bookingCounts = countData.reduce((acc: Record<string, number>, row) => {
          acc[row.client_id] = (acc[row.client_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    const clientsWithCounts = (clients || []).map((client) => ({
      ...client,
      booking_count: bookingCounts[client.id] || 0,
    }));

    return NextResponse.json({
      clients: clientsWithCounts,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Clients API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.full_name) {
      return NextResponse.json({ error: 'El nombre completo es requerido' }, { status: 400 });
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        full_name: body.full_name,
        email: body.email || null,
        phone: body.phone || null,
        nationality: body.nationality || null,
        birth_date: body.birth_date || null,
        document_type: body.document_type || null,
        document_number: body.document_number || null,
        passport_number: body.passport_number || null,
        emergency_contact_name: body.emergency_contact_name || null,
        emergency_contact_phone: body.emergency_contact_phone || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json({ error: 'Error al crear el cliente', details: error.message }, { status: 500 });
    }

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
