import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';

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
  itinerary: unknown;
  pdf_url?: string | null;
}

function transformTrip(trip: DatabaseTrip) {
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
    itinerary: trip.itinerary || [],
    pdfUrl: trip.pdf_url || null,
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Primero intentar Supabase
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('trips').select('*').eq('id', id).single();

        if (!error && data) {
          return NextResponse.json({ data: transformTrip(data as unknown as DatabaseTrip), source: 'supabase' });
        }
      }
    }

    // Fallback a datos estáticos
    const trip = trips.find((t) => t.id === id);
    if (trip) {
      return NextResponse.json({ data: trip, source: 'static' });
    }

    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
