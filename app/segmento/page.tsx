import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mountain, Compass, Calendar } from 'lucide-react';

import { segments, getSegmentsByType } from '@/lib/segments-data';
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Todos los Segmentos de Viaje | Headway Trips',
  description: 'Explorá todos nuestros tipos de viaje: por región, actividad o temporada. Encontrá el destino perfecto para tu próxima aventura.',
  keywords: ['segmentos viaje', 'tipos de viaje', 'destinos Europa', 'turismo Europa'],
  url: '/segmento',
});

const typeIcons = {
  region: Mountain,
  activity: Compass,
  season: Calendar,
};

const typeLabels = {
  region: 'Regiones',
  activity: 'Actividades',
  season: 'Temporadas',
};

const typeDescriptions = {
  region: 'Explorá Europa por sus regiones más emblemáticas',
  activity: 'Encontrá viajes según tus actividades favoritas',
  season: 'Descubrí los mejores destinos para cada época del año',
};

export default function SegmentosIndexPage() {
  const regionSegments = getSegmentsByType('region');
  const activitySegments = getSegmentsByType('activity');
  const seasonSegments = getSegmentsByType('season');

  const breadcrumbItems = [{ label: 'Segmentos' }];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '' },
    { name: 'Segmentos', url: '/segmento' },
  ]);

  const segmentGroups = [
    { type: 'region' as const, segments: regionSegments },
    { type: 'activity' as const, segments: activitySegments },
    { type: 'season' as const, segments: seasonSegments },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4">Todos los segmentos</Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Encontrá tu <span className="text-primary">viaje ideal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorá nuestros destinos organizados por región, actividad o temporada. 
              Hay un viaje perfecto esperándote.
            </p>
          </div>
        </section>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Segment Groups */}
        {segmentGroups.map(({ type, segments }) => {
          const Icon = typeIcons[type];
          return (
            <section key={type} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold">{typeLabels[type]}</h2>
              </div>
              <p className="text-muted-foreground mb-8 ml-13">{typeDescriptions[type]}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {segments.map((segment) => (
                  <Link key={segment.slug} href={`/segmento/${segment.slug}`} className="group">
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-border/50">
                      <div className="relative h-40">
                        <Image
                          src={segment.heroImage}
                          alt={segment.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-semibold text-white text-lg line-clamp-2">
                            {segment.title}
                          </h3>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {segment.description}
                        </p>
                        <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Ver más <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl font-bold mb-2">¿No encontrás lo que buscás?</h3>
                <p className="text-muted-foreground">
                  Contactanos y te ayudamos a diseñar el viaje de tus sueños
                </p>
              </div>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Contactanos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
