'use client';

import { TransportBlock } from '@/types/blocks';
import { Bus, Train, Car, Ship, ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface TransportBlockRendererProps {
  block: TransportBlock;
}

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  bus: Bus,
  van: Car,
  car: Car,
  train: Train,
  boat: Ship,
  other: Bus,
};

const TRANSPORT_LABELS: Record<string, string> = {
  bus: 'Bus',
  van: 'Van',
  car: 'Auto',
  train: 'Tren',
  boat: 'Barco',
  other: 'Transporte',
};

export function TransportBlockRenderer({ block }: TransportBlockRendererProps) {
  const { type, origin, destination, duration, included, company } = block.data;

  if (!origin && !destination) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Bus className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar información del transporte...
        </p>
      </div>
    );
  }

  const Icon = TRANSPORT_ICONS[type] || Bus;

  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{TRANSPORT_LABELS[type]}</h4>
          {included && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Check className="h-3 w-3" />
              Incluido
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="font-medium">{origin || 'Origen'}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{destination || 'Destino'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {duration && <span>{duration}</span>}
          {company && <span>• {company}</span>}
        </div>
      </div>
    </div>
  );
}
