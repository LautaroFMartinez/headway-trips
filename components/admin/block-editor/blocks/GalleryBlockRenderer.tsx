'use client';

import { GalleryBlock } from '@/types/blocks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Images } from 'lucide-react';

interface GalleryBlockRendererProps {
  block: GalleryBlock;
}

export function GalleryBlockRenderer({ block }: GalleryBlockRendererProps) {
  const { images, layout, columns } = block.data;

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <Images className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar imágenes a la galería...
        </p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid gap-2',
        gridCols[columns]
      )}
    >
      {images.slice(0, 6).map((image) => (
        <div
          key={image.id}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <Image
            src={image.url}
            alt={image.alt || 'Imagen de galería'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
      {images.length > 6 && (
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <span className="text-lg font-semibold text-muted-foreground">
            +{images.length - 6}
          </span>
        </div>
      )}
    </div>
  );
}
