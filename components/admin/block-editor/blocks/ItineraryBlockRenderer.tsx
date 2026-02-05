'use client';

import { ItineraryBlock } from '@/types/blocks';
import { Badge } from '@/components/ui/badge';
import { Coffee, UtensilsCrossed, Moon } from 'lucide-react';

interface ItineraryBlockRendererProps {
  block: ItineraryBlock;
}

export function ItineraryBlockRenderer({ block }: ItineraryBlockRendererProps) {
  const { days } = block.data;

  if (days.length === 0) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para agregar días al itinerario...
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {days.slice(0, 3).map((day) => (
        <div
          key={day.id}
          className="flex gap-3 p-3 rounded-lg bg-muted/50"
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary">{day.dayNumber}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium">{day.title || `Día ${day.dayNumber}`}</h4>
            {day.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {day.description}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              {day.meals.breakfast && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Coffee className="h-3 w-3" />
                  Desayuno
                </Badge>
              )}
              {day.meals.lunch && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <UtensilsCrossed className="h-3 w-3" />
                  Almuerzo
                </Badge>
              )}
              {day.meals.dinner && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Moon className="h-3 w-3" />
                  Cena
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
      {days.length > 3 && (
        <p className="text-sm text-muted-foreground text-center">
          +{days.length - 3} días más...
        </p>
      )}
    </div>
  );
}
