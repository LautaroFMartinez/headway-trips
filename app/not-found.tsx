'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, ArrowRight, MapPin } from 'lucide-react';
import { trips } from '@/lib/trips-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularTrips = trips.slice(0, 4);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(query) ||
        trip.region.toLowerCase().includes(query) ||
        trip.tags.some((tag) => tag.toLowerCase().includes(query))
    ).slice(0, 4);
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/icono.png" 
              alt="Headway Trips Logo" 
              width={36} 
              height={36} 
              className="object-contain" 
            />
            <span className="text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Badge */}
          <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Destino no encontrado
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md mx-auto">
            Parece que este destino no existe o fue movido. Explora nuestros otros destinos increibles.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#destinos">
                <MapPin className="w-4 h-4 mr-2" />
                Ver destinos
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Buscar destinos
            </h2>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre o region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 text-left">
                {searchResults.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/viaje/${trip.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image 
                        src={trip.image} 
                        alt={trip.title} 
                        fill 
                        className="object-cover" 
                        sizes="56px" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition-colors truncate">
                        {trip.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{trip.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                No encontramos resultados para "{searchQuery}"
              </p>
            )}
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Destinos populares</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/viaje/${trip.id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={trip.image}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {trip.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary-foreground/70 text-sm">
            2025 Headway Trips. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
