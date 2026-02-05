'use client';

import { ImageBlock } from '@/types/blocks';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageBlockPublicProps {
  block: ImageBlock;
}

const SIZE_CLASSES = {
  small: 'max-w-sm',
  medium: 'max-w-xl',
  large: 'max-w-3xl',
  full: 'max-w-full',
};

const ALIGNMENT_CLASSES = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

export function ImageBlockPublic({ block }: ImageBlockPublicProps) {
  const { url, alt, caption, size, alignment } = block.data;

  if (!url) return null;

  return (
    <figure
      className={cn(
        'space-y-3',
        SIZE_CLASSES[size],
        ALIGNMENT_CLASSES[alignment]
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src={url}
          alt={alt || 'Imagen del viaje'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
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
