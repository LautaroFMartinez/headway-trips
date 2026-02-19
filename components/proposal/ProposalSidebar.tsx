'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Phone, Mail, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProposalContact } from './ProposalPage';
import { SpotsIndicator } from './SpotsIndicator';

interface Section {
  id: string;
  label: string;
}

interface ProposalSidebarProps {
  sections: Section[];
  tripId: string;
  pdfUrl?: string;
  contact: ProposalContact;
  maxCapacity?: number;
  currentBookings?: number;
  price?: string;
  onBookingClick?: () => void;
}

export function ProposalSidebar({ sections, tripId, pdfUrl, contact, maxCapacity, currentBookings, price, onBookingClick }: ProposalSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [contactExpanded, setContactExpanded] = useState(true);

  // Observer para detectar sección activa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* Botón Descargar PDF: externo (Supabase) → nueva pestaña; generado por API → descarga */}
      <a
        href={pdfUrl || `/api/trips/${tripId}/pdf`}
        download={!pdfUrl}
        target={pdfUrl ? '_blank' : undefined}
        rel={pdfUrl ? 'noopener noreferrer' : undefined}
        className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-md"
      >
        <Download className="w-5 h-5" />
        Descargar PDF
      </a>

      {/* Reserva y cupos */}
      {maxCapacity != null && currentBookings != null && (
        <SpotsIndicator variant="card" maxCapacity={maxCapacity} currentBookings={currentBookings} price={price} onBookingClick={onBookingClick} />
      )}

      {/* Navegación por secciones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <nav className="divide-y divide-gray-100">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'text-primary bg-primary/5 border-l-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Card de contacto */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setContactExpanded(!contactExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <span>¿Necesitas ayuda?</span>
          {contactExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {contactExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
            {/* Contacto */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tu contacto</p>
                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
              </div>
            </div>

            {/* Empresa */}
            <div className="flex items-center gap-3">
              {contact.logo ? (
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src={contact.logo}
                    alt={contact.company}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-700">{contact.company}</p>
            </div>

            {/* Email */}
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <span className="truncate">{contact.email}</span>
            </a>

            {/* Teléfono */}
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <span>{contact.phone}</span>
            </a>

            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mt-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
