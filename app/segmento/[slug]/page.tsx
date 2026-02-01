import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Lightbulb, MapPin } from 'lucide-react';

import { getSegmentBySlug, getRelatedSegments, segments } from '@/lib/segments-data';
import { trips } from '@/lib/trips-data';
import { generateSEOMetadata, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo-helpers';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TripGrid } from '@/components/trip-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SegmentPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return segments.map((segment) => ({
    slug: segment.slug,
  }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const segment = getSegmentBySlug(params.slug);

  if (!segment) {
    return {
      title: 'Segmento no encontrado',
    };
  }

  return generateSEOMetadata({
    title: segment.title,
    description: segment.metaDescription,
    keywords: segment.keywords,
    ogImage: segment.heroImage,
    path: `/segmento/${segment.slug}`,
  });
}

export default function SegmentPage({ params }: SegmentPageProps) {
  const segment = getSegmentBySlug(params.slug);

  if (!segment) {
    notFound();
  }

  const relatedTrips = trips.filter((trip) => segment.relatedTrips.includes(trip.id));
  const relatedSegments = getRelatedSegments(segment.slug, 3);

  const typeLabels = {
    region: 'Región',
    activity: 'Actividad',
    season: 'Temporada',
  };

  const breadcrumbItems = [{ label: 'Segmentos', href: '/#destinos' }, { label: segment.title }];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '' },
    { name: 'Segmentos', url: '/segmento' },
    { name: segment.title, url: `/segmento/${segment.slug}` },
  ]);

  const webPageSchema = generateWebPageSchema({
    title: segment.title,
    description: segment.metaDescription,
    url: `/segmento/${segment.slug}`,
  });

  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <Image src={segment.heroImage} alt={segment.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">{typeLabels[segment.type]}</Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{segment.title}</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">{segment.description}</p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Introduction */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">{segment.content.intro}</p>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-secondary/30 rounded-2xl">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">¿Qué hace especial a {segment.title.toLowerCase()}?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segment.content.features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Consejos para tu viaje</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {segment.content.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Related Trips */}
        {relatedTrips.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-2">Destinos recomendados</h2>
                <p className="text-muted-foreground">Explorá estos viajes ideales para {segment.title.toLowerCase()}</p>
              </div>
            </div>
            <TripGrid trips={relatedTrips} />
          </section>
        )}

        {/* Related Segments */}
        {relatedSegments.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-3xl font-bold mb-8">Explorá más segmentos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedSegments.map((relatedSegment) => (
                <Link key={relatedSegment.slug} href={`/segmento/${relatedSegment.slug}`} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48">
                      <Image src={relatedSegment.heroImage} alt={relatedSegment.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">{typeLabels[relatedSegment.type]}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{relatedSegment.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{relatedSegment.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">¿Listo para tu aventura?</h3>
                <p className="text-muted-foreground">Explorá todos nuestros destinos y encontrá el viaje perfecto para vos</p>
              </div>
              <Button size="lg" asChild className="whitespace-nowrap">
                <Link href="/#destinos">
                  Ver todos los destinos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
