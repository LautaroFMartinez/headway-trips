'use client';

import Image from 'next/image';
import { Images, Calendar } from 'lucide-react';

interface ProposalHeroProps {
  title: string;
  code: string;
  duration: string;
  durationDays: number;
  startDate?: string;
  endDate?: string;
  heroImage: string;
  gallery?: string[];
  companyLogo?: string;
  onViewGallery: () => void;
}

export function ProposalHero({
  title,
  code,
  duration,
  durationDays,
  startDate,
  endDate,
  heroImage,
  gallery = [],
  companyLogo,
  onViewGallery,
}: ProposalHeroProps) {
  const allImages = [heroImage, ...gallery].filter(Boolean);
  const displayImages = allImages.slice(0, 4);
  const hasMoreImages = allImages.length > 4;

  // Formatear fechas si existen
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const dateRange = formattedStartDate && formattedEndDate
    ? `${formattedStartDate} - ${formattedEndDate}`
    : null;

  return (
    <div className="bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header con logo y título */}
        <div className="flex items-start gap-4 mb-6">
          {companyLogo && (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={companyLogo}
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{code}</span>
              <span className="text-gray-300">|</span>
              <span>{durationDays} días</span>
              {dateRange && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {dateRange}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Galería de imágenes estilo MOGU */}
        <div className="relative">
          {displayImages.length === 1 ? (
            // Una sola imagen
            <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-xl overflow-hidden">
              <Image
                src={displayImages[0]}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          ) : displayImages.length === 2 ? (
            // Dos imágenes
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {displayImages.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`${title} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 640px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Tres o más imágenes - Layout estilo MOGU
            <div className="grid grid-cols-4 grid-rows-2 gap-2 lg:gap-3 h-[300px] lg:h-[400px]">
              {/* Imagen principal grande */}
              <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden">
                <Image
                  src={displayImages[0]}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 50vw, 640px"
                  priority
                />
              </div>
              {/* Imágenes secundarias */}
              {displayImages.slice(1, 4).map((img, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden ${
                    i === 2 && hasMoreImages ? 'cursor-pointer' : ''
                  }`}
                  onClick={i === 2 && hasMoreImages ? onViewGallery : undefined}
                >
                  <Image
                    src={img}
                    alt={`${title} - ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 25vw, 320px"
                  />
                  {/* Overlay con contador si hay más imágenes */}
                  {i === 2 && hasMoreImages && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{allImages.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Botón Ver galería */}
          {allImages.length > 1 && (
            <button
              onClick={onViewGallery}
              className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-white transition-colors"
            >
              <Images className="w-4 h-4" />
              Ver galería
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
