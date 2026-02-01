import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const limit = Number(searchParams.get('limit')) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json({ data: [], suggestions: [] });
    }

    const searchTerm = query.toLowerCase();

    // Si Supabase no está configurado, buscar en datos estáticos
    if (!isSupabaseConfigured()) {
      const filteredTrips = trips.filter((trip) => trip.title.toLowerCase().includes(searchTerm) || trip.subtitle.toLowerCase().includes(searchTerm) || trip.region.toLowerCase().includes(searchTerm) || trip.description.toLowerCase().includes(searchTerm) || trip.tags.some((tag) => tag.toLowerCase().includes(searchTerm))).slice(0, limit);

      const suggestions = filteredTrips.slice(0, 5).map((trip) => ({
        id: trip.id,
        text: trip.title,
        subtitle: trip.subtitle,
        type: 'trip' as const,
      }));

      return NextResponse.json({ data: filteredTrips, suggestions, source: 'static' });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ data: [], suggestions: [], error: 'Supabase not configured' });
    }

    // Buscar en múltiples campos usando textSearch o ilike
    const { data, error } = await supabase.from('trips').select('id, title, subtitle, region, price, price_value, image, tags').eq('available', true).or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`).limit(limit);

    if (error) {
      return NextResponse.json({ error: 'Error searching trips', details: error.message }, { status: 500 });
    }

    // Ordenar resultados por relevancia (título coincide primero)
    const sortedData =
      data?.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(searchTerm) ? 0 : 1;
        const bTitle = b.title.toLowerCase().includes(searchTerm) ? 0 : 1;
        return aTitle - bTitle;
      }) || [];

    // Generar sugerencias de autocompletado
    const suggestions = sortedData.slice(0, 5).map((trip) => ({
      id: trip.id,
      text: trip.title,
      subtitle: trip.subtitle,
      type: 'trip' as const,
    }));

    return NextResponse.json({
      data: sortedData,
      suggestions,
      total: sortedData.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
