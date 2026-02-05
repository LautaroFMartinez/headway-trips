'use client';

import { FlightBlock } from '@/types/blocks';
import { Plane, ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FlightBlockRendererProps {
  block: FlightBlock;
}

const CLASS_LABELS: Record<string, string> = {
  economy: 'Económica',
  premium_economy: 'Premium Economy',
  business: 'Business',
  first: 'Primera',
};

export function FlightBlockRenderer({ block }: FlightBlockRendererProps) {
  const { segments, included } = block.data;

  if (segments.length === 0 || (!segments[0].origin && !segments[0].destination)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Plane className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar información del vuelo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {segments.map((segment, index) => (
        <div key={segment.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{segment.airline}</span>
              {segment.flightNumber && (
                <Badge variant="outline" className="text-xs">
                  {segment.flightNumber}
                </Badge>
              )}
              {included && index === 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Check className="h-3 w-3" />
                  Incluido
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="text-center">
                <p className="font-bold">{segment.originCode || '---'}</p>
                <p className="text-xs text-muted-foreground">{segment.origin}</p>
                {segment.departureTime && (
                  <p className="text-xs">{segment.departureTime}</p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
              <div className="text-center">
                <p className="font-bold">{segment.destinationCode || '---'}</p>
                <p className="text-xs text-muted-foreground">{segment.destination}</p>
                {segment.arrivalTime && (
                  <p className="text-xs">{segment.arrivalTime}</p>
                )}
              </div>
            </div>
            {segment.class && (
              <p className="text-xs text-muted-foreground mt-1">
                Clase: {CLASS_LABELS[segment.class]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
