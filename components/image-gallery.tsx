'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl font-semibold mb-4">Galería de fotos</h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="relative aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-border group" onClick={() => setCurrentImageIndex(index)}>
                <Image src={image} alt={`${title} - Foto ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none h-[80vh] flex items-center justify-center">
              <DialogTitle className="sr-only">Galería de imágenes: {title}</DialogTitle>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image src={images[currentImageIndex]} alt={`${title} - Foto ${currentImageIndex + 1}`} fill className="object-contain" priority />

                {/* Navigation Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
                  >
                    <ChevronLeft className="w-8 h-8" />
                    <span className="sr-only">Anterior</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
                  >
                    <ChevronRight className="w-8 h-8" />
                    <span className="sr-only">Siguiente</span>
                  </Button>
                </div>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
