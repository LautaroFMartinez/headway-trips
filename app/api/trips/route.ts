import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips as staticTrips } from '@/lib/trips-data';

interface DatabaseTrip {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  description: string;
  duration: string;
  duration_days: number;
  price: string;
  price_value: number;
  image: string;
  hero_image: string | null;
  highlights: string[] | null;
  tags: string[] | null;
  available: boolean;
  featured: boolean;
  includes: string[] | null;
  excludes: string[] | null;
  itinerary: string | null;
  con_cachi_y_nano?: boolean;
}

interface FormattedTrip {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  description: string;
  duration: string;
  durationDays: number;
  price: string;
  priceValue: number;
  image: string;
  heroImage: string;
  highlights: string[];
  tags: string[];
  available: boolean;
  featured: boolean;
  includes: string[];
  excludes: string[];
  itinerary: string;
  conCachiYNano: boolean;
}

function transformTrip(trip: DatabaseTrip): FormattedTrip {
  return {
    id: trip.id,
    title: trip.title,
    subtitle: trip.subtitle || '',
    region: trip.region || 'sudamerica',
    description: trip.description || '',
    duration: trip.duration || `${trip.duration_days} días`,
    durationDays: trip.duration_days || 1,
    price: trip.price || `Desde USD $${trip.price_value}`,
    priceValue: trip.price_value || 0,
    image: trip.image || '/placeholder-trip.jpg',
    heroImage: trip.hero_image || trip.image || '/placeholder-trip.jpg',
    highlights: trip.highlights || [],
    tags: trip.tags || [],
    available: trip.available ?? true,
    featured: trip.featured ?? false,
    includes: trip.includes || [],
    excludes: trip.excludes || [],
    itinerary: trip.itinerary || '',
    conCachiYNano: trip.con_cachi_y_nano ?? false,
  };
}

export async function GET(request: NextRequest) {
  try {
    // Si Supabase no está configurado, usar datos estáticos
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: staticTrips, count: staticTrips.length, source: 'static' });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ data: staticTrips, count: staticTrips.length, source: 'static' });
    }

    const { searchParams } = new URL(request.url);

    // Parámetros de filtrado
    const region = searchParams.get('region');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minDays = searchParams.get('minDays');
    const maxDays = searchParams.get('maxDays');
    const tags = searchParams.get('tags'); // comma-separated
    const available = searchParams.get('available');
    const conCachiYNano = searchParams.get('conCachiYNano');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let query = supabase.from('trips').select('*').order('price_value', { ascending: true });

    // Aplicar filtros
    if (region) {
      query = query.eq('region', region);
    }

    if (minPrice) {
      query = query.gte('price_value', Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price_value', Number(maxPrice));
    }

    if (minDays) {
      query = query.gte('duration_days', Number(minDays));
    }

    if (maxDays) {
      query = query.lte('duration_days', Number(maxDays));
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim());
      query = query.overlaps('tags', tagArray);
    }

    if (available === 'true') {
      query = query.eq('available', true);
    }

    if (conCachiYNano === 'true') {
      query = query.eq('con_cachi_y_nano', true);
    }

    // Paginación
    if (limit) {
      query = query.limit(Number(limit));
    }

    if (offset) {
      query = query.range(Number(offset), Number(offset) + (Number(limit) || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ data: staticTrips, count: staticTrips.length, source: 'static' });
    }

    // Transformar datos al formato esperado por el frontend
    const transformedData = (data as DatabaseTrip[]).map(transformTrip);

    return NextResponse.json({ data: transformedData, count: transformedData.length, source: 'supabase' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ data: staticTrips, count: staticTrips.length, source: 'static' });
  }
}
