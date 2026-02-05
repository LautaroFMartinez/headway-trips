'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Phone, Mail, Building2 } from 'lucide-react';
import type { ContentBlock } from '@/types/blocks';
import { Header } from '@/components/header';
import { ProposalHero } from './ProposalHero';
import { ProposalSidebar } from './ProposalSidebar';
import { ProposalAbout } from './sections/ProposalAbout';
import { ProposalServices } from './sections/ProposalServices';
import { ProposalAccommodation } from './sections/ProposalAccommodation';
import { ProposalItinerary } from './sections/ProposalItinerary';
import { ProposalPricing } from './sections/ProposalPricing';
import { ProposalGallery } from './sections/ProposalGallery';

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

  // Extraer datos de los bloques de contenido
  const servicesBlock = trip.contentBlocks?.find(b => b.type === 'services' && b.isVisible);
  const accommodationBlocks = trip.contentBlocks?.filter(b => b.type === 'accommodation' && b.isVisible) || [];
  const itineraryBlock = trip.contentBlocks?.find(b => b.type === 'itinerary' && b.isVisible);
  const priceBlock = trip.contentBlocks?.find(b => b.type === 'price' && b.isVisible);
  const textBlocks = trip.contentBlocks?.filter(b => b.type === 'text' && b.isVisible) || [];

  // Datos de servicios (del bloque o de los datos del trip)
  const includes = servicesBlock?.type === 'services' ? servicesBlock.data.includes : trip.includes || [];
  const excludes = servicesBlock?.type === 'services' ? servicesBlock.data.excludes : trip.excludes || [];

  // Generar código si no existe
  const tripCode = trip.code || trip.id.toUpperCase().slice(0, 10);

  // Contacto por defecto
  const defaultContact: ProposalContact = {
    name: 'Ramiro Martinez',
    email: 'info@headwaytrips.com',
    phone: '+54 9 11 1234-5678',
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
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Sobre el viaje */}
            <ProposalAbout
              description={trip.description}
              textBlocks={textBlocks}
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
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <ProposalSidebar
              sections={SECTIONS}
              pdfUrl={trip.pdfUrl}
              contact={displayContact}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-40">
        {trip.pdfUrl && (
          <a
            href={trip.pdfUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Descargar PDF
          </a>
        )}
        <a
          href={`https://wa.me/${displayContact.phone.replace(/\D/g, '')}?text=Hola! Me interesa el viaje ${trip.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Phone className="w-5 h-5" />
          WhatsApp
        </a>
      </div>

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
