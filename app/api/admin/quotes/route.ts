import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de cotizaciones con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build query - using quote_requests table with correct column names
    let query = supabase.from('quote_requests').select('*, trips(title, region, price_value)', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply pagination and sorting
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: rawQuotes, count, error } = await query;

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 });
    }

    // Transform data to match expected interface
    const quotes = (rawQuotes || []).map((q) => ({
      id: q.id,
      trip_id: q.trip_id,
      name: q.customer_name,
      email: q.customer_email,
      phone: q.customer_phone,
      travel_date: q.travel_date,
      travelers: (q.adults || 0) + (q.children || 0),
      message: q.message,
      status: q.status || 'pending',
      notes: q.notes,
      created_at: q.created_at,
      trips: q.trips
        ? {
            title: q.trips.title,
            destination: q.trips.region,
            price: q.trips.price_value,
          }
        : null,
    }));

    return NextResponse.json({
      quotes,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Quotes API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva cotización (desde formulario público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['trip_id', 'name', 'email', 'travelers'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    const { data: quote, error } = await supabase
      .from('quote_requests')
      .insert({
        trip_id: body.trip_id,
        customer_name: body.name,
        customer_email: body.email,
        customer_phone: body.phone || null,
        travel_date: body.travel_date || null,
        adults: body.travelers || 1,
        children: 0,
        message: body.message || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quote:', error);
      return NextResponse.json({ error: 'Error al crear la cotización' }, { status: 500 });
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
