import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TripComparator, type TripData } from '@/components/trip-comparator';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips as staticTrips } from '@/lib/trips-data';

export const metadata: Metadata = {
  title: 'Comparador de Destinos | Headway Trips',
  description: 'Compará nuestros mejores destinos lado a lado y elegí tu próxima aventura. Analizá precios, duración, destacados y más.',
  openGraph: {
    title: 'Comparador de Destinos | Headway Trips',
    description: 'Encontrá el viaje perfecto comparando destinos lado a lado.',
    images: ['/og-image.jpg'],
  },
};

async function getTrips(): Promise<TripData[]> {
  // Intentar Supabase primero
  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('available', true)
        .order('price_value', { ascending: true });

      if (!error && data) {
        return data.map((trip) => ({
          id: trip.id,
          title: trip.title,
          subtitle: trip.subtitle || '',
          region: trip.region || 'sudamerica',
          description: trip.description || '',
          duration: trip.duration || `${trip.duration_days} días`,
          durationDays: trip.duration_days || 1,
          price: trip.price || `USD $${trip.price_value}`,
          priceValue: trip.price_value || 0,
          image: trip.image || '/placeholder-trip.jpg',
          heroImage: trip.hero_image || trip.image || '/placeholder-trip.jpg',
          highlights: trip.highlights || [],
          tags: trip.tags || [],
          includes: trip.includes || [],
          excludes: trip.excludes || [],
        }));
      }
    }
  }

  // Fallback a datos estáticos (añadiendo includes/excludes vacíos)
  return staticTrips.map((trip) => ({
    ...trip,
    includes: [],
    excludes: [],
  }));
}

export default async function ComparatorPage() {
  const trips = await getTrips();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <TripComparator allTrips={trips} />
      </main>
      <Footer />
    </>
  );
}
