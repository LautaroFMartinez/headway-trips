import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ContentBlock, ItineraryBlock, ServicesBlock, PriceBlock, AccommodationBlock, ActivityBlock, FlightBlock, TransportBlock } from '@/types/blocks';

// Register fonts (using system fonts for simplicity)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontStyle: 'italic' },
  ],
});

const colors = {
  primary: '#0f766e',
  primaryLight: '#14b8a6',
  secondary: '#7c3aed',
  text: '#18181b',
  textMuted: '#71717a',
  textLight: '#a1a1aa',
  border: '#e4e4e7',
  background: '#f4f4f5',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#eab308',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoSubtitle: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    textAlign: 'right',
  },
  headerDate: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Hero section
  heroSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  // Info boxes
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 6,
  },
  infoLabel: {
    fontSize: 8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Description
  description: {
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.text,
    marginBottom: 30,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  // Itinerary
  dayCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dayTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginLeft: 8,
  },
  dayMeals: {
    flexDirection: 'row',
    gap: 4,
  },
  mealBadge: {
    fontSize: 7,
    backgroundColor: colors.primaryLight,
    color: colors.white,
    padding: '2 6',
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
    gap: 20,
  },
  servicesColumn: {
    flex: 1,
  },
  servicesSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  serviceIcon: {
    fontSize: 10,
    marginRight: 6,
    marginTop: 1,
  },
  serviceText: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
  },
  includeIcon: {
    color: colors.success,
  },
  excludeIcon: {
    color: '#ef4444',
  },
  // Price
  priceSection: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  priceTitle: {
    fontSize: 12,
    color: colors.white,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  priceNote: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  // Accommodation
  accommodationCard: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    marginBottom: 12,
  },
  accommodationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  accommodationDetails: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Activity
  activityCard: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    marginBottom: 12,
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
    gap: 12,
    marginTop: 6,
  },
  activityMetaItem: {
    fontSize: 8,
    color: colors.textMuted,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
}

interface TripPdfDocumentProps {
  trip: TripData;
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Helper to get meal abbreviations
function getMealBadges(meals: { breakfast: boolean; lunch: boolean; dinner: boolean }) {
  const badges = [];
  if (meals.breakfast) badges.push('D');
  if (meals.lunch) badges.push('A');
  if (meals.dinner) badges.push('C');
  return badges;
}

export function TripPdfDocument({ trip }: TripPdfDocumentProps) {
  const today = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extract data from content_blocks if available
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Headway Trips</Text>
            <Text style={styles.logoSubtitle}>Viajes personalizados a medida</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Propuesta generada el</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>{trip.title}</Text>
          {trip.subtitle && <Text style={styles.subtitle}>{trip.subtitle}</Text>}
        </View>

        {/* Info Boxes */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Duración</Text>
            <Text style={styles.infoValue}>{trip.duration || `${trip.durationDays || 1} días`}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Precio desde</Text>
            <Text style={styles.infoValue}>
              {priceBlock ? `${priceBlock.data.currency} $${priceBlock.data.basePrice.toLocaleString()}` : trip.price || 'Consultar'}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Destino</Text>
            <Text style={styles.infoValue}>{trip.region || 'Sudamérica'}</Text>
          </View>
        </View>

        {/* Description */}
        {trip.description && (
          <Text style={styles.description}>{stripHtml(trip.description)}</Text>
        )}

        {/* Itinerary from content_blocks */}
        {itineraryDays.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerario Día por Día</Text>
            {itineraryDays.map((day) => (
              <View key={day.id} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayNumber}>Día {day.dayNumber}</Text>
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
            <Text style={styles.sectionTitle}>Itinerario</Text>
            {legacyItinerary.map((item, index) => (
              <View key={index} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayNumber}>Día {item.day || index + 1}</Text>
                </View>
                <Text style={styles.dayDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Accommodations */}
        {accommodationBlocks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alojamiento</Text>
            {accommodationBlocks.map((block) => (
              <View key={block.id} style={styles.accommodationCard}>
                <Text style={styles.accommodationName}>
                  {block.data.name} {'★'.repeat(block.data.category)}
                </Text>
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
            <Text style={styles.sectionTitle}>Actividades</Text>
            {activityBlocks.map((block) => (
              <View key={block.id} style={styles.activityCard}>
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

        {/* Services */}
        {(includes.length > 0 || excludes.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios</Text>
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

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>Headway Trips - Viajes personalizados a medida</Text>
            <Link src="https://headwaytrips.com" style={styles.footerLink}>
              www.headwaytrips.com
            </Link>
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Second page for flights and transports if needed */}
      {(flightBlocks.length > 0 || transportBlocks.length > 0) && (
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.logo}>Headway Trips</Text>
              <Text style={styles.logoSubtitle}>Viajes personalizados a medida</Text>
            </View>
          </View>

          {/* Flights */}
          {flightBlocks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vuelos</Text>
              {flightBlocks.map((block) => (
                <View key={block.id}>
                  {block.data.segments.map((segment) => (
                    <View key={segment.id} style={styles.accommodationCard}>
                      <Text style={styles.accommodationName}>
                        {segment.airline} - {segment.flightNumber}
                      </Text>
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
              <Text style={styles.sectionTitle}>Traslados</Text>
              {transportBlocks.map((block) => (
                <View key={block.id} style={styles.accommodationCard}>
                  <Text style={styles.accommodationName}>
                    {block.data.origin} → {block.data.destination}
                  </Text>
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

          {/* Footer */}
          <View style={styles.footer} fixed>
            <View>
              <Text style={styles.footerText}>Headway Trips - Viajes personalizados a medida</Text>
              <Link src="https://headwaytrips.com" style={styles.footerLink}>
                www.headwaytrips.com
              </Link>
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
}
