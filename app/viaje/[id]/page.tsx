import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getTripById, trips } from '@/lib/trips-data';
import { TripDetailClient } from '@/components/trip-detail-client';
import { TripDetailSkeleton } from '@/components/skeletons/trip-detail-skeleton';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { generateSEOMetadata, generateTripOfferSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export function generateStaticParams() {
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const trip = getTripById(id);

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
  const trip = getTripById(id);

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
