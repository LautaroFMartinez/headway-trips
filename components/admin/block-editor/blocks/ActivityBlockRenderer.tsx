'use client';

import { ActivityBlock } from '@/types/blocks';
import { Map, Clock, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActivityBlockRendererProps {
  block: ActivityBlock;
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'Fácil', color: 'bg-green-100 text-green-800' },
  moderate: { label: 'Moderado', color: 'bg-yellow-100 text-yellow-800' },
  challenging: { label: 'Desafiante', color: 'bg-orange-100 text-orange-800' },
  extreme: { label: 'Extremo', color: 'bg-red-100 text-red-800' },
};

export function ActivityBlockRenderer({ block }: ActivityBlockRendererProps) {
  const { name, description, duration, difficulty, included, location } = block.data;

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Map className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar información de la actividad...
        </p>
      </div>
    );
  }

  const difficultyInfo = DIFFICULTY_LABELS[difficulty];

  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Map className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{name}</h4>
          {included && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Check className="h-3 w-3" />
              Incluido
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          )}
          <Badge className={`text-xs ${difficultyInfo.color}`}>
            {difficultyInfo.label}
          </Badge>
          {location && <span>• {location}</span>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
