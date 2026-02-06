import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de viajes con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || '';
    const active = searchParams.get('active') || '';

    const offset = (page - 1) * limit;

    // Build query using actual table column names
    let query = supabase.from('trips').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,region.ilike.%${search}%`);
    }

    if (region && region !== 'all') {
      query = query.ilike('region', `%${region}%`);
    }

    if (active && active !== 'all') {
      query = query.eq('available', active === 'true');
    }

    // Apply pagination and sorting
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: rawTrips, count, error } = await query;

    if (error) {
      console.error('Error fetching trips:', error);
      return NextResponse.json({ error: 'Error al obtener viajes' }, { status: 500 });
    }

    // Transform data to match expected interface
    const trips = (rawTrips || []).map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle || '',
      slug: t.id, // Using id as slug since table doesn't have slug
      description: t.description || '',
      short_description: t.subtitle || '',
      destination: t.destination || t.region,
      region: t.region,
      price: t.price_value || parseFloat(t.price?.replace(/[^0-9.]/g, '') || '0'),
      original_price: null,
      duration_days: t.duration_days,
      duration_nights: t.duration_days ? t.duration_days - 1 : 0,
      image_url: t.image,
      gallery: t.gallery || [],
      includes: t.includes || [],
      excludes: t.excludes || [],
      itinerary: typeof t.itinerary === 'string' ? t.itinerary : '',
      pdf_url: t.pdf_url || null,
      content_blocks: t.content_blocks || [],
      is_featured: t.featured || false,
      is_active: t.available ?? true,
      created_at: t.created_at,
      updated_at: t.updated_at,
    }));

    return NextResponse.json({
      trips,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Trips API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo viaje
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'region', 'price', 'duration_days', 'image_url'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    // Generate unique ID
    const tripId =
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    // Parse itinerary: si es string, convertir a array de días
    let itineraryData: unknown[] = [];
    if (body.itinerary) {
      if (typeof body.itinerary === 'string') {
        // Convertir texto plano a array de objetos día por día
        const lines = body.itinerary.split('\n').filter((line: string) => line.trim());
        itineraryData = lines.map((line: string, index: number) => ({
          day: index + 1,
          description: line.trim(),
        }));
      } else if (Array.isArray(body.itinerary)) {
        itineraryData = body.itinerary;
      }
    }

    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        id: tripId,
        title: body.title,
        subtitle: body.short_description || '',
        description: body.description || '',
        destination: body.destination || '',
        region: body.region,
        duration: `${body.duration_days} días / ${body.duration_nights || body.duration_days - 1} noches`,
        duration_days: body.duration_days,
        price: `$${body.price.toLocaleString()} USD`,
        price_value: body.price,
        image: body.image_url,
        hero_image: body.image_url,
        gallery: body.gallery || [],
        highlights: [],
        tags: [],
        includes: body.includes || [],
        excludes: body.excludes || [],
        itinerary: itineraryData,
        pdf_url: body.pdf_url || null,
        content_blocks: body.content_blocks || [],
        difficulty_level: 'moderate',
        accommodation_type: 'Hotel 4 estrellas',
        available: body.is_active ?? true,
        featured: body.is_featured || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error.message, error.details, error.hint);
      return NextResponse.json({ error: 'Error al crear el viaje', details: error.message }, { status: 500 });
    }

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Create trip error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
