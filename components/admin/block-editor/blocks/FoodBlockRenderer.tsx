'use client';

import { FoodBlock } from '@/types/blocks';
import { Utensils, Coffee, Soup, Moon, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface FoodBlockRendererProps {
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

export function FoodBlockRenderer({ block }: FoodBlockRendererProps) {
  const { type, name, description, venue, included, dietary } = block.data;

  if (!name && !venue) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Utensils className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar información de la comida...
        </p>
      </div>
    );
  }

  const Icon = FOOD_ICONS[type] || Utensils;

  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            {FOOD_LABELS[type]}
          </Badge>
          <h4 className="font-medium">{name}</h4>
          {included && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Check className="h-3 w-3" />
              Incluido
            </Badge>
          )}
        </div>
        {venue && (
          <p className="text-sm text-muted-foreground mb-1">{venue}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        {dietary && dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dietary.map((diet, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {diet}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
