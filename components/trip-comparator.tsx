'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  ArrowRight,
  Check,
  Clock,
  MapPin,
  Sparkles,
  TrendingDown,
  Calendar,
  Star,
  Shield,
  CreditCard,
  Plane,
  Share2,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

import { trips, type Trip } from '@/lib/trips-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MAX_COMPARISON_ITEMS = 3;

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

/**
 * Calcula el precio por día de un viaje
 */
function calculatePricePerDay(priceValue: number, durationDays: number): number {
  if (durationDays <= 0) return 0;
  return Math.round(priceValue / durationDays);
}

/**
 * Simula datos de "incluye" basándose en los highlights del viaje
 */
function getIncludes(trip: Trip): string[] {
  const baseIncludes = [
    'Alojamiento',
    'Desayuno incluido',
    'Traslados aeropuerto-hotel',
    'Asistencia 24/7',
  ];
  return [...baseIncludes, ...trip.highlights.slice(0, 2)];
}

/**
 * Simula datos de "no incluye" comunes
 */
function getExcludes(): string[] {
  return [
    'Vuelos internacionales',
    'Seguro de viaje',
    'Comidas no especificadas',
    'Gastos personales',
  ];
}

interface TripCardProps {
  trip: Trip;
  isLowestPrice: boolean;
  isBestPricePerDay: boolean;
  onRemove: (id: string) => void;
}

function TripComparisonCard({
  trip,
  isLowestPrice,
  isBestPricePerDay,
  onRemove,
}: TripCardProps) {
  const pricePerDay = calculatePricePerDay(trip.priceValue, trip.durationDays);

  return (
    <motion.div
      layout
      variants={ANIMATION_VARIANTS.scaleIn}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {isLowestPrice && (
            <Badge className="bg-emerald-500 text-white border-0 gap-1.5 px-3 py-1">
              <TrendingDown className="h-3.5 w-3.5" />
              Mejor precio
            </Badge>
          )}
          {isBestPricePerDay && !isLowestPrice && (
            <Badge className="bg-blue-500 text-white border-0 gap-1.5 px-3 py-1">
              <DollarSign className="h-3.5 w-3.5" />
              Mejor $/día
            </Badge>
          )}
        </div>

        <button
          onClick={() => onRemove(trip.id)}
          className="absolute top-4 right-4 z-20 p-2 bg-background/90 backdrop-blur-sm hover:bg-destructive hover:text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
          aria-label={`Quitar ${trip.title} de comparación`}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={trip.image}
            alt={`Vista de ${trip.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2 bg-white/90 text-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {trip.region}
            </Badge>
            <h3 className="font-serif text-xl font-bold text-white drop-shadow-lg">
              {trip.title}
            </h3>
            <p className="text-white/90 text-sm">{trip.subtitle}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{trip.price}</p>
              <p className="text-xs text-muted-foreground">por persona</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{trip.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ~USD ${pricePerDay}/día
              </p>
            </div>
          </div>

          <Link href={`/viaje/${trip.id}`} className="block">
            <Button className="w-full gap-2 rounded-xl h-11">
              Ver detalles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

interface EmptySlotProps {
  index: number;
}

function EmptyComparisonSlot({ index }: EmptySlotProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Plus className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground/60 font-medium">Espacio disponible</p>
        <p className="text-sm text-muted-foreground/40 mt-1">
          Seleccioná un destino arriba
        </p>
      </div>
    </motion.div>
  );
}

interface ComparisonRowProps {
  label: string;
  icon: React.ReactNode;
  selectedTrips: Trip[];
  renderCell: (trip: Trip) => React.ReactNode;
}

function ComparisonRow({
  label,
  icon,
  selectedTrips,
  renderCell,
}: ComparisonRowProps) {
  const emptySlots = MAX_COMPARISON_ITEMS - selectedTrips.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3 text-muted-foreground font-medium">
        {icon}
        <span>{label}</span>
      </div>
      {selectedTrips.map((trip) => (
        <div key={trip.id} className="flex items-center justify-center md:justify-start">
          {renderCell(trip)}
        </div>
      ))}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div
          key={`empty-${label}-${i}`}
          className="hidden md:block h-6 bg-muted/20 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2">
            <Sparkles className="h-4 w-4" />
            Encontrá tu viaje ideal
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Comparador de Destinos
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Analizá lado a lado hasta 3 destinos. Compará precios, duración,
            destacados y encontrá el viaje perfecto para vos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: Shield, label: 'Pago Seguro' },
    { icon: CreditCard, label: 'Hasta 12 cuotas' },
    { icon: Calendar, label: 'Reserva flexible' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

interface ShareButtonProps {
  selectedTripIds: string[];
}

function ShareButton({ selectedTripIds }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/comparador?trips=${selectedTripIds.join(',')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Comparación de viajes - Headway Trips',
          text: 'Mirá esta comparación de destinos que armé',
          url,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        await copyToClipboard(url);
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (selectedTripIds.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Compartir
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Link copiado al portapapeles</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SelectorSectionProps {
  selectedTrips: Trip[];
  availableTrips: Trip[];
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  onAddTrip: (tripId: string) => void;
  onClearAll: () => void;
}

function SelectorSection({
  selectedTrips,
  availableTrips,
  dropdownOpen,
  setDropdownOpen,
  onAddTrip,
  onClearAll,
}: SelectorSectionProps) {
  const canAddMore = selectedTrips.length < MAX_COMPARISON_ITEMS;
  const selectedTripIds = selectedTrips.map((t) => t.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Seleccioná tus destinos</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTrips.length} de {MAX_COMPARISON_ITEMS} destinos
              seleccionados
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              onValueChange={onAddTrip}
              disabled={!canAddMore}
            >
              <SelectTrigger className="w-full sm:w-[280px] h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <SelectValue placeholder="Agregar destino" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableTrips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {trip.title}
                      <span className="text-xs text-muted-foreground">
                        · {trip.price}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ShareButton selectedTripIds={selectedTripIds} />

            {selectedTrips.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-destructive"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 px-6"
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Plane className="h-12 w-12 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold mb-3">Comenzá a comparar</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Seleccioná al menos un destino del menú superior para ver sus
          características y compararlo con otros viajes.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Más de 50 destinos disponibles para comparar</span>
        </div>
      </div>
    </motion.div>
  );
}

interface ComparisonGridProps {
  selectedTrips: Trip[];
  onRemoveTrip: (id: string) => void;
}

function ComparisonGrid({ selectedTrips, onRemoveTrip }: ComparisonGridProps) {
  const lowestPriceId = useMemo(() => {
    if (selectedTrips.length < 2) return null;
    const minPrice = Math.min(...selectedTrips.map((t) => t.priceValue));
    return selectedTrips.find((t) => t.priceValue === minPrice)?.id ?? null;
  }, [selectedTrips]);

  const bestPricePerDayId = useMemo(() => {
    if (selectedTrips.length < 2) return null;
    const pricesPerDay = selectedTrips.map((t) => ({
      id: t.id,
      pricePerDay: calculatePricePerDay(t.priceValue, t.durationDays),
    }));
    const minPricePerDay = Math.min(...pricesPerDay.map((p) => p.pricePerDay));
    return pricesPerDay.find((p) => p.pricePerDay === minPricePerDay)?.id ?? null;
  }, [selectedTrips]);

  const longestDurationId = useMemo(() => {
    if (selectedTrips.length < 2) return null;
    const maxDuration = Math.max(...selectedTrips.map((t) => t.durationDays));
    return selectedTrips.find((t) => t.durationDays === maxDuration)?.id ?? null;
  }, [selectedTrips]);

  const emptySlots = MAX_COMPARISON_ITEMS - selectedTrips.length;

  return (
    <section className="px-6 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {selectedTrips.map((trip) => (
              <TripComparisonCard
                key={trip.id}
                trip={trip}
                isLowestPrice={trip.id === lowestPriceId}
                isBestPricePerDay={trip.id === bestPricePerDayId}
                onRemove={onRemoveTrip}
              />
            ))}
          </AnimatePresence>
          {Array.from({ length: emptySlots }).map((_, i) => (
            <EmptyComparisonSlot key={`empty-slot-${i}`} index={i} />
          ))}
        </div>

        {selectedTrips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h3 className="font-serif text-xl font-semibold mb-6">
              Comparación detallada
            </h3>

            <div className="space-y-1">
              <ComparisonRow
                label="Precio total"
                icon={<CreditCard className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-semibold',
                        trip.id === lowestPriceId && 'text-emerald-600'
                      )}
                    >
                      {trip.price}
                    </span>
                    {trip.id === lowestPriceId && selectedTrips.length > 1 && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 text-xs"
                      >
                        Mejor
                      </Badge>
                    )}
                  </div>
                )}
              />

              <ComparisonRow
                label="Precio por día"
                icon={<DollarSign className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => {
                  const pricePerDay = calculatePricePerDay(
                    trip.priceValue,
                    trip.durationDays
                  );
                  return (
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-medium',
                          trip.id === bestPricePerDayId && 'text-blue-600'
                        )}
                      >
                        USD ${pricePerDay}/día
                      </span>
                      {trip.id === bestPricePerDayId &&
                        selectedTrips.length > 1 && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 text-xs"
                          >
                            Mejor $/día
                          </Badge>
                        )}
                    </div>
                  );
                }}
              />

              <ComparisonRow
                label="Duración"
                icon={<Clock className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        trip.id === longestDurationId &&
                          'text-blue-600 font-medium'
                      )}
                    >
                      {trip.duration}
                    </span>
                    {trip.id === longestDurationId &&
                      selectedTrips.length > 1 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 text-xs"
                        >
                          Más días
                        </Badge>
                      )}
                  </div>
                )}
              />

              <ComparisonRow
                label="Región"
                icon={<MapPin className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <Badge variant="outline" className="capitalize">
                    {trip.region}
                  </Badge>
                )}
              />

              <ComparisonRow
                label="Incluye"
                icon={<Check className="h-4 w-4 text-emerald-500" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <ul className="space-y-1.5">
                    {getIncludes(trip).map((item, idx) => (
                      <li
                        key={`${trip.id}-include-${idx}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />

              <ComparisonRow
                label="No incluye"
                icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <ul className="space-y-1.5">
                    {getExcludes().map((item, idx) => (
                      <li
                        key={`${trip.id}-exclude-${idx}`}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <X className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />

              <ComparisonRow
                label="Destacados"
                icon={<Star className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <ul className="space-y-1.5">
                    {trip.highlights.slice(0, 4).map((highlight, idx) => (
                      <li
                        key={`${trip.id}-highlight-${idx}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />

              <ComparisonRow
                label="Etiquetas"
                icon={<Sparkles className="h-4 w-4" />}
                selectedTrips={selectedTrips}
                renderCell={(trip) => (
                  <div className="flex flex-wrap gap-1.5">
                    {trip.tags.slice(0, 4).map((tag, idx) => (
                      <Badge
                        key={`${trip.id}-tag-${idx}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 rounded-3xl border border-primary/20"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            ¿Necesitás ayuda para decidir?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nuestros expertos en viajes están listos para asesorarte y ayudarte
            a encontrar el destino perfecto para vos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contacto">
              <Button size="lg" className="rounded-xl gap-2 px-8">
                Solicitar cotización
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#destinos">
              <Button variant="outline" size="lg" className="rounded-xl px-8">
                Ver todos los destinos
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TripComparator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar viajes desde URL al montar el componente
  useEffect(() => {
    if (isInitialized) return;

    const tripsParam = searchParams.get('trips');
    if (tripsParam) {
      const tripIds = tripsParam.split(',').filter(Boolean);
      const initialTrips = tripIds
        .map((id) => trips.find((t) => t.id === id))
        .filter((t): t is Trip => t !== undefined)
        .slice(0, MAX_COMPARISON_ITEMS);

      if (initialTrips.length > 0) {
        setSelectedTrips(initialTrips);
      }
    }
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Actualizar URL cuando cambian los viajes seleccionados
  useEffect(() => {
    if (!isInitialized) return;

    const tripIds = selectedTrips.map((t) => t.id).join(',');
    const newUrl = tripIds
      ? `/comparador?trips=${tripIds}`
      : '/comparador';

    // Solo actualizar si la URL cambió
    const currentTrips = searchParams.get('trips') || '';
    if (tripIds !== currentTrips) {
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedTrips, router, searchParams, isInitialized]);

  const availableTrips = useMemo(() => {
    const selectedIds = new Set(selectedTrips.map((t) => t.id));
    return trips.filter((t) => !selectedIds.has(t.id));
  }, [selectedTrips]);

  const handleAddTrip = useCallback((tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    setSelectedTrips((prev) => {
      if (prev.length >= MAX_COMPARISON_ITEMS) return prev;
      return [...prev, trip];
    });

    setDropdownOpen(false);
  }, []);

  const handleRemoveTrip = useCallback((tripId: string) => {
    setSelectedTrips((prev) => prev.filter((t) => t.id !== tripId));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTrips([]);
  }, []);

  return (
    <div className="space-y-8">
      <HeroSection />
      <TrustBadges />

      <SelectorSection
        selectedTrips={selectedTrips}
        availableTrips={availableTrips}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        onAddTrip={handleAddTrip}
        onClearAll={handleClearAll}
      />

      {selectedTrips.length > 0 ? (
        <ComparisonGrid
          selectedTrips={selectedTrips}
          onRemoveTrip={handleRemoveTrip}
        />
      ) : (
        <EmptyState />
      )}

      <CallToAction />
    </div>
  );
}
