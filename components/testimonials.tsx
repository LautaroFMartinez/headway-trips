'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, X, Play } from 'lucide-react';
import { testimonials, type Testimonial } from '@/lib/testimonials-data';
import { cn } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= rating ? 'fill-accent text-accent' : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-lg">
      {initials}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
      <BadgeCheck className="h-4 w-4" />
      Viajero verificado
    </span>
  );
}

interface LightboxProps {
  media: Testimonial['media'];
  onClose: () => void;
}

function Lightbox({ media, onClose }: LightboxProps) {
  if (!media) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-6 w-6" />
      </button>
      <div 
        className="relative max-w-4xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === 'image' ? (
          <Image
            src={media.url}
            alt={media.alt}
            width={1200}
            height={800}
            className="rounded-lg object-contain w-full h-auto max-h-[80vh]"
            priority
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            className="rounded-lg w-full max-h-[80vh]"
          />
        )}
        <p className="text-white/80 text-sm mt-2 text-center">{media.alt}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<Testimonial['media'] | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi || isPaused || lightboxMedia) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi, isPaused, lightboxMedia]);

  return (
    <>
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Lo que dicen nuestros <span className="font-serif italic text-primary">viajeros</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Miles de viajeros han confiado en nosotros para crear sus mejores recuerdos
            </p>
          </div>

          {/* Carousel */}
          <div 
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex -ml-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                  >
                    <div className="h-full p-4 md:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">

                      {/* Quote icon */}
                      <div className="mb-3">
                        <Quote className="h-6 w-6 text-accent/30 group-hover:text-accent/50 transition-colors" />
                      </div>

                      {/* Rating + Verified */}
                      <div className="flex items-center justify-between mb-3">
                        <StarRating rating={testimonial.rating} />
                        {testimonial.verified && <VerifiedBadge />}
                      </div>

                      {/* Text */}
                      <p className="text-foreground/90 mb-4 leading-relaxed line-clamp-4 flex-grow">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                        <Avatar name={testimonial.name} />
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                          {testimonial.tripSlug ? (
                            <Link 
                              href={`/viaje/${testimonial.tripSlug}`}
                              className="text-xs text-accent mt-1 hover:underline inline-block"
                            >
                              {testimonial.trip} →
                            </Link>
                          ) : (
                            <p className="text-xs text-accent mt-1">{testimonial.trip}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-secondary transition-colors hidden md:flex"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-secondary transition-colors hidden md:flex"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === selectedIndex
                    ? 'bg-accent w-6'
                    : 'bg-border hover:bg-muted-foreground/50'
                )}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <Lightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />
      )}
    </>
  );
}

export default Testimonials;
