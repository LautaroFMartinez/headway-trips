'use client';

import { PriceBlock } from '@/types/blocks';

interface PriceBlockPublicProps {
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

export function PriceBlockPublic({ block }: PriceBlockPublicProps) {
  const { basePrice, currency, priceType, options, notes } = block.data;

  if (basePrice === 0 && options.length === 0) return null;

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-primary">
          {symbol}
          {basePrice.toLocaleString()}
        </span>
        <span className="text-lg text-muted-foreground">
          {PRICE_TYPE_LABELS[priceType]}
        </span>
      </div>

      {options.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-sm font-medium text-foreground">Opciones disponibles:</p>
          <div className="grid gap-2">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between bg-background rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-foreground">{option.name}</p>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {symbol}
                    {option.price.toLocaleString()}
                  </p>
                  {option.originalPrice && option.originalPrice > option.price && (
                    <p className="text-sm text-muted-foreground line-through">
                      {symbol}
                      {option.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notes && (
        <p className="text-sm text-muted-foreground border-t border-border pt-4">
          {notes}
        </p>
      )}
    </div>
  );
}
