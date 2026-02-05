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

// Brand colors - Premium palette
const colors = {
  primary: '#0f766e',
  primaryLight: '#14b8a6',
  primaryDark: '#0d6560',
  accent: '#7c3aed',
  text: '#18181b',
  textMuted: '#71717a',
  textLight: '#a1a1aa',
  border: '#e4e4e7',
  background: '#f4f4f5',
  backgroundLight: '#fafafa',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  gold: '#d4a853',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

const styles = StyleSheet.create({
  // === COVER PAGE ===
  coverPage: {
    position: 'relative',
    backgroundColor: colors.primaryDark,
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    objectFit: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  coverContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 50,
  },
  coverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coverLogo: {
    width: 48,
    height: 48,
  },
  coverBrand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
  },
  coverTagline: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  coverCenter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  coverSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  coverMeta: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  coverMetaItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  coverMetaText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  coverFooter: {
    alignItems: 'center',
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.gold,
    marginBottom: 16,
  },
  coverProposal: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 6,
  },
  coverDate: {
    fontSize: 12,
    color: colors.white,
  },

  // === CONTENT PAGES ===
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16 40',
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoImage: {
    width: 28,
    height: 28,
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
  },
  content: {
    padding: '24 40',
  },

  // === ESSENCE SECTION ===
  essenceSection: {
    marginBottom: 32,
    textAlign: 'center',
  },
  essenceQuote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 1.6,
  },
  essenceStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  essenceStat: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    width: 100,
  },
  essenceStatIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  essenceStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  essenceStatLabel: {
    fontSize: 8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  essenceDescription: {
    fontSize: 11,
    lineHeight: 1.7,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // === HIGHLIGHTS ===
  highlightsSection: {
    marginBottom: 28,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  highlightText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 'bold',
  },

  // === SECTION ===
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 10,
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  // === ITINERARY ===
  dayCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12,
  },
  dayNumber: {
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 12,
  },
  dayNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dayTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
  },
  dayMeals: {
    flexDirection: 'row',
    gap: 4,
  },
  mealBadge: {
    fontSize: 7,
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  dayContent: {
    padding: 14,
    backgroundColor: colors.backgroundLight,
  },
  dayDescription: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.text,
  },

  // === SERVICES ===
  servicesContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  servicesColumn: {
    flex: 1,
  },
  servicesSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  serviceIcon: {
    fontSize: 12,
    width: 18,
    marginTop: 1,
  },
  includeIcon: {
    color: colors.success,
  },
  excludeIcon: {
    color: colors.error,
  },
  serviceText: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
    lineHeight: 1.5,
  },

  // === PRICE BOX ===
  priceBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 24,
    marginVertical: 24,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 6,
  },
  priceNote: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },

  // === ACCOMMODATION ===
  accommodationCard: {
    padding: 14,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
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
    marginTop: 3,
  },

  // === ACTIVITY ===
  activityCard: {
    padding: 14,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLight,
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
    lineHeight: 1.5,
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  activityMetaItem: {
    fontSize: 8,
    color: colors.textMuted,
  },

  // === CTA PAGE ===
  ctaPage: {
    backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  ctaQrContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  ctaQr: {
    width: 140,
    height: 140,
  },
  ctaQrLabel: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  ctaContact: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaContactItem: {
    fontSize: 12,
    color: colors.white,
    marginBottom: 8,
  },
  ctaContactLink: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  ctaDivider: {
    width: 80,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 30,
  },
  ctaQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  ctaBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 2,
  },
  ctaTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  // === FOOTER ===
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12 40',
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
    width: 18,
    height: 18,
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

export interface TripData {
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
  tagline?: string;
  highlights?: string[];
}

interface TripPdfDocumentProps {
  trip: TripData;
  qrCodeDataUrl?: string;
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

function getEssenceQuote(region?: string): string {
  const quotes: Record<string, string> = {
    sudamerica: '"Donde la naturaleza habla y el alma escucha"',
    patagonia: '"Donde los glaciares tocan el cielo y cada amanecer cuenta una historia"',
    caribe: '"Donde el mar azul se funde con tus sueños"',
    europa: '"Donde la historia cobra vida en cada esquina"',
    asia: '"Donde lo ancestral y lo moderno se encuentran"',
  };
  return quotes[region?.toLowerCase() || ''] || '"Tu próxima aventura comienza aquí"';
}

export function TripPdfDocument({ trip, qrCodeDataUrl }: TripPdfDocumentProps) {
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

  const includes = servicesBlock?.data.includes || trip.includes || [];
  const excludes = servicesBlock?.data.excludes || trip.excludes || [];
  const itineraryDays = itineraryBlock?.data.days || [];
  const legacyItinerary = trip.itinerary || [];
  const highlights = trip.highlights || includes.slice(0, 5);

  const heroImageUrl = toAbsoluteUrl(trip.heroImage);
  const logoUrl = toAbsoluteUrl('/icono.png');

  const displayPrice = priceBlock 
    ? `${priceBlock.data.currency} $${priceBlock.data.basePrice.toLocaleString()}`
    : trip.price || 'Consultar';

  const essenceQuote = trip.tagline || getEssenceQuote(trip.region);

  return (
    <Document>
      {/* === COVER PAGE === */}
      <Page size="A4" style={styles.coverPage}>
        {heroImageUrl && <Image src={heroImageUrl} style={styles.coverImage} />}
        <View style={styles.coverOverlay} />
        <View style={styles.coverContent}>
          {/* Header */}
          <View style={styles.coverHeader}>
            {logoUrl && <Image src={logoUrl} style={styles.coverLogo} />}
            <View>
              <Text style={styles.coverBrand}>HEADWAY TRIPS</Text>
              <Text style={styles.coverTagline}>Viajes personalizados a medida</Text>
            </View>
          </View>

          {/* Center Content */}
          <View style={styles.coverCenter}>
            <Text style={styles.coverTitle}>{trip.title}</Text>
            {trip.subtitle && <Text style={styles.coverSubtitle}>{trip.subtitle}</Text>}
            <View style={styles.coverMeta}>
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaText}>{trip.duration || `${trip.durationDays || 7} días`}</Text>
              </View>
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaText}>{displayPrice}</Text>
              </View>
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaText}>{trip.region || 'Sudamérica'}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.coverFooter}>
            <View style={styles.coverDivider} />
            <Text style={styles.coverProposal}>Propuesta de Viaje</Text>
            <Text style={styles.coverDate}>Generado el {today}</Text>
          </View>
        </View>
      </Page>

      {/* === ESSENCE + CONTENT PAGE === */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            {logoUrl && <Image src={logoUrl} style={styles.headerLogoImage} />}
            <Text style={styles.headerBrand}>Headway Trips</Text>
          </View>
          <Text style={styles.headerTitle}>{trip.title}</Text>
        </View>

        <View style={styles.content}>
          {/* Essence Section */}
          <View style={styles.essenceSection}>
            <Text style={styles.essenceQuote}>{essenceQuote}</Text>
            
            <View style={styles.essenceStats}>
              <View style={styles.essenceStat}>
                <Text style={styles.essenceStatValue}>{trip.region || 'Sudamérica'}</Text>
                <Text style={styles.essenceStatLabel}>DESTINO</Text>
              </View>
              <View style={styles.essenceStat}>
                <Text style={styles.essenceStatValue}>{trip.durationDays || 7}</Text>
                <Text style={styles.essenceStatLabel}>DÍAS</Text>
              </View>
              <View style={styles.essenceStat}>
                <Text style={styles.essenceStatValue}>4.9</Text>
                <Text style={styles.essenceStatLabel}>RATING</Text>
              </View>
            </View>

            {trip.description && (
              <Text style={styles.essenceDescription}>{stripHtml(trip.description)}</Text>
            )}
          </View>

          {/* Highlights */}
          {highlights.length > 0 && (
            <View style={styles.highlightsSection}>
              <Text style={styles.highlightsTitle}>¿Por qué este viaje?</Text>
              <View style={styles.highlightsGrid}>
                {highlights.slice(0, 6).map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Text style={styles.highlightText}>✓ {highlight}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Price Box */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Tu inversión</Text>
            <Text style={styles.priceValue}>{displayPrice}</Text>
            <Text style={styles.priceNote}>por persona en base doble</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            {logoUrl && <Image src={logoUrl} style={styles.footerLogo} />}
            <View>
              <Text style={styles.footerText}>Headway Trips</Text>
              <Link src="https://headwaytrips.com" style={styles.footerLink}>www.headwaytrips.com</Link>
            </View>
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* === ITINERARY PAGE === */}
      {(itineraryDays.length > 0 || legacyItinerary.length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerLogo}>
              {logoUrl && <Image src={logoUrl} style={styles.headerLogoImage} />}
              <Text style={styles.headerBrand}>Headway Trips</Text>
            </View>
            <Text style={styles.headerTitle}>{trip.title}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Itinerario Día por Día</Text>
              </View>

              {itineraryDays.length > 0 ? (
                itineraryDays.map((day) => (
                  <View key={day.id} style={styles.dayCard} wrap={false}>
                    <View style={styles.dayHeader}>
                      <View style={styles.dayNumber}>
                        <Text style={styles.dayNumberText}>DÍA {day.dayNumber}</Text>
                      </View>
                      <Text style={styles.dayTitle}>{day.title}</Text>
                      <View style={styles.dayMeals}>
                        {getMealBadges(day.meals).map((badge, i) => (
                          <Text key={i} style={styles.mealBadge}>{badge}</Text>
                        ))}
                      </View>
                    </View>
                    <View style={styles.dayContent}>
                      <Text style={styles.dayDescription}>{stripHtml(day.description)}</Text>
                    </View>
                  </View>
                ))
              ) : (
                legacyItinerary.map((item, index) => (
                  <View key={index} style={styles.dayCard} wrap={false}>
                    <View style={styles.dayHeader}>
                      <View style={styles.dayNumber}>
                        <Text style={styles.dayNumberText}>DÍA {item.day || index + 1}</Text>
                      </View>
                      <Text style={styles.dayTitle}>Día de exploración</Text>
                    </View>
                    <View style={styles.dayContent}>
                      <Text style={styles.dayDescription}>{item.description}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.footer} fixed>
            <View style={styles.footerLeft}>
              {logoUrl && <Image src={logoUrl} style={styles.footerLogo} />}
              <View>
                <Text style={styles.footerText}>Headway Trips</Text>
                <Link src="https://headwaytrips.com" style={styles.footerLink}>www.headwaytrips.com</Link>
              </View>
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* === SERVICES PAGE === */}
      {(includes.length > 0 || excludes.length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerLogo}>
              {logoUrl && <Image src={logoUrl} style={styles.headerLogoImage} />}
              <Text style={styles.headerBrand}>Headway Trips</Text>
            </View>
            <Text style={styles.headerTitle}>{trip.title}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Servicios Incluidos</Text>
              </View>

              <View style={styles.servicesContainer}>
                {includes.length > 0 && (
                  <View style={styles.servicesColumn}>
                    <Text style={styles.servicesSubtitle}>✓ El viaje incluye</Text>
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
                    <Text style={styles.servicesSubtitle}>✗ No incluye</Text>
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
          </View>

          <View style={styles.footer} fixed>
            <View style={styles.footerLeft}>
              {logoUrl && <Image src={logoUrl} style={styles.footerLogo} />}
              <View>
                <Text style={styles.footerText}>Headway Trips</Text>
                <Link src="https://headwaytrips.com" style={styles.footerLink}>www.headwaytrips.com</Link>
              </View>
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* === CTA PAGE === */}
      <Page size="A4" style={styles.ctaPage}>
        <Text style={styles.ctaTitle}>¿Listo para vivir</Text>
        <Text style={styles.ctaSubtitle}>esta experiencia?</Text>

        {qrCodeDataUrl && (
          <>
            <View style={styles.ctaQrContainer}>
              <Image src={qrCodeDataUrl} style={styles.ctaQr} />
            </View>
            <Text style={styles.ctaQrLabel}>Escaneá para ver todos los detalles</Text>
          </>
        )}

        <View style={styles.ctaContact}>
          <Text style={styles.ctaContactItem}>Tel: +54 11 XXXX-XXXX</Text>
          <Text style={styles.ctaContactItem}>Email: viajes@headwaytrips.com</Text>
          <Link src="https://headwaytrips.com" style={styles.ctaContactLink}>
            Web: headwaytrips.com
          </Link>
        </View>

        <View style={styles.ctaDivider} />

        <Text style={styles.ctaQuote}>
          "Los viajes son la única inversión que te hace más rico"
        </Text>

        <Text style={styles.ctaBrand}>HEADWAY TRIPS</Text>
        <Text style={styles.ctaTagline}>Viajes personalizados a medida</Text>
      </Page>
    </Document>
  );
}
