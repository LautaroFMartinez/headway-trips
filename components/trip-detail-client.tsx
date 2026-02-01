'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image src="/1.png" alt="Headway Trips Logo" width={44} height={44} className="object-contain" priority />
            <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
          <Link href="/#destinos" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ver todos los destinos
          </Link>
        </div>
      </motion.header>

      {/* Hero Image */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] mt-[72px]">
        <Image src={trip.heroImage || '/placeholder.svg'} alt={trip.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-primary-foreground/90 text-sm uppercase tracking-widest font-medium mb-2">{trip.subtitle}</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background">{trip.title}</h1>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumbs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
          <Breadcrumbs items={[{ label: 'Destinos', href: '/#destinos' }, { label: trip.title }]} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Sobre este viaje</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{trip.description}</p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Destacados del viaje</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {trip.highlights.map((highlight, index) => (
                  <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="flex items-center gap-3 text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <ImageGallery images={[trip.heroImage, trip.image].filter(Boolean)} title={trip.title} />
            </motion.div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span key={tag} className="text-sm bg-secondary text-muted-foreground px-3 py-1.5 rounded-full capitalize">
                  {tag}
                </span>
              ))}
            </div>

            {/* PDF Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-secondary rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Itinerario Completo</h3>
              <p className="text-muted-foreground mb-6">Descargá el PDF con toda la información detallada del viaje: itinerario día por día, servicios incluidos, condiciones y más.</p>

              {/* PDF Preview */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6 min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center">
                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                  <div className="w-16 h-20 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-primary/30">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-foreground font-medium mb-1">Itinerario_{trip.title.replace(/\s/g, '_')}.pdf</p>
                  <p className="text-xs text-muted-foreground">Hacé click para descargar el documento</p>
                </motion.div>
              </div>

              <a href={`/pdfs/${trip.id}.pdf`} download className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105">
                <Download className="w-4 h-4" />
                Descargar PDF
              </a>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <p className="text-3xl font-bold text-foreground mb-1">{trip.price}</p>
                <p className="text-muted-foreground text-sm mb-6">por persona</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{trip.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Salidas programadas</span>
                  </div>
                </div>

                <a href={`https://wa.me/5411123456789?text=Hola! Me interesa el viaje a ${trip.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 mb-3">
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>

                <Link href="/#destinos" className="flex items-center justify-center gap-2 w-full border border-border text-foreground py-3.5 rounded-full font-medium hover:bg-secondary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a destinos
                </Link>
              </div>

              <ShareButtons title={`${trip.title} - Headway Trips`} url={`https://headwaytrips.com/viaje/${trip.id}`} />

              <div className="bg-secondary/50 rounded-2xl p-5 sm:p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">¿Tenés dudas sobre este viaje? Contactanos por WhatsApp o email y te asesoramos sin compromiso.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-background/50 text-sm">© 2026 Headway Trips. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
