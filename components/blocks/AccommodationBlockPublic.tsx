'use client';

import { AccommodationBlock } from '@/types/blocks';
import { Hotel, Star, Moon, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

interface AccommodationBlockPublicProps {
  block: AccommodationBlock;
}

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  hostel: 'Hostel',
  apartment: 'Apartamento',
  resort: 'Resort',
  cabin: 'Cabaña',
  camping: 'Camping',
  other: 'Alojamiento',
};

export function AccommodationBlockPublic({ block }: AccommodationBlockPublicProps) {
  const { name, category, type, nights, roomType, amenities, checkIn, checkOut, address, image, description } = block.data;

  if (!name) return null;

  return (
    <div className="bg-secondary/50 rounded-2xl overflow-hidden border border-border">
      {image && (
        <div className="relative h-48 md:h-64">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Hotel className="h-4 w-4" />
              {TYPE_LABELS[type]}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          </div>
          <div className="flex">
            {Array.from({ length: category }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Moon className="h-4 w-4" />
            {nights} {nights === 1 ? 'noche' : 'noches'}
          </span>
          {roomType && <span>• {roomType}</span>}
          {address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {address}
            </span>
          )}
        </div>

        {(checkIn || checkOut) && (
          <div className="flex gap-4 text-sm mb-4">
            {checkIn && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Check-in: {checkIn}
              </span>
            )}
            {checkOut && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Check-out: {checkOut}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="text-muted-foreground mb-4">{description}</p>
        )}

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, i) => (
              <span
                key={i}
                className="text-xs bg-background px-3 py-1.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
