import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';

export async function GET(request: NextRequest) {
  try {
    // Si Supabase no está configurado, usar datos estáticos
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: trips, count: trips.length, source: 'static' });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ data: trips, count: trips.length, source: 'static' });
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
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    
    let query = supabase
      .from('trips')
      .select('*')
      .order('price_value', { ascending: true });
    
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
    
    // Paginación
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    if (offset) {
      query = query.range(Number(offset), Number(offset) + (Number(limit) || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Error fetching trips', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
