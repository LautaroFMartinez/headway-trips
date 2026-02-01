'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, X, Heart } from 'lucide-react';
import { trips, getRegions } from '@/lib/trips-data';
import { useWishlist } from '@/hooks/use-wishlist';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PromoBanner } from '@/components/promo-banner';
import { cn } from '@/lib/utils';

export function TripGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([1000000]); // Default max price
  const [maxDays, setMaxDays] = useState<number[]>([15]);

  const { wishlist, toggleWishlist } = useWishlist();
  const regions = getRegions();

  const regionLabels: Record<string, string> = {
    patagonia: 'Patagonia',
    litoral: 'Litoral',
    cuyo: 'Cuyo',
    norte: 'Norte',
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = searchQuery === '' || trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || trip.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) || trip.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = !selectedRegion || trip.region === selectedRegion;

      const matchesPrice = trip.priceValue <= priceRange[0];
      const matchesDuration = trip.durationDays <= maxDays[0];

      return matchesSearch && matchesRegion && matchesPrice && matchesDuration;
    });
  }, [searchQuery, selectedRegion, priceRange, maxDays]);

  return (
    <section id="destinos" className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Nuestros Destinos</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-balance">Elegí tu próxima aventura</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Explorá nuestras opciones de viaje y descubrí los detalles de cada destino</p>
        </motion.div>

        {/* Promo Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="mb-8">
          <PromoBanner />
        </motion.div>

        {/* Search and Filters Container */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mb-12 space-y-8 bg-card p-6 rounded-2xl border border-border shadow-sm">
          {/* Top Row: Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Buscar destinos por nombre, región o actividad..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-10 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" aria-label="Buscar destinos" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors" aria-label="Limpiar búsqueda">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-border/50">
            {/* Region Filter */}
            <div className="space-y-4">
              <Label>Región</Label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedRegion(null)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', selectedRegion === null ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                  Todas
                </button>
                {regions.map((region) => (
                  <button key={region} onClick={() => setSelectedRegion(region)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', selectedRegion === region ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                    {regionLabels[region] || region}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Precio Máximo</Label>
                <span className="text-sm text-muted-foreground">${priceRange[0].toLocaleString()}</span>
              </div>
              <Slider value={priceRange} onValueChange={setPriceRange} max={1000000} step={10000} className="py-4" />
            </div>

            {/* Duration Filter */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Duración Máxima</Label>
                <span className="text-sm text-muted-foreground">{maxDays[0]} días</span>
              </div>
              <Slider value={maxDays} onValueChange={setMaxDays} max={15} step={1} className="py-4" />
            </div>

            {/* Results Summary */}
            <div className="flex flex-col justify-end">
              <p className="text-sm text-center text-muted-foreground">Mostrando {filteredTrips.length} resultados</p>
              {(selectedRegion || searchQuery || priceRange[0] < 1000000 || maxDays[0] < 15) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion(null);
                    setPriceRange([1000000]);
                    setMaxDays([15]);
                  }}
                  className="text-primary text-sm hover:underline mt-2 text-center"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trip Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTrips.map((trip, index) => (
              <motion.div key={trip.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <div className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                  <Link href={`/viaje/${trip.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={trip.image || '/placeholder.svg'} alt={trip.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-xs font-medium text-foreground">{trip.duration}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(trip.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                    aria-label={wishlist.includes(trip.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart className={cn('w-5 h-5 transition-colors', wishlist.includes(trip.id) ? 'fill-red-500 text-red-500' : 'text-foreground')} />
                  </button>

                  <Link href={`/viaje/${trip.id}`}>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wider text-primary font-medium mb-1">{trip.subtitle}</p>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{trip.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {trip.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{trip.price}</span>
                        <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          Ver detalles
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No results message */}
        {filteredTrips.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No encontramos destinos con esos criterios</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion(null);
                setPriceRange([1000000]);
                setMaxDays([15]);
              }}
              className="text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
