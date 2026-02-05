'use client';

import { TransportBlock } from '@/types/blocks';
import { Bus, Train, Car, Ship, ArrowRight, Clock, Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TransportBlockPublicProps {
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

export function TransportBlockPublic({ block }: TransportBlockPublicProps) {
  const { type, origin, destination, duration, company, class: serviceClass, departureTime, arrivalTime, included, notes } = block.data;

  if (!origin && !destination) return null;

  const Icon = TRANSPORT_ICONS[type] || Bus;

  return (
    <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {TRANSPORT_LABELS[type]}
                {company && ` • ${company}`}
              </p>
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span>{origin}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <span>{destination}</span>
              </div>
            </div>
            {included && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full shrink-0">
                <Check className="h-3 w-3" />
                Incluido
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {departureTime && (
              <span>Salida: {departureTime}</span>
            )}
            {arrivalTime && (
              <span>Llegada: {arrivalTime}</span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {duration}
              </span>
            )}
            {serviceClass && (
              <span>Clase: {serviceClass}</span>
            )}
          </div>

          {notes && (
            <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
              {notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
