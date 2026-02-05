'use client';

import { ServicesBlock } from '@/types/blocks';
import { Check, X } from 'lucide-react';

interface ServicesBlockRendererProps {
  block: ServicesBlock;
}

export function ServicesBlockRenderer({ block }: ServicesBlockRendererProps) {
  const { includes, excludes } = block.data;

  if (includes.length === 0 && excludes.length === 0) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para agregar servicios incluidos y no incluidos...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {includes.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-green-600 mb-2">Incluye</h4>
          <ul className="space-y-1">
            {includes.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {includes.length > 4 && (
              <li className="text-sm text-muted-foreground">
                +{includes.length - 4} más...
              </li>
            )}
          </ul>
        </div>
      )}

      {excludes.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-red-600 mb-2">No incluye</h4>
          <ul className="space-y-1">
            {excludes.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {excludes.length > 4 && (
              <li className="text-sm text-muted-foreground">
                +{excludes.length - 4} más...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
