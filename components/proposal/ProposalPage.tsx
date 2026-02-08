'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Phone, Mail, Building2 } from 'lucide-react';
import type { ContentBlock, TextBlock, HeadingBlock, AccommodationBlock, CancellationPolicyBlock } from '@/types/blocks';
import { Header } from '@/components/header';
import { ProposalHero } from './ProposalHero';
import { ProposalSidebar } from './ProposalSidebar';
import { ProposalAbout } from './sections/ProposalAbout';
import { ProposalServices } from './sections/ProposalServices';
import { ProposalAccommodation } from './sections/ProposalAccommodation';
import { ProposalItinerary } from './sections/ProposalItinerary';
import { ProposalPricing } from './sections/ProposalPricing';
import { ProposalCancellation } from './sections/ProposalCancellation';
import { ProposalGallery } from './sections/ProposalGallery';
import { BookingModal } from '@/components/booking/BookingModal';

export interface ProposalTrip {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  duration: string;
  durationDays: number;
  startDate?: string;
  endDate?: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  price: string;
  priceValue: number;
  includes?: string[];
  excludes?: string[];
  contentBlocks?: ContentBlock[];
  pdfUrl?: string;
  maxCapacity?: number;
  currentBookings?: number;
  departureDate?: string;
}

export interface ProposalContact {
  name: string;
  email: string;
  phone: string;
  company: string;
  logo?: string;
}

interface ProposalPageProps {
  trip: ProposalTrip;
  contact?: ProposalContact;
  isAdmin?: boolean;
}

// Secciones del sidebar para navegación
const SECTIONS = [
  { id: 'sobre-el-viaje', label: 'Sobre el viaje' },
  { id: 'servicios-incluidos', label: 'Servicios incluidos' },
  { id: 'alojamiento', label: 'Alojamiento' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'precios', label: 'Precios' },
];

export function ProposalPage({ trip, contact, isAdmin = false }: ProposalPageProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const canBook = trip.maxCapacity != null && trip.currentBookings != null &&
    trip.maxCapacity - trip.currentBookings > 0;
  const handleBookingClick = canBook ? () => setShowBookingModal(true) : undefined;

  // Extraer datos de los bloques de contenido
  const servicesBlock = trip.contentBlocks?.find(b => b.type === 'services' && b.isVisible);
  const accommodationBlocks = (trip.contentBlocks?.filter(b => b.type === 'accommodation' && b.isVisible) || []) as AccommodationBlock[];
  const itineraryBlock = trip.contentBlocks?.find(b => b.type === 'itinerary' && b.isVisible);
  const priceBlock = trip.contentBlocks?.find(b => b.type === 'price' && b.isVisible);
  const contentTextBlocks = (trip.contentBlocks?.filter(b => (b.type === 'text' || b.type === 'heading') && b.isVisible) || []) as (TextBlock | HeadingBlock)[];
  const cancellationBlock = trip.contentBlocks?.find(b => b.type === 'cancellation_policy' && b.isVisible) as CancellationPolicyBlock | undefined;

  // Datos de servicios (del bloque o de los datos del trip)
  const includes = servicesBlock?.type === 'services' ? servicesBlock.data.includes : trip.includes || [];
  const excludes = servicesBlock?.type === 'services' ? servicesBlock.data.excludes : trip.excludes || [];

  // Generar código si no existe
  const tripCode = trip.code || trip.id.toUpperCase().slice(0, 10);

  // Contacto por defecto
  const defaultContact: ProposalContact = {
    name: 'Headway Trips',
    email: 'contacto@headwaytrips.com',
    phone: '+525527118391',
    company: 'Headway Trips',
    logo: '/icono.png',
  };
  const displayContact = contact || defaultContact;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del sitio */}
      <Header />

      {/* Header adicional para admin */}
      {isAdmin && (
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link
              href={`/admin/viajes`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver al editor</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Vista previa
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - con padding-top para el header fijo */}
      <ProposalHero
        title={trip.title}
        code={tripCode}
        duration={trip.duration}
        durationDays={trip.durationDays}
        startDate={trip.startDate}
        endDate={trip.endDate}
        heroImage={trip.heroImage}
        gallery={trip.gallery}
        companyLogo={displayContact.logo}
        onViewGallery={() => setShowGallery(true)}
        maxCapacity={trip.maxCapacity}
        currentBookings={trip.currentBookings}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Sobre el viaje */}
            <ProposalAbout
              description={trip.description}
              contentBlocks={contentTextBlocks}
            />

            {/* Servicios incluidos */}
            {(includes.length > 0 || excludes.length > 0) && (
              <ProposalServices
                includes={includes}
                excludes={excludes}
              />
            )}

            {/* Alojamiento */}
            {accommodationBlocks.length > 0 && (
              <ProposalAccommodation blocks={accommodationBlocks} />
            )}

            {/* Itinerario */}
            {itineraryBlock?.type === 'itinerary' && (
              <ProposalItinerary
                days={itineraryBlock.data.days}
                startDate={trip.startDate}
              />
            )}

            {/* Precios */}
            <ProposalPricing
              priceBlock={priceBlock?.type === 'price' ? priceBlock : undefined}
              defaultPrice={trip.priceValue}
              defaultPriceFormatted={trip.price}
            />

            {/* Política de cancelación */}
            {cancellationBlock && (
              <ProposalCancellation block={cancellationBlock} />
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <ProposalSidebar
              sections={SECTIONS}
              tripId={trip.id}
              contact={displayContact}
              maxCapacity={trip.maxCapacity}
              currentBookings={trip.currentBookings}
              price={trip.price}
              onBookingClick={handleBookingClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
        {trip.maxCapacity != null && trip.currentBookings != null && (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-gray-500">
              {Math.max(0, trip.maxCapacity - trip.currentBookings)} cupos disponibles
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trip.maxCapacity - trip.currentBookings <= 0
                ? 'bg-red-100 text-red-700'
                : trip.maxCapacity - trip.currentBookings <= 3
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
            }`}>
              {trip.maxCapacity - trip.currentBookings <= 0 ? 'Agotado' : trip.price}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <a
            href={trip.pdfUrl || `/api/trips/${trip.id}/pdf`}
            download={!trip.pdfUrl}
            target={trip.pdfUrl ? '_blank' : undefined}
            rel={trip.pdfUrl ? 'noopener noreferrer' : undefined}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            PDF
          </a>
          <a
            href={`https://wa.me/${displayContact.phone.replace(/\D/g, '')}?text=Hola! Me interesa el viaje ${trip.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={handleBookingClick}
            disabled={!canBook}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-semibold text-sm ${
              canBook
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-primary/40 text-white cursor-not-allowed'
            }`}
          >
            {canBook ? 'Reservar' : 'Sin cupos'}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {trip.maxCapacity != null && trip.currentBookings != null && (
        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          tripId={trip.id}
          tripTitle={trip.title}
          priceValue={trip.priceValue}
          priceFormatted={trip.price}
          maxCapacity={trip.maxCapacity}
          currentBookings={trip.currentBookings}
        />
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <ProposalGallery
          images={[trip.heroImage, ...(trip.gallery || [])]}
          title={trip.title}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16 lg:mb-0 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {displayContact.logo && (
                <Image
                  src={displayContact.logo}
                  alt={displayContact.company}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              )}
              <span className="text-gray-600 font-medium">{displayContact.company}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href={`mailto:${displayContact.email}`} className="flex items-center gap-2 hover:text-gray-700">
                <Mail className="w-4 h-4" />
                {displayContact.email}
              </a>
              <a href={`tel:${displayContact.phone}`} className="flex items-center gap-2 hover:text-gray-700">
                <Phone className="w-4 h-4" />
                {displayContact.phone}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
