'use client';

import { ActivityBlock } from '@/types/blocks';
import { Map, Clock, MapPin, Check } from 'lucide-react';
import Image from 'next/image';

interface ActivityBlockPublicProps {
  block: ActivityBlock;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: 'Fácil', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  moderate: { label: 'Moderado', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  challenging: { label: 'Desafiante', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  extreme: { label: 'Extremo', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
};

export function ActivityBlockPublic({ block }: ActivityBlockPublicProps) {
  const { name, description, duration, difficulty, included, location, image, equipment, notes } = block.data;

  if (!name) return null;

  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="bg-secondary/50 rounded-2xl overflow-hidden border border-border">
      {image && (
        <div className="relative h-48">
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
              <Map className="h-4 w-4" />
              Actividad
            </div>
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          </div>
          {included && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
              <Check className="h-3 w-3" />
              Incluido
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {duration && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {duration}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full ${difficultyConfig.color}`}>
            {difficultyConfig.label}
          </span>
        </div>

        {description && (
          <p className="text-muted-foreground mb-4">{description}</p>
        )}

        {equipment && equipment.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground mb-2">Equipamiento necesario:</p>
            <div className="flex flex-wrap gap-2">
              {equipment.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-background px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {notes && (
          <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-4">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}
