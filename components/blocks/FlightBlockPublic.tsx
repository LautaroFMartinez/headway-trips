'use client';

import { FlightBlock } from '@/types/blocks';
import { Plane, ArrowRight, Check } from 'lucide-react';

interface FlightBlockPublicProps {
  block: FlightBlock;
}

const CLASS_LABELS: Record<string, string> = {
  economy: 'Económica',
  premium_economy: 'Premium Economy',
  business: 'Business',
  first: 'Primera Clase',
};

export function FlightBlockPublic({ block }: FlightBlockPublicProps) {
  const { segments, included, notes } = block.data;

  if (segments.length === 0) return null;

  return (
    <div className="space-y-4">
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          className="bg-secondary/50 rounded-2xl p-6 border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Plane className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {segment.airline}
                    {segment.flightNumber && ` • ${segment.flightNumber}`}
                  </p>
                </div>
                {included && index === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full shrink-0">
                    <Check className="h-3 w-3" />
                    Incluido
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Origin */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {segment.originCode || '---'}
                  </p>
                  <p className="text-sm text-muted-foreground">{segment.origin}</p>
                  {segment.departureTime && (
                    <p className="text-sm font-medium mt-1">{segment.departureTime}</p>
                  )}
                  {segment.departureDate && (
                    <p className="text-xs text-muted-foreground">{segment.departureDate}</p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[200px] flex items-center">
                    <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
                    <Plane className="h-5 w-5 text-primary mx-2" />
                    <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
                  </div>
                </div>

                {/* Destination */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {segment.destinationCode || '---'}
                  </p>
                  <p className="text-sm text-muted-foreground">{segment.destination}</p>
                  {segment.arrivalTime && (
                    <p className="text-sm font-medium mt-1">{segment.arrivalTime}</p>
                  )}
                  {segment.arrivalDate && (
                    <p className="text-xs text-muted-foreground">{segment.arrivalDate}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                {segment.class && (
                  <span>Clase: {CLASS_LABELS[segment.class]}</span>
                )}
                {segment.baggage && (
                  <span>Equipaje: {segment.baggage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {notes && (
        <p className="text-sm text-muted-foreground px-2">{notes}</p>
      )}
    </div>
  );
}
