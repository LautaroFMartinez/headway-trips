'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, ArrowRight, Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { trips as staticTrips, type Trip } from '@/lib/trips-data';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

// Keys lowercase for lookup via region.toLowerCase(); values are display labels
const regionLabels: Record<string, string> = {
  sudamerica: 'Sudamérica',
  norteamerica: 'Norteamérica',
  norteamérica: 'Norteamérica',
  caribe: 'Caribe',
  europa: 'Europa',
  escandinavia: 'Escandinavia',
  'medio-oriente': 'Medio Oriente',
  asia: 'Asia',
  oceania: 'Oceanía',
  africa: 'África',
};

interface TripFilters {
  priceRange: [number, number];
  durationRange: [number, number];
  regions: string[];
  conCachiYNano: boolean;
}

export function DestinationsGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>(staticTrips);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatch with Radix Sheet
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load trips from API
  useEffect(() => {
    async function loadTrips() {
      try {
        const response = await fetch('/api/trips?available=true');
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setTrips(result.data);
        }
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setIsLoadingTrips(false);
      }
    }
    loadTrips();
  }, []);

  // Calculate min/max values
  const priceMin = useMemo(() => Math.min(...trips.map((t) => t.priceValue)), [trips]);
  const priceMax = useMemo(() => Math.max(...trips.map((t) => t.priceValue)), [trips]);
  const durationMin = useMemo(() => Math.min(...trips.map((t) => t.durationDays)), [trips]);
  const durationMax = useMemo(() => Math.max(...trips.map((t) => t.durationDays)), [trips]);
  const allRegions = useMemo(() => Array.from(new Set(trips.map((t) => t.region))).sort(), [trips]);

  const [filters, setFilters] = useState<TripFilters>({
    priceRange: [priceMin, priceMax],
    durationRange: [durationMin, durationMax],
    regions: [],
    conCachiYNano: false,
  });

  // Update filters when trips change
  useEffect(() => {
    if (!isLoadingTrips) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [priceMin, priceMax],
        durationRange: [durationMin, durationMax],
      }));
    }
  }, [isLoadingTrips, priceMin, priceMax, durationMin, durationMax]);

  // Restore filters and search from URL whenever URL changes (e.g. back/forward or initial load)
  useEffect(() => {
    if (isLoadingTrips) return;
    const q = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minDays = searchParams.get('minDays');
    const maxDays = searchParams.get('maxDays');
    const regionsParam = searchParams.get('regions');
    const cachi = searchParams.get('cachi');
    const hasAny = q != null || minPrice != null || maxPrice != null || minDays != null || maxDays != null || regionsParam != null || cachi != null;
    if (!hasAny) return;
    if (q != null) setSearchQuery(q);
    const parseNum = (v: string | null, fallback: number, min: number, max: number) => {
      if (v == null) return fallback;
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    };
    const pLow = parseNum(minPrice, priceMin, priceMin, priceMax);
    const pHigh = parseNum(maxPrice, priceMax, priceMin, priceMax);
    const dLow = parseNum(minDays, durationMin, durationMin, durationMax);
    const dHigh = parseNum(maxDays, durationMax, durationMin, durationMax);
    const regions = regionsParam ? regionsParam.split(',').map((r) => r.trim()).filter(Boolean) : [];
    const conCachiYNano = cachi === '1' || cachi === 'true';
    setFilters((prev) => ({
      ...prev,
      priceRange: [Math.min(pLow, pHigh), Math.max(pLow, pHigh)] as [number, number],
      durationRange: [Math.min(dLow, dHigh), Math.max(dLow, dHigh)] as [number, number],
      regions,
      conCachiYNano,
    }));
  }, [searchParams, isLoadingTrips, priceMin, priceMax, durationMin, durationMax]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (debouncedQuery.trim()) {
        const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean);
        const searchableText = `${trip.title} ${trip.subtitle} ${trip.description} ${trip.region} ${trip.tags.join(' ')}`.toLowerCase();
        if (!searchTerms.every((term) => searchableText.includes(term))) return false;
      }
      if (trip.priceValue < filters.priceRange[0] || trip.priceValue > filters.priceRange[1]) return false;
      if (trip.durationDays < filters.durationRange[0] || trip.durationDays > filters.durationRange[1]) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(trip.region)) return false;
      if (filters.conCachiYNano && !trip.conCachiYNano) return false;
      return true;
    });
  }, [trips, debouncedQuery, filters]);

  // Update URL with all filter state so views are shareable and survive reload
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax) {
      params.set('minPrice', String(filters.priceRange[0]));
      params.set('maxPrice', String(filters.priceRange[1]));
    }
    if (filters.durationRange[0] !== durationMin || filters.durationRange[1] !== durationMax) {
      params.set('minDays', String(filters.durationRange[0]));
      params.set('maxDays', String(filters.durationRange[1]));
    }
    if (filters.regions.length > 0) params.set('regions', filters.regions.join(','));
    if (filters.conCachiYNano) params.set('cachi', '1');
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, filters, pathname, router, priceMin, priceMax, durationMin, durationMax]);

  useEffect(() => {
    const timer = setTimeout(updateURL, 500);
    return () => clearTimeout(timer);
  }, [updateURL]);

  const activeFiltersCount = 
    (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax ? 1 : 0) + 
    (filters.durationRange[0] !== durationMin || filters.durationRange[1] !== durationMax ? 1 : 0) + 
    filters.regions.length +
    (filters.conCachiYNano ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      priceRange: [priceMin, priceMax],
      durationRange: [durationMin, durationMax],
      regions: [],
      conCachiYNano: false,
    });
    setSearchQuery('');
  };

  const toggleRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region) 
        ? prev.regions.filter((r) => r !== region) 
        : [...prev.regions, region],
    }));
  };

  return (
    <section id="destinos" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
            Nuestros Destinos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Explora lugares <span className="font-serif italic text-primary">increibles</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Selecciona tu proximo destino y descubri todos los detalles del viaje
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <div className="flex gap-3">
            <div ref={searchRef} className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Buscar destinos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 h-12 text-base bg-background border-border"
                aria-label="Buscar viajes"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Limpiar busqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isMounted && (
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12 px-5 relative gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtrar Viajes</SheetTitle>
                  <SheetDescription>Personaliza tu busqueda</SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-6">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Precio</Label>
                      <span className="text-sm text-muted-foreground">
                        USD ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      min={priceMin}
                      max={priceMax}
                      step={100}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                      className="py-4"
                    />
                  </div>

                  {/* Duration Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Duracion</Label>
                      <span className="text-sm text-muted-foreground">
                        {filters.durationRange[0]} - {filters.durationRange[1]} dias
                      </span>
                    </div>
                    <Slider
                      min={durationMin}
                      max={durationMax}
                      step={1}
                      value={filters.durationRange}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, durationRange: value as [number, number] }))}
                      className="py-4"
                    />
                  </div>

                  {/* Con Cachi y Nano */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="filter-cachi-nano"
                        checked={filters.conCachiYNano}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, conCachiYNano: checked === true }))
                        }
                      />
                      <label htmlFor="filter-cachi-nano" className="text-sm font-medium cursor-pointer flex-1">
                        Con Cachi y Nano
                        <span className="text-muted-foreground ml-2 font-normal">
                          ({trips.filter((t) => t.conCachiYNano).length})
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Regions */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Regiones</Label>
                    <div className="space-y-3">
                      {allRegions.map((region) => (
                        <div key={region} className="flex items-center space-x-3">
                          <Checkbox
                            id={`region-${region}`}
                            checked={filters.regions.includes(region)}
                            onCheckedChange={() => toggleRegion(region)}
                          />
                          <label htmlFor={`region-${region}`} className="text-sm cursor-pointer flex-1">
                            {regionLabels[region?.toLowerCase() ?? ''] || region}
                            <span className="text-muted-foreground ml-2">
                              ({trips.filter((t) => t.region === region).length})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex-row gap-3">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Limpiar
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)} className="flex-1">
                    Ver {filteredTrips.length} resultados
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            )}
          </div>

          {/* Quick Region Pills + Con Cachi y Nano */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, regions: [] }))}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                filters.regions.length === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-foreground'
              )}
            >
              Todos
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, conCachiYNano: !prev.conCachiYNano }))
              }
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                filters.conCachiYNano
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-foreground'
              )}
            >
              Con Cachi y Nano
            </button>
            {allRegions.slice(0, 5).map((region) => (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filters.regions.includes(region)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                )}
              >
                {regionLabels[region?.toLowerCase() ?? ''] || region}
              </button>
            ))}
          </div>

          {/* Results count */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {filteredTrips.length} {filteredTrips.length === 1 ? 'destino' : 'destinos'}
              </span>
              <button onClick={resetFilters} className="text-primary hover:underline font-medium">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {isLoadingTrips ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
            <p className="text-muted-foreground">Cargando destinos...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-2">No se encontraron destinos</p>
            <p className="text-sm text-muted-foreground mb-6">Intenta con otros filtros</p>
            <Button onClick={resetFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/viaje/${trip.id}`}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={trip.image || '/placeholder.svg'}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-semibold text-foreground">{trip.price}</span>
                  </div>
                  
                  {/* Location */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/90 text-sm mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{trip.subtitle}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{trip.title}</h3>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{trip.duration}</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Ver detalles
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
