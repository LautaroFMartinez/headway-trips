'use client';

import { FoodBlock } from '@/types/blocks';
import { Utensils, Coffee, Soup, Moon, MapPin, Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FoodBlockPublicProps {
  block: FoodBlock;
}

const FOOD_ICONS: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Soup,
  dinner: Moon,
  snack: Utensils,
  all_inclusive: Utensils,
};

const FOOD_LABELS: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
  all_inclusive: 'Todo Incluido',
};

export function FoodBlockPublic({ block }: FoodBlockPublicProps) {
  const { type, name, description, venue, included, dietary } = block.data;

  if (!name && !venue) return null;

  const Icon = FOOD_ICONS[type] || Utensils;

  return (
    <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {FOOD_LABELS[type]}
              </span>
              {name && (
                <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              )}
            </div>
            {included && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full shrink-0">
                <Check className="h-3 w-3" />
                Incluido
              </span>
            )}
          </div>

          {venue && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              {venue}
            </p>
          )}

          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}

          {dietary && dietary.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {dietary.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-background px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
