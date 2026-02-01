'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, ArrowRight, Search, SlidersHorizontal, X, Clock, TrendingUp } from 'lucide-react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { trips, getRegions, type Trip } from '@/lib/trips-data';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

const SEARCH_HISTORY_KEY = 'headway-trips-search-history';
const MAX_HISTORY_ITEMS = 5;

const regionLabels: Record<string, string> = {
  sudamerica: 'Sudamérica',
  norteamerica: 'Norteamérica',
  caribe: 'Caribe',
  europa: 'Europa',
  escandinavia: 'Escandinavia',
  'medio-oriente': 'Medio Oriente',
  asia: 'Asia',
  oceania: 'Oceanía',
};

interface TripFilters {
  priceRange: [number, number];
  durationRange: [number, number];
  regions: string[];
  tags: string[];
}

export function DestinationsGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filters state
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Calculate min/max values from data
  const priceMin = Math.min(...trips.map((t) => t.priceValue));
  const priceMax = Math.max(...trips.map((t) => t.priceValue));
  const durationMin = Math.min(...trips.map((t) => t.durationDays));
  const durationMax = Math.max(...trips.map((t) => t.durationDays));

  // Get unique regions and tags
  const allRegions = getRegions();
  const allTags = Array.from(new Set(trips.flatMap((t) => t.tags))).sort();

  // Initialize filters from URL params
  const getInitialFilters = useCallback((): TripFilters => {
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const durationMinParam = searchParams.get('durationMin');
    const durationMaxParam = searchParams.get('durationMax');
    const regionsParam = searchParams.get('regions');
    const tagsParam = searchParams.get('tags');

    return {
      priceRange: [
        priceMinParam ? Number(priceMinParam) : priceMin,
        priceMaxParam ? Number(priceMaxParam) : priceMax,
      ],
      durationRange: [
        durationMinParam ? Number(durationMinParam) : durationMin,
        durationMaxParam ? Number(durationMaxParam) : durationMax,
      ],
      regions: regionsParam ? regionsParam.split(',') : [],
      tags: tagsParam ? tagsParam.split(',') : [],
    };
  }, [searchParams, priceMin, priceMax, durationMin, durationMax]);

  const [filters, setFilters] = useState<TripFilters>(getInitialFilters);

  // Initialize search from URL
  useEffect(() => {
    const searchParam = searchParams.get('q');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Load search history
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        // Invalid JSON
      }
    }
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results with fuzzy matching and scoring
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean);

    return trips
      .map((trip) => {
        let score = 0;
        const searchableText = `${trip.title} ${trip.subtitle} ${trip.description} ${trip.region} ${trip.tags.join(' ')} ${trip.highlights.join(' ')}`.toLowerCase();

        searchTerms.forEach((term) => {
          if (trip.title.toLowerCase().includes(term)) score += 10;
          if (trip.subtitle.toLowerCase().includes(term)) score += 5;
          if (trip.region.toLowerCase().includes(term)) score += 8;
          if (trip.tags.some((tag) => tag.toLowerCase().includes(term))) score += 6;
          if (searchableText.includes(term)) score += 1;
        });

        return { trip, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((result) => result.trip);
  }, [debouncedQuery]);

  // Filter trips based on all criteria
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Search filter
      if (debouncedQuery.trim()) {
        const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean);
        const searchableText = `${trip.title} ${trip.subtitle} ${trip.description} ${trip.region} ${trip.tags.join(' ')}`.toLowerCase();
        const matchesSearch = searchTerms.every((term) => searchableText.includes(term));
        if (!matchesSearch) return false;
      }

      // Price filter
      if (trip.priceValue < filters.priceRange[0] || trip.priceValue > filters.priceRange[1]) {
        return false;
      }

      // Duration filter
      if (trip.durationDays < filters.durationRange[0] || trip.durationDays > filters.durationRange[1]) {
        return false;
      }

      // Region filter
      if (filters.regions.length > 0 && !filters.regions.includes(trip.region)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some((tag) => trip.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [debouncedQuery, filters]);

  // Update URL with filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    }

    if (filters.priceRange[0] !== priceMin) {
      params.set('priceMin', filters.priceRange[0].toString());
    }
    if (filters.priceRange[1] !== priceMax) {
      params.set('priceMax', filters.priceRange[1].toString());
    }

    if (filters.durationRange[0] !== durationMin) {
      params.set('durationMin', filters.durationRange[0].toString());
    }
    if (filters.durationRange[1] !== durationMax) {
      params.set('durationMax', filters.durationRange[1].toString());
    }

    if (filters.regions.length > 0) {
      params.set('regions', filters.regions.join(','));
    }

    if (filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, filters, pathname, router, priceMin, priceMax, durationMin, durationMax]);

  // Debounce URL updates
  useEffect(() => {
    const timer = setTimeout(updateURL, 500);
    return () => clearTimeout(timer);
  }, [updateURL]);

  // Save to search history
  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    const newHistory = [term, ...searchHistory.filter((item) => item !== term)].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleResultClick = (trip: Trip) => {
    saveToHistory(searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setSearchQuery(historyQuery);
    inputRef.current?.focus();
  };

  // Count active filters
  const activeFiltersCount =
    (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax ? 1 : 0) +
    (filters.durationRange[0] !== durationMin || filters.durationRange[1] !== durationMax ? 1 : 0) +
    filters.regions.length +
    filters.tags.length;

  const resetFilters = () => {
    setFilters({
      priceRange: [priceMin, priceMax],
      durationRange: [durationMin, durationMax],
      regions: [],
      tags: [],
    });
    setSearchQuery('');
  };

  const toggleRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region) ? prev.regions.filter((r) => r !== region) : [...prev.regions, region],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const popularSearches = ['Bariloche', 'Cataratas', 'Europa', 'Caribe'];

  return (
    <section id="destinos" className="py-24 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase mb-3">Nuestros Destinos</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Explora lugares increíbles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">Selecciona tu próximo destino y descubre todos los detalles del viaje</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          <div className="flex gap-3">
            {/* Advanced Search with Autocomplete */}
            <div ref={searchRef} className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Buscar destinos, regiones, actividades..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-12 pr-10 h-14 text-lg bg-background"
                aria-label="Buscar viajes"
                aria-expanded={isSearchOpen}
                aria-controls="search-results"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div id="search-results" className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                        {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}
                      </div>
                      {searchResults.map((trip) => (
                        <Link key={trip.id} href={`/viaje/${trip.id}`} onClick={() => handleResultClick(trip)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                            <Image src={trip.image} alt={trip.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{trip.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{trip.subtitle}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{trip.price}</span>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{regionLabels[trip.region] || trip.region}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium mb-1">No se encontraron resultados</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  ) : (
                    <div className="p-4">
                      {/* Search History */}
                      {searchHistory.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                              <Clock className="w-4 h-4" />
                              Búsquedas recientes
                            </div>
                            <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                              Limpiar
                            </button>
                          </div>
                          <div className="space-y-1">
                            {searchHistory.map((item, index) => (
                              <button key={index} onClick={() => handleHistoryClick(item)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      <div>
                        <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground font-medium">
                          <TrendingUp className="w-4 h-4" />
                          Búsquedas populares
                        </div>
                        <div className="flex flex-wrap gap-2 px-3">
                          {popularSearches.map((search) => (
                            <button key={search} onClick={() => handleHistoryClick(search)} className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors">
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filters Button */}
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-14 px-6 relative">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">{activeFiltersCount}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtrar Viajes</SheetTitle>
                  <SheetDescription>Personalizá tu búsqueda según tus preferencias</SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-6">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Rango de Precio</Label>
                      <span className="text-sm text-muted-foreground">
                        USD ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <Slider min={priceMin} max={priceMax} step={100} value={filters.priceRange} onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))} className="py-4" />
                  </div>

                  {/* Duration Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Duración</Label>
                      <span className="text-sm text-muted-foreground">
                        {filters.durationRange[0]} - {filters.durationRange[1]} días
                      </span>
                    </div>
                    <Slider min={durationMin} max={durationMax} step={1} value={filters.durationRange} onValueChange={(value) => setFilters((prev) => ({ ...prev, durationRange: value as [number, number] }))} className="py-4" />
                  </div>

                  {/* Regions */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Regiones</Label>
                    <div className="space-y-3">
                      {allRegions.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox id={`region-${region}`} checked={filters.regions.includes(region)} onCheckedChange={() => toggleRegion(region)} />
                          <label htmlFor={`region-${region}`} className="text-sm font-medium cursor-pointer flex-1">
                            {regionLabels[region] || region}
                            <span className="text-muted-foreground ml-2">({trips.filter((t) => t.region === region).length})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Intereses</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={cn('px-3 py-1.5 rounded-full text-sm transition-colors capitalize', filters.tags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80')}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex-row gap-2 sm:flex-row">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Limpiar todo
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)} className="flex-1">
                    Ver {filteredTrips.length} {filteredTrips.length === 1 ? 'resultado' : 'resultados'}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Quick Region Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant={filters.regions.length === 0 ? 'default' : 'outline'} onClick={() => setFilters((prev) => ({ ...prev, regions: [] }))} className="rounded-full" size="sm">
              Todos
            </Button>
            {allRegions.slice(0, 6).map((region) => (
              <Button key={region} variant={filters.regions.includes(region) ? 'default' : 'outline'} onClick={() => toggleRegion(region)} className="rounded-full" size="sm">
                {regionLabels[region] || region}
              </Button>
            ))}
          </div>

          {/* Active Filters Summary */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <span className="text-sm text-muted-foreground">
                {filteredTrips.length} {filteredTrips.length === 1 ? 'destino encontrado' : 'destinos encontrados'}
              </span>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground text-lg mb-2">No se encontraron destinos</p>
            <p className="text-sm text-muted-foreground mb-4">Intenta con otros filtros o términos de búsqueda</p>
            <Button onClick={resetFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <Link key={trip.id} href={`/viaje/${trip.id}`} className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <Image src={trip.image || '/placeholder.svg'} alt={trip.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.subtitle}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{trip.title}</h3>
                  </div>
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">{trip.price}</div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{trip.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{trip.duration}</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
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
