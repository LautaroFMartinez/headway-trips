'use client';

import { ImageBlock } from '@/types/blocks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ImageBlockRendererProps {
  block: ImageBlock;
}

const SIZE_CLASSES = {
  small: 'max-w-xs',
  medium: 'max-w-md',
  large: 'max-w-2xl',
  full: 'max-w-full',
};

const ALIGNMENT_CLASSES = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

export function ImageBlockRenderer({ block }: ImageBlockRendererProps) {
  const { url, alt, caption, size, alignment } = block.data;

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar una imagen...
        </p>
      </div>
    );
  }

  return (
    <figure
      className={cn(
        'space-y-2',
        SIZE_CLASSES[size],
        ALIGNMENT_CLASSES[alignment]
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={url}
          alt={alt || 'Imagen'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
