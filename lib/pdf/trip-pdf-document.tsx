import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';
import { ContentBlock, ItineraryBlock, ServicesBlock, PriceBlock, AccommodationBlock, ActivityBlock, FlightBlock, TransportBlock } from '@/types/blocks';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontStyle: 'italic' },
  ],
});

// Brand colors
const colors = {
  primary: '#0f766e',
  primaryLight: '#14b8a6',
  primaryDark: '#0d6560',
  secondary: '#7c3aed',
  text: '#18181b',
  textMuted: '#71717a',
  textLight: '#a1a1aa',
  border: '#e4e4e7',
  background: '#f4f4f5',
  backgroundLight: '#fafafa',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
};

// Site URL for absolute paths
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

/**
 * Converts relative URLs to absolute URLs for PDF rendering.
 * React-PDF requires absolute URLs for remote images.
 */
function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
  },
  // Hero section with image
  heroContainer: {
    position: 'relative',
    height: 220,
    backgroundColor: colors.primaryDark,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    objectFit: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Header with logo
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16 40',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoSubtext: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerRight: {
    textAlign: 'right',
  },
  headerDate: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Content area
  content: {
    padding: '24 40',
  },
  // Info boxes row
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 8,
  },
  infoBoxPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoLabelLight: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoValueLight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  // Gallery section
  galleryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  galleryImage: {
    flex: 1,
    height: 100,
    borderRadius: 6,
    objectFit: 'cover',
  },
  // Description
  description: {
    fontSize: 11,
    lineHeight: 1.7,
    color: colors.text,
    marginBottom: 24,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Itinerary
  dayCard: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  dayBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  dayTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginLeft: 10,
  },
  dayMeals: {
    flexDirection: 'row',
    gap: 4,
  },
  mealBadge: {
    fontSize: 7,
    backgroundColor: colors.primaryLight,
    color: colors.white,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  dayDescription: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.text,
  },
  // Services
  servicesRow: {
    flexDirection: 'row',
    gap: 24,
  },
  servicesColumn: {
    flex: 1,
  },
  servicesSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  serviceIcon: {
    fontSize: 10,
    marginRight: 8,
    marginTop: 1,
    width: 12,
  },
  serviceText: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
    lineHeight: 1.4,
  },
  includeIcon: {
    color: colors.success,
  },
  excludeIcon: {
    color: colors.error,
  },
  // Accommodation
  accommodationCard: {
    padding: 14,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accommodationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  accommodationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  accommodationStars: {
    fontSize: 10,
    color: colors.warning,
  },
  accommodationDetails: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  // Activity
  activityCard: {
    padding: 14,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 10,
  },
  activityName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  activityMetaItem: {
    fontSize: 8,
    color: colors.textMuted,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '14 40',
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLogo: {
    width: 20,
    height: 20,
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 8,
    color: colors.primary,
    textDecoration: 'none',
  },
  pageNumber: {
    fontSize: 8,
    color: colors.textMuted,
  },
});

interface TripData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  duration?: string;
  durationDays?: number;
  price?: string;
  priceValue?: number;
  region?: string;
  includes?: string[];
  excludes?: string[];
  itinerary?: Array<{ day: number; description: string }>;
  content_blocks?: ContentBlock[];
  heroImage?: string | null;
  gallery?: string[];
}

export type { TripData };

interface TripPdfDocumentProps {
  trip: TripData;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function getMealBadges(meals: { breakfast: boolean; lunch: boolean; dinner: boolean }) {
  const badges = [];
  if (meals.breakfast) badges.push('Desayuno');
  if (meals.lunch) badges.push('Almuerzo');
  if (meals.dinner) badges.push('Cena');
  return badges;
}

export function TripPdfDocument({ trip }: TripPdfDocumentProps) {
  const today = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extract data from content_blocks
  const contentBlocks = trip.content_blocks || [];
  const itineraryBlock = contentBlocks.find((b): b is ItineraryBlock => b.type === 'itinerary');
  const servicesBlock = contentBlocks.find((b): b is ServicesBlock => b.type === 'services');
  const priceBlock = contentBlocks.find((b): b is PriceBlock => b.type === 'price');
  const accommodationBlocks = contentBlocks.filter((b): b is AccommodationBlock => b.type === 'accommodation');
  const activityBlocks = contentBlocks.filter((b): b is ActivityBlock => b.type === 'activity');
  const flightBlocks = contentBlocks.filter((b): b is FlightBlock => b.type === 'flight');
  const transportBlocks = contentBlocks.filter((b): b is TransportBlock => b.type === 'transport');

  // Use content_blocks data or fallback to legacy fields
  const includes = servicesBlock?.data.includes || trip.includes || [];
  const excludes = servicesBlock?.data.excludes || trip.excludes || [];
  const itineraryDays = itineraryBlock?.data.days || [];
  const legacyItinerary = trip.itinerary || [];

  // Prepare images
  const heroImageUrl = toAbsoluteUrl(trip.heroImage);
  const logoUrl = toAbsoluteUrl('/icono.png');
  const galleryImages = (trip.gallery || []).slice(0, 3).map(img => toAbsoluteUrl(img)).filter(Boolean) as string[];

  // Price display
  const displayPrice = priceBlock 
    ? `${priceBlock.data.currency} $${priceBlock.data.basePrice.toLocaleString()}`
    : trip.price || 'Consultar';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Hero Section with Image */}
        <View style={styles.heroContainer}>
          {heroImageUrl && (
            <Image src={heroImageUrl} style={styles.heroImage} />
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{trip.title}</Text>
            {trip.subtitle && <Text style={styles.heroSubtitle}>{trip.subtitle}</Text>}
          </View>
        </View>

        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {logoUrl && <Image src={logoUrl} style={styles.logoImage} />}
            <View>
              <Text style={styles.logoText}>Headway Trips</Text>
              <Text style={styles.logoSubtext}>Viajes personalizados a medida</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Propuesta generada el</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Boxes */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Duración</Text>
              <Text style={styles.infoValue}>{trip.duration || `${trip.durationDays || 1} días`}</Text>
            </View>
            <View style={styles.infoBoxPrimary}>
              <Text style={styles.infoLabelLight}>Precio desde</Text>
              <Text style={styles.infoValueLight}>{displayPrice}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Destino</Text>
              <Text style={styles.infoValue}>{trip.region || 'Sudamérica'}</Text>
            </View>
          </View>

          {/* Gallery (if available) */}
          {galleryImages.length > 0 && (
            <View style={styles.galleryContainer}>
              {galleryImages.map((imgUrl, index) => (
                <Image key={index} src={imgUrl} style={styles.galleryImage} />
              ))}
            </View>
          )}

          {/* Description */}
          {trip.description && (
            <Text style={styles.description}>{stripHtml(trip.description)}</Text>
          )}

          {/* Itinerary from content_blocks */}
          {itineraryDays.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Itinerario Día por Día</Text>
              </View>
              {itineraryDays.map((day) => (
                <View key={day.id} style={styles.dayCard} wrap={false}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>DÍA {day.dayNumber}</Text>
                    </View>
                    <Text style={styles.dayTitle}>{day.title}</Text>
                    <View style={styles.dayMeals}>
                      {getMealBadges(day.meals).map((badge, i) => (
                        <Text key={i} style={styles.mealBadge}>{badge}</Text>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.dayDescription}>{stripHtml(day.description)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Legacy Itinerary */}
          {itineraryDays.length === 0 && legacyItinerary.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Itinerario</Text>
              </View>
              {legacyItinerary.map((item, index) => (
                <View key={index} style={styles.dayCard} wrap={false}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>DÍA {item.day || index + 1}</Text>
                    </View>
                  </View>
                  <Text style={styles.dayDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Services */}
          {(includes.length > 0 || excludes.length > 0) && (
            <View style={styles.section} wrap={false}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Servicios</Text>
              </View>
              <View style={styles.servicesRow}>
                {includes.length > 0 && (
                  <View style={styles.servicesColumn}>
                    <Text style={styles.servicesSubtitle}>Incluye</Text>
                    {includes.map((item, index) => (
                      <View key={index} style={styles.serviceItem}>
                        <Text style={[styles.serviceIcon, styles.includeIcon]}>✓</Text>
                        <Text style={styles.serviceText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {excludes.length > 0 && (
                  <View style={styles.servicesColumn}>
                    <Text style={styles.servicesSubtitle}>No Incluye</Text>
                    {excludes.map((item, index) => (
                      <View key={index} style={styles.serviceItem}>
                        <Text style={[styles.serviceIcon, styles.excludeIcon]}>✗</Text>
                        <Text style={styles.serviceText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            {logoUrl && <Image src={logoUrl} style={styles.footerLogo} />}
            <View>
              <Text style={styles.footerText}>Headway Trips - Viajes personalizados a medida</Text>
              <Link src="https://headwaytrips.com" style={styles.footerLink}>
                www.headwaytrips.com
              </Link>
            </View>
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Second page for accommodations, activities, flights and transports */}
      {(accommodationBlocks.length > 0 || activityBlocks.length > 0 || flightBlocks.length > 0 || transportBlocks.length > 0) && (
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {logoUrl && <Image src={logoUrl} style={styles.logoImage} />}
              <View>
                <Text style={styles.logoText}>Headway Trips</Text>
                <Text style={styles.logoSubtext}>Viajes personalizados a medida</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>{trip.title}</Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Accommodations */}
            {accommodationBlocks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Alojamiento</Text>
                </View>
                {accommodationBlocks.map((block) => (
                  <View key={block.id} style={styles.accommodationCard} wrap={false}>
                    <View style={styles.accommodationHeader}>
                      <Text style={styles.accommodationName}>{block.data.name}</Text>
                      <Text style={styles.accommodationStars}>{'★'.repeat(block.data.category)}</Text>
                    </View>
                    <Text style={styles.accommodationDetails}>
                      {block.data.nights} noches • {block.data.roomType || 'Habitación estándar'}
                    </Text>
                    {block.data.amenities.length > 0 && (
                      <Text style={styles.accommodationDetails}>
                        Amenities: {block.data.amenities.join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Activities */}
            {activityBlocks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Actividades</Text>
                </View>
                {activityBlocks.map((block) => (
                  <View key={block.id} style={styles.activityCard} wrap={false}>
                    <Text style={styles.activityName}>{block.data.name}</Text>
                    <Text style={styles.activityDescription}>{stripHtml(block.data.description)}</Text>
                    <View style={styles.activityMeta}>
                      <Text style={styles.activityMetaItem}>Duración: {block.data.duration}</Text>
                      <Text style={styles.activityMetaItem}>Dificultad: {block.data.difficulty}</Text>
                      {block.data.included && <Text style={styles.activityMetaItem}>✓ Incluida</Text>}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Flights */}
            {flightBlocks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Vuelos</Text>
                </View>
                {flightBlocks.map((block) => (
                  <View key={block.id}>
                    {block.data.segments.map((segment) => (
                      <View key={segment.id} style={styles.accommodationCard} wrap={false}>
                        <View style={styles.accommodationHeader}>
                          <Text style={styles.accommodationName}>
                            {segment.airline} - {segment.flightNumber}
                          </Text>
                        </View>
                        <Text style={styles.accommodationDetails}>
                          {segment.origin} ({segment.originCode}) → {segment.destination} ({segment.destinationCode})
                        </Text>
                        <Text style={styles.accommodationDetails}>
                          Salida: {segment.departureDate} {segment.departureTime} • Llegada: {segment.arrivalDate} {segment.arrivalTime}
                        </Text>
                        <Text style={styles.accommodationDetails}>
                          Clase: {segment.class === 'economy' ? 'Económica' : segment.class === 'business' ? 'Ejecutiva' : segment.class}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Transports */}
            {transportBlocks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Traslados</Text>
                </View>
                {transportBlocks.map((block) => (
                  <View key={block.id} style={styles.accommodationCard} wrap={false}>
                    <View style={styles.accommodationHeader}>
                      <Text style={styles.accommodationName}>
                        {block.data.origin} → {block.data.destination}
                      </Text>
                    </View>
                    <Text style={styles.accommodationDetails}>
                      Tipo: {block.data.type} {block.data.company && `• ${block.data.company}`}
                    </Text>
                    {block.data.duration && (
                      <Text style={styles.accommodationDetails}>Duración: {block.data.duration}</Text>
                    )}
                    {block.data.included && (
                      <Text style={styles.accommodationDetails}>✓ Incluido en el paquete</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <View style={styles.footerLeft}>
              {logoUrl && <Image src={logoUrl} style={styles.footerLogo} />}
              <View>
                <Text style={styles.footerText}>Headway Trips - Viajes personalizados a medida</Text>
                <Link src="https://headwaytrips.com" style={styles.footerLink}>
                  www.headwaytrips.com
                </Link>
              </View>
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
}
