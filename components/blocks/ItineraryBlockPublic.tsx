'use client';

import { ItineraryBlock } from '@/types/blocks';
import { Coffee, UtensilsCrossed, Moon } from 'lucide-react';

interface ItineraryBlockPublicProps {
  block: ItineraryBlock;
}

export function ItineraryBlockPublic({ block }: ItineraryBlockPublicProps) {
  const { days } = block.data;

  if (days.length === 0) return null;

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div
          key={day.id}
          className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-l-0"
        >
          {/* Day number circle */}
          <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {day.dayNumber}
          </div>

          <div className="bg-secondary/50 rounded-2xl p-6 ml-4">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {day.title}
            </h3>

            {day.description && (
              <p className="text-muted-foreground leading-relaxed mb-4">
                {day.description}
              </p>
            )}

            {/* Meals */}
            {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
              <div className="flex flex-wrap gap-3">
                {day.meals.breakfast && (
                  <span className="inline-flex items-center gap-1.5 text-sm bg-background px-3 py-1.5 rounded-lg">
                    <Coffee className="h-4 w-4 text-amber-600" />
                    Desayuno
                  </span>
                )}
                {day.meals.lunch && (
                  <span className="inline-flex items-center gap-1.5 text-sm bg-background px-3 py-1.5 rounded-lg">
                    <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                    Almuerzo
                  </span>
                )}
                {day.meals.dinner && (
                  <span className="inline-flex items-center gap-1.5 text-sm bg-background px-3 py-1.5 rounded-lg">
                    <Moon className="h-4 w-4 text-indigo-600" />
                    Cena
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
