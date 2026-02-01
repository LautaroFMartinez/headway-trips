import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTripById, trips, type Trip } from '@/lib/trips-data';
import { TripDetailClient } from '@/components/trip-detail-client';
import { TripDetailSkeleton } from '@/components/skeletons/trip-detail-skeleton';
import { generateSEOMetadata, generateTripOfferSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';

// Función para obtener viaje de Supabase o datos estáticos
async function getTrip(id: string): Promise<Trip | null> {
  // Primero intentar Supabase
  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase.from('trips').select('*').eq('id', id).single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || '',
          region: data.region || 'sudamerica',
          description: data.description || '',
          duration: data.duration || `${data.duration_days} días`,
          durationDays: data.duration_days || 1,
          price: data.price || `Desde USD $${data.price_value}`,
          priceValue: data.price_value || 0,
          image: data.image || '/placeholder-trip.jpg',
          heroImage: data.hero_image || data.image || '/placeholder-trip.jpg',
          highlights: data.highlights || [],
          tags: data.tags || [],
          pdfUrl: (data as { pdf_url?: string }).pdf_url || undefined,
        };
      }
    }
  }

  // Fallback a datos estáticos
  return getTripById(id) || null;
}

export function generateStaticParams() {
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

// Permitir rutas dinámicas que no estén en generateStaticParams
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    return {
      title: 'Destino no encontrado',
    };
  }

  return generateSEOMetadata({
    title: `${trip.title} - ${trip.subtitle}`,
    description: trip.description,
    url: `/viaje/${trip.id}`,
    image: trip.heroImage,
    keywords: [...trip.tags, trip.region, 'viaje', 'turismo', 'viajes internacionales'],
    type: 'article',
  });
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  const tripSchema = generateTripOfferSchema({
    name: trip.title,
    description: trip.description,
    image: `https://headwaytrips.com${trip.heroImage}`,
    url: `https://headwaytrips.com/viaje/${trip.id}`,
    price: trip.priceValue,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://headwaytrips.com' },
    { name: 'Viajes', url: 'https://headwaytrips.com/viaje' },
    { name: trip.title, url: `https://headwaytrips.com/viaje/${trip.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tripSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Suspense fallback={<TripDetailSkeleton />}>
        <TripDetailClient trip={trip} />
      </Suspense>
    </>
  );
}
