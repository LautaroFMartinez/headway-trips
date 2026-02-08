import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trips } from '@/lib/trips-data';
import { ProposalPage } from '@/components/proposal';
import type { ProposalTrip } from '@/components/proposal';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import type { ContentBlock } from '@/types/blocks';
import { generateSEOMetadata, generateTripOfferSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';

// No cachear esta página para que siempre muestre datos actualizados de Supabase
export const revalidate = 0;

// Loader mientras carga
function ProposalLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Obtener viaje completo con bloques de contenido
async function getTrip(id: string): Promise<ProposalTrip | null> {
  // Intentar Supabase primero
  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || '',
          code: data.id.toUpperCase().slice(0, 10),
          duration: data.duration || `${data.duration_days} días`,
          durationDays: data.duration_days || 1,
          description: data.description || '',
          heroImage: data.hero_image || data.image || '/placeholder-trip.jpg',
          gallery: data.gallery || [],
          price: data.price || `USD $${data.price_value}`,
          priceValue: data.price_value || 0,
          includes: data.includes || [],
          excludes: data.excludes || [],
          contentBlocks: (data.content_blocks as unknown as ContentBlock[]) || [],
          pdfUrl: data.pdf_url || undefined,
          maxCapacity: data.group_size_max ?? undefined,
          currentBookings: data.booking_count ?? undefined,
          departureDate: data.departure_date || undefined,
          depositPercentage: data.deposit_percentage ?? 10,
          startDates: data.start_dates || [],
        };
      }
    }
  }

  // Fallback a datos estáticos
  const staticTrip = trips.find((t) => t.id === id);
  if (!staticTrip) return null;

  return {
    id: staticTrip.id,
    title: staticTrip.title,
    subtitle: staticTrip.subtitle,
    code: staticTrip.id.toUpperCase().slice(0, 10),
    duration: staticTrip.duration,
    durationDays: staticTrip.durationDays,
    description: staticTrip.description,
    heroImage: staticTrip.heroImage,
    gallery: [],
    price: staticTrip.price,
    priceValue: staticTrip.priceValue,
    includes: [],
    excludes: [],
    contentBlocks: staticTrip.contentBlocks || [],
    pdfUrl: staticTrip.pdfUrl,
  };
}

export function generateStaticParams() {
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

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
    image: `/api/og?title=${encodeURIComponent(trip.title)}&subtitle=${encodeURIComponent(trip.subtitle)}&destination=${encodeURIComponent(trip.title)}`,
    keywords: ['viaje', 'turismo', trip.title],
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
      <Suspense fallback={<ProposalLoader />}>
        <ProposalPage trip={trip} />
      </Suspense>
    </>
  );
}
