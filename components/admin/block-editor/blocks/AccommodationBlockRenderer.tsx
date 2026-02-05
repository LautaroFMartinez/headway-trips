'use client';

import { AccommodationBlock } from '@/types/blocks';
import { Hotel, Star, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AccommodationBlockRendererProps {
  block: AccommodationBlock;
}

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  hostel: 'Hostel',
  apartment: 'Apartamento',
  resort: 'Resort',
  cabin: 'Cabaña',
  camping: 'Camping',
  other: 'Otro',
};

export function AccommodationBlockRenderer({ block }: AccommodationBlockRendererProps) {
  const { name, category, type, nights, amenities, description } = block.data;

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Hotel className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar información del alojamiento...
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Hotel className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{name}</h4>
          <div className="flex">
            {Array.from({ length: category }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[type]}
          </Badge>
          <span className="flex items-center gap-1">
            <Moon className="h-3.5 w-3.5" />
            {nights} {nights === 1 ? 'noche' : 'noches'}
          </span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {amenities.slice(0, 4).map((amenity, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{amenities.length - 4}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
