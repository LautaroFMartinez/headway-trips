'use client';

import { GalleryBlock } from '@/types/blocks';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryBlockPublicProps {
  block: GalleryBlock;
}

export function GalleryBlockPublic({ block }: GalleryBlockPublicProps) {
  const { images, layout, columns } = block.data;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );

  return (
    <>
      <div className={cn('grid gap-4', gridCols[columns])}>
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
          >
            <Image
              src={image.url}
              alt={image.alt || `Imagen ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-[4/3] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || ''}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images[lightboxIndex].caption && (
            <p className="absolute bottom-8 left-0 right-0 text-center text-white/80">
              {images[lightboxIndex].caption}
            </p>
          )}

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
