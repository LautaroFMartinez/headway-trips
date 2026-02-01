'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Search, ArrowRight, MapPin } from 'lucide-react';

import { trips } from '@/lib/trips-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/breadcrumbs';

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;

  if (longerLength === 0) return 1.0;

  const editDistance = (s1: string, s2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get URL path and try to suggest similar destinations
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const pathSegments = currentPath.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';

  // Find similar trips based on URL
  const suggestedTrips = useMemo(() => {
    if (!lastSegment) return trips.slice(0, 3);

    const scored = trips.map((trip) => {
      const titleSimilarity = calculateSimilarity(lastSegment.toLowerCase(), trip.title.toLowerCase());
      const idSimilarity = calculateSimilarity(lastSegment.toLowerCase(), trip.id);
      const regionSimilarity = calculateSimilarity(lastSegment.toLowerCase(), trip.region.toLowerCase());

      const maxSimilarity = Math.max(titleSimilarity, idSimilarity, regionSimilarity);

      return { trip, similarity: maxSimilarity };
    });

    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((item) => item.trip);
  }, [lastSegment]);

  // Popular destinations
  const popularTrips = trips.slice(0, 4);

  // Filter trips based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return trips.filter((trip) => trip.title.toLowerCase().includes(query) || trip.region.toLowerCase().includes(query) || trip.tags.some((tag) => tag.toLowerCase().includes(query)));
  }, [searchQuery]);

  const breadcrumbItems = [{ label: 'Página no encontrada' }];

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/1.png" alt="Headway Trips Logo" width={44} height={44} className="object-contain" />
            <span className="font-serif text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="font-serif text-6xl font-bold text-primary">404</span>
            </motion.div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Destino no encontrado</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-2xl mx-auto">Parece que este destino no existe o fue movido. No te preocupes, tenemos muchos otros lugares increíbles para que explores.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#destinos">
                  <MapPin className="w-4 h-4 mr-2" />
                  Explorar destinos
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Search Section */}
          <section className="max-w-2xl mx-auto mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  ¿Buscabas algo específico?
                </CardTitle>
                <CardDescription>Buscá destinos por nombre, región o actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="search" placeholder="Ej: París, Tokio, playa, aventura..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((trip) => (
                      <Link key={trip.id} href={`/viaje/${trip.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={trip.image} alt={trip.title} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium group-hover:text-primary transition-colors truncate">{trip.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{trip.subtitle}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && <p className="mt-4 text-sm text-muted-foreground text-center">No encontramos resultados para "{searchQuery}"</p>}
              </CardContent>
            </Card>
          </section>

          {/* Suggested Trips based on URL */}
          {suggestedTrips.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-2xl font-bold mb-6 text-center">¿Quizás buscabas estos destinos?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {suggestedTrips.map((trip) => (
                  <Link key={trip.id} href={`/viaje/${trip.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48">
                        <Image src={trip.image} alt={trip.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-serif text-xl font-bold text-white mb-1">{trip.title}</h3>
                          <p className="text-sm text-white/90">{trip.subtitle}</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{trip.duration}</Badge>
                          <p className="font-semibold text-primary">{trip.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular Destinations */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Destinos populares</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTrips.map((trip) => (
                <Link key={trip.id} href={`/viaje/${trip.id}`} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40">
                      <Image src={trip.image} alt={trip.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{trip.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{trip.subtitle}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-background/50 text-sm">© 2026 Headway Trips. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
