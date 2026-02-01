'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { trips, type Trip } from '@/lib/trips-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchProps {
  onResultClick?: () => void;
}

const SEARCH_HISTORY_KEY = 'headway-trips-search-history';
const MAX_HISTORY_ITEMS = 5;

export function AdvancedSearch({ onResultClick }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results with fuzzy matching
  const results = useMemo(() => {
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

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const newHistory = [searchTerm, ...searchHistory.filter((item) => item !== searchTerm)].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleResultClick = (trip: Trip) => {
    saveToHistory(query);
    setQuery('');
    setIsOpen(false);
    onResultClick?.();
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const popularSearches = ['Bariloche', 'Cataratas', 'Mendoza', 'Patagonia'];

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar destinos, regiones, actividades..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base"
          aria-label="Buscar viajes"
          aria-expanded={isOpen}
          aria-controls="search-results"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div id="search-results" className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50">
          {/* Results */}
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </div>
              {results.map((trip) => (
                <Link key={trip.id} href={`/viaje/${trip.id}`} onClick={() => handleResultClick(trip)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <Image src={trip.image} alt={trip.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{trip.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{trip.subtitle}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{trip.price}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{trip.region}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
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
  );
}
