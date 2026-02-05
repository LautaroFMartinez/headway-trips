'use client';

import { PriceBlock } from '@/types/blocks';
import { Badge } from '@/components/ui/badge';

interface PriceBlockRendererProps {
  block: PriceBlock;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  ARS: '$',
  USD: 'US$',
  EUR: '€',
};

const PRICE_TYPE_LABELS: Record<string, string> = {
  per_person: 'por persona',
  per_group: 'por grupo',
  per_night: 'por noche',
};

export function PriceBlockRenderer({ block }: PriceBlockRendererProps) {
  const { basePrice, currency, priceType, options, notes } = block.data;

  if (basePrice === 0 && options.length === 0) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para configurar los precios...
      </p>
    );
  }

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">
          {symbol}
          {basePrice.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">
          {PRICE_TYPE_LABELS[priceType]}
        </span>
      </div>

      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.slice(0, 3).map((option) => (
            <Badge key={option.id} variant="outline">
              {option.name}: {symbol}
              {option.price.toLocaleString()}
            </Badge>
          ))}
          {options.length > 3 && (
            <Badge variant="secondary">+{options.length - 3} opciones</Badge>
          )}
        </div>
      )}

      {notes && (
        <p className="text-sm text-muted-foreground line-clamp-2">{notes}</p>
      )}
    </div>
  );
}
