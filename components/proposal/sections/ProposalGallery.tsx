'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProposalGalleryProps {
  images: string[];
  title: string;
  onClose: () => void;
}

export function ProposalGallery({ images, title, onClose }: ProposalGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-white/70 text-sm">
            {currentIndex + 1} de {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Imagen principal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
          <Image
            src={images[currentIndex]}
            alt={`${title} - ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Botones de navegación */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
