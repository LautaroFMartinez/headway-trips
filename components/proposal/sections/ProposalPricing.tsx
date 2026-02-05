'use client';

import type { PriceBlock } from '@/types/blocks';

interface ProposalPricingProps {
  priceBlock?: PriceBlock;
  defaultPrice: number;
  defaultPriceFormatted: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  ARS: '$',
};

const PRICE_TYPE_LABELS: Record<string, string> = {
  per_person: 'por persona',
  per_group: 'por grupo',
  per_night: 'por noche',
};

export function ProposalPricing({ priceBlock, defaultPrice, defaultPriceFormatted }: ProposalPricingProps) {
  const formatPrice = (price: number, currency: string = 'USD') => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${currency} ${symbol} ${price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  };

  // Si hay bloque de precio, mostrar opciones
  if (priceBlock) {
    const { basePrice, currency, priceType, options, notes } = priceBlock.data;

    return (
      <section id="precios" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Precios</h2>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Precio principal */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Precio {PRICE_TYPE_LABELS[priceType]}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(basePrice, currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Opciones de precio */}
          {options.length > 0 && (
            <div className="divide-y divide-gray-100">
              {options.map((option) => (
                <div key={option.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{option.name}</p>
                    {option.description && (
                      <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(option.price, currency)}
                    </p>
                    {option.originalPrice && option.originalPrice > option.price && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(option.originalPrice, currency)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notas */}
          {notes && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Precio simple (sin bloque)
  return (
    <section id="precios" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Precios</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Precio por persona</p>
            <p className="text-2xl font-bold text-gray-900">{defaultPriceFormatted}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Incluye alojamiento, traslados y actividades especificadas en el itinerario.
        </p>
      </div>
    </section>
  );
}
