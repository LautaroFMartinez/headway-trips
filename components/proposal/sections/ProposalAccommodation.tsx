'use client';

import Image from 'next/image';
import { Star, MapPin, Bed, Coffee, Moon, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { AccommodationBlock } from '@/types/blocks';

interface ProposalAccommodationProps {
  blocks: AccommodationBlock[];
}

const ACCOMMODATION_TYPES: Record<string, string> = {
  hotel: 'Hotel',
  hostel: 'Hostel',
  apartment: 'Apartamento',
  resort: 'Resort',
  cabin: 'Cabaña',
  camping: 'Camping',
  other: 'Otro',
};

export function ProposalAccommodation({ blocks }: ProposalAccommodationProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="alojamiento" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Alojamiento</h2>

      <div className="space-y-4">
        {blocks.map((block) => {
          const isExpanded = expandedId === block.id;
          const accommodation = block.data;

          return (
            <div
              key={block.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Imagen */}
                {accommodation.image && (
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
                    <Image
                      src={accommodation.image}
                      alt={accommodation.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                    {/* Badge de noches */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Moon className="w-3 h-3" />
                      {accommodation.nights}
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{accommodation.name}</h3>
                      {accommodation.address && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {accommodation.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estrellas y tipo */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: accommodation.category }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {ACCOMMODATION_TYPES[accommodation.type]}
                    </span>
                  </div>

                  {/* Detalles */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    {accommodation.roomType && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-gray-400" />
                        {accommodation.roomType}
                      </span>
                    )}
                    {accommodation.checkIn && (
                      <span className="flex items-center gap-1">
                        <Coffee className="w-4 h-4 text-gray-400" />
                        Check-in: {accommodation.checkIn}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Moon className="w-4 h-4 text-gray-400" />
                      {accommodation.nights} noches
                    </span>
                  </div>

                  {/* Amenities */}
                  {accommodation.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {accommodation.amenities.slice(0, 4).map((amenity, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {accommodation.amenities.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{accommodation.amenities.length - 4} más
                        </span>
                      )}
                    </div>
                  )}

                  {/* Botón ver descripción */}
                  {accommodation.description && (
                    <button
                      onClick={() => toggleExpand(block.id)}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-3 transition-colors"
                    >
                      Ver descripción
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Descripción expandida */}
              {isExpanded && accommodation.description && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                  <p className="text-sm text-gray-600 pt-3">{accommodation.description}</p>
                </div>
              )}

              {/* Link a Google Maps */}
              {accommodation.address && (
                <div className="px-4 pb-3 border-t border-gray-100 pt-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <MapPin className="w-3 h-3" />
                    Ver ubicación
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
