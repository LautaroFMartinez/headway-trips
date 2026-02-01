import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Si Supabase no está configurado, buscar en datos estáticos
    if (!isSupabaseConfigured()) {
      const trip = trips.find((t) => t.id === id);
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json({ data: trip, source: 'static' });
    }

    const supabase = createServerClient();
    if (!supabase) {
      const trip = trips.find((t) => t.id === id);
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json({ data: trip, source: 'static' });
    }

    const { data, error } = await supabase.from('trips').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error fetching trip', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
