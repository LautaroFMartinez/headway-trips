'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Download, Calendar, MapPin, Clock, MessageCircle, FileText } from 'lucide-react';
import type { Trip } from '@/lib/trips-data';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ShareButtons } from '@/components/share-buttons';
import { ImageGallery } from '@/components/image-gallery';

interface TripDetailClientProps {
  trip: Trip;
}

export function TripDetailClient({ trip }: TripDetailClientProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/icono.png" 
              alt="Headway Trips Logo" 
              width={36} 
              height={36} 
              className="object-contain" 
              priority 
            />
            <span className="text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
          <Link 
            href="/#destinos" 
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todos los destinos
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] mt-[72px]">
        <Image 
          src={trip.heroImage || '/placeholder.svg'} 
          alt={trip.title} 
          fill 
          priority 
          className="object-cover" 
          sizes="100vw" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <span className="inline-block text-white/80 text-sm uppercase tracking-widest mb-2">
              {trip.subtitle}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {trip.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Destinos', href: '/#destinos' }, 
              { label: trip.title }
            ]} 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Sobre este viaje</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{trip.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Destacados del viaje</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {trip.highlights.map((highlight, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-3 text-foreground"
                  >
                    <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <ImageGallery 
              images={[trip.heroImage, trip.image].filter(Boolean)} 
              title={trip.title} 
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-sm bg-secondary text-muted-foreground px-3 py-1.5 rounded-lg capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* PDF Section */}
            {trip.pdfUrl && (
              <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Itinerario Completo</h3>
                <p className="text-muted-foreground mb-6">
                  Consulta el itinerario detallado del viaje: dia por dia, servicios incluidos y mas.
                </p>

                <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                  <iframe 
                    src={`${trip.pdfUrl}#toolbar=1&navpanes=0`} 
                    className="w-full h-[500px] md:h-[600px]" 
                    title={`Itinerario de ${trip.title}`} 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={trip.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Abrir en nueva pestaña
                  </a>
                  <a 
                    href={trip.pdfUrl} 
                    download 
                    className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-3xl font-bold text-foreground mb-1">{trip.price}</p>
                <p className="text-muted-foreground text-sm mb-6">por persona</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{trip.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Salidas programadas</span>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/5491112345678?text=Hola! Me interesa el viaje a ${trip.title}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>

                <Link 
                  href="/#destinos" 
                  className="flex items-center justify-center gap-2 w-full border border-border text-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a destinos
                </Link>
              </div>

              <ShareButtons 
                title={`${trip.title} - Headway Trips`} 
                url={`https://headwaytrips.com/viaje/${trip.id}`} 
              />

              <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tenes dudas sobre este viaje? Contactanos por WhatsApp o email y te asesoramos sin compromiso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary-foreground/70 text-sm">
            2025 Headway Trips. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
