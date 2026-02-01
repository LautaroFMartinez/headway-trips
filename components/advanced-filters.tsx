'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { trips, type Trip } from '@/lib/trips-data';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';

const FILTERS_STORAGE_KEY = 'headway-trips-filters';

export interface TripFilters {
  priceRange: [number, number];
  durationRange: [number, number];
  regions: string[];
  tags: string[];
}

interface AdvancedFiltersProps {
  onFilterChange?: (filteredTrips: Trip[]) => void;
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Calculate min/max values from data
  const priceMin = Math.min(...trips.map((t) => t.priceValue));
  const priceMax = Math.max(...trips.map((t) => t.priceValue));
  const durationMin = Math.min(...trips.map((t) => t.durationDays));
  const durationMax = Math.max(...trips.map((t) => t.durationDays));

  // Get unique regions and tags
  const allRegions = Array.from(new Set(trips.map((t) => t.region)));
  const allTags = Array.from(new Set(trips.flatMap((t) => t.tags)));

  // Initialize filters from URL or localStorage or defaults
  const [filters, setFilters] = useState<TripFilters>(() => {
    // Try URL params first
    const urlFilters = getFiltersFromURL(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      return {
        priceRange: urlFilters.priceRange || [priceMin, priceMax],
        durationRange: urlFilters.durationRange || [durationMin, durationMax],
        regions: urlFilters.regions || [],
        tags: urlFilters.tags || [],
      };
    }

    // Try localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Invalid JSON, use defaults
        }
      }
    }

    // Defaults
    return {
      priceRange: [priceMin, priceMax],
      durationRange: [durationMin, durationMax],
      regions: [],
      tags: [],
    };
  });

  // Apply filters
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const priceMatch = trip.priceValue >= filters.priceRange[0] && trip.priceValue <= filters.priceRange[1];
      const durationMatch = trip.durationDays >= filters.durationRange[0] && trip.durationDays <= filters.durationRange[1];
      const regionMatch = filters.regions.length === 0 || filters.regions.includes(trip.region);
      const tagMatch = filters.tags.length === 0 || filters.tags.some((tag) => trip.tags.includes(tag));

      return priceMatch && durationMatch && regionMatch && tagMatch;
    });
  }, [filters]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax) {
      params.set('priceMin', filters.priceRange[0].toString());
      params.set('priceMax', filters.priceRange[1].toString());
    }

    if (filters.durationRange[0] !== durationMin || filters.durationRange[1] !== durationMax) {
      params.set('durationMin', filters.durationRange[0].toString());
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

    // Save to localStorage
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));

    // Notify parent
    onFilterChange?.(filteredTrips);
  }, [filters, filteredTrips, pathname, router, priceMin, priceMax, durationMin, durationMax, onFilterChange]);

  const activeFiltersCount = (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax ? 1 : 0) + (filters.durationRange[0] !== durationMin || filters.durationRange[1] !== durationMax ? 1 : 0) + filters.regions.length + filters.tags.length;

  const resetFilters = () => {
    setFilters({
      priceRange: [priceMin, priceMax],
      durationRange: [durationMin, durationMax],
      regions: [],
      tags: [],
    });
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
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
                ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider min={priceMin} max={priceMax} step={10000} value={filters.priceRange} onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))} className="py-4" />
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
                  <label htmlFor={`region-${region}`} className="text-sm font-medium capitalize cursor-pointer flex-1">
                    {region}
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
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.tags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={resetFilters} disabled={activeFiltersCount === 0} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
          <Button onClick={() => setIsOpen(false)} className="flex-1">
            Ver {filteredTrips.length} {filteredTrips.length === 1 ? 'resultado' : 'resultados'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function getFiltersFromURL(searchParams: URLSearchParams): Partial<TripFilters> {
  const filters: Partial<TripFilters> = {};

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin && priceMax) {
    filters.priceRange = [Number(priceMin), Number(priceMax)];
  }

  const durationMin = searchParams.get('durationMin');
  const durationMax = searchParams.get('durationMax');
  if (durationMin && durationMax) {
    filters.durationRange = [Number(durationMin), Number(durationMax)];
  }

  const regions = searchParams.get('regions');
  if (regions) {
    filters.regions = regions.split(',');
  }

  const tags = searchParams.get('tags');
  if (tags) {
    filters.tags = tags.split(',');
  }

  return filters;
}
