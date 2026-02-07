import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';
import type { TripData } from '@/components/trip-comparator';

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
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  coverPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
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
  coverBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  coverBadgeText: {
    fontSize: 11,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
  },
  coverTripsPreview: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  coverTripBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coverTripIcon: {
    fontSize: 14,
    color: colors.gold,
  },
  coverTripName: {
    fontSize: 11,
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

  // === COMPARISON TABLE ===
  comparisonSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableRowAlt: {
    backgroundColor: colors.backgroundLight,
  },
  tableHeaderRow: {
    backgroundColor: colors.primary,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  tableLabelCell: {
    width: 100,
    padding: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  tableLabelText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tableValueCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableValueText: {
    fontSize: 10,
    color: colors.text,
    textAlign: 'center',
  },
  tableValueTextBest: {
    fontSize: 10,
    color: colors.success,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  priceValueBest: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
  },
  bestBadge: {
    backgroundColor: colors.success,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  bestBadgeText: {
    fontSize: 7,
    color: colors.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // === TRIP CARDS ===
  tripCardsSection: {
    marginTop: 24,
  },
  tripCard: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tripCardHeader: {
    backgroundColor: colors.primary,
    padding: 14,
  },
  tripCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  tripCardSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tripCardContent: {
    padding: 16,
    backgroundColor: colors.backgroundLight,
  },
  tripCardDescription: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.text,
    marginBottom: 14,
  },
  tripCardHighlights: {
    marginBottom: 12,
  },
  tripCardHighlightsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tripCardHighlightsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  highlightBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  highlightBadgeText: {
    fontSize: 8,
    color: colors.white,
    fontWeight: 'bold',
  },
  tripCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tripCardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tripCardDuration: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // === RECOMMENDATION BOX ===
  recommendationBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 24,
    marginVertical: 24,
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  recommendationReason: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
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

interface ComparisonPdfDocumentProps {
  trips: TripData[];
  qrCodeDataUrl?: string;
}

function calculatePricePerDay(priceValue: number, durationDays: number): number {
  if (durationDays <= 0) return 0;
  return Math.round(priceValue / durationDays);
}

export function ComparisonPdfDocument({ trips, qrCodeDataUrl }: ComparisonPdfDocumentProps) {
  const today = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const logoUrl = toAbsoluteUrl('/icono.png');

  // Calculate best values
  const lowestPriceTrip = trips.reduce((prev, curr) => 
    curr.priceValue < prev.priceValue ? curr : prev
  );

  const pricesPerDay = trips.map((t) => ({
    id: t.id,
    pricePerDay: calculatePricePerDay(t.priceValue, t.durationDays),
  }));
  const bestPricePerDayTrip = pricesPerDay.reduce((prev, curr) =>
    curr.pricePerDay < prev.pricePerDay ? curr : prev
  );

  const longestTrip = trips.reduce((prev, curr) =>
    curr.durationDays > prev.durationDays ? curr : prev
  );

  // Determine recommendation (best price per day or lowest price)
  const recommendedTrip = lowestPriceTrip;
  const recommendationReason = 'Mejor relación calidad-precio';

  return (
    <Document>
      {/* === COVER PAGE === */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverGradient} />
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
            <View style={styles.coverBadge}>
              <Text style={styles.coverBadgeText}>Comparador de Destinos</Text>
            </View>
            <Text style={styles.coverTitle}>Tu análisis de viajes</Text>
            <Text style={styles.coverSubtitle}>
              Comparación detallada de {trips.length} destinos seleccionados
            </Text>
            
            <View style={styles.coverTripsPreview}>
              {trips.map((trip) => (
                <View key={trip.id} style={styles.coverTripBadge}>
                  <Text style={styles.coverTripIcon}>✈</Text>
                  <Text style={styles.coverTripName}>{trip.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.coverFooter}>
            <View style={styles.coverDivider} />
            <Text style={styles.coverProposal}>Guía de Comparación</Text>
            <Text style={styles.coverDate}>Generado el {today}</Text>
          </View>
        </View>
      </Page>

      {/* === COMPARISON TABLE PAGE === */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            {logoUrl && <Image src={logoUrl} style={styles.headerLogoImage} />}
            <Text style={styles.headerBrand}>Headway Trips</Text>
          </View>
          <Text style={styles.headerTitle}>Comparación de destinos</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>Comparativa lado a lado</Text>
            
            <View style={styles.tableContainer}>
              {/* Header Row */}
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <View style={styles.tableLabelCell}>
                  <Text style={[styles.tableLabelText, { color: colors.white }]}>Característica</Text>
                </View>
                {trips.map((trip) => (
                  <View key={trip.id} style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>{trip.title}</Text>
                  </View>
                ))}
              </View>

              {/* Price Row */}
              <View style={styles.tableRow}>
                <View style={styles.tableLabelCell}>
                  <Text style={styles.tableLabelText}>Precio Total</Text>
                </View>
                {trips.map((trip) => (
                  <View key={trip.id} style={styles.tableValueCell}>
                    <Text style={trip.id === lowestPriceTrip.id ? styles.priceValueBest : styles.priceValue}>
                      {trip.price}
                    </Text>
                    {trip.id === lowestPriceTrip.id && trips.length > 1 && (
                      <View style={styles.bestBadge}>
                        <Text style={styles.bestBadgeText}>Mejor precio</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Price per Day Row */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <View style={styles.tableLabelCell}>
                  <Text style={styles.tableLabelText}>Precio/Día</Text>
                </View>
                {trips.map((trip) => {
                  const pricePerDay = calculatePricePerDay(trip.priceValue, trip.durationDays);
                  const isBest = trip.id === bestPricePerDayTrip.id;
                  return (
                    <View key={trip.id} style={styles.tableValueCell}>
                      <Text style={isBest ? styles.tableValueTextBest : styles.tableValueText}>
                        USD ${pricePerDay}/día
                      </Text>
                      {isBest && trips.length > 1 && (
                        <View style={styles.bestBadge}>
                          <Text style={styles.bestBadgeText}>Mejor $/día</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Duration Row */}
              <View style={styles.tableRow}>
                <View style={styles.tableLabelCell}>
                  <Text style={styles.tableLabelText}>Duración</Text>
                </View>
                {trips.map((trip) => (
                  <View key={trip.id} style={styles.tableValueCell}>
                    <Text style={trip.id === longestTrip.id && trips.length > 1 ? styles.tableValueTextBest : styles.tableValueText}>
                      {trip.duration}
                    </Text>
                    {trip.id === longestTrip.id && trips.length > 1 && (
                      <View style={[styles.bestBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.bestBadgeText}>Más días</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Region Row */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <View style={styles.tableLabelCell}>
                  <Text style={styles.tableLabelText}>Región</Text>
                </View>
                {trips.map((trip) => (
                  <View key={trip.id} style={styles.tableValueCell}>
                    <Text style={styles.tableValueText}>{trip.region}</Text>
                  </View>
                ))}
              </View>

              {/* Highlights Row */}
              <View style={[styles.tableRow, styles.tableRowLast]}>
                <View style={styles.tableLabelCell}>
                  <Text style={styles.tableLabelText}>Destacados</Text>
                </View>
                {trips.map((trip) => (
                  <View key={trip.id} style={styles.tableValueCell}>
                    <Text style={styles.tableValueText}>
                      {trip.highlights.slice(0, 2).join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Recommendation Box */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationLabel}>✨ Nuestra Recomendación</Text>
            <Text style={styles.recommendationTitle}>{recommendedTrip.title}</Text>
            <Text style={styles.recommendationReason}>{recommendationReason}</Text>
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

      {/* === TRIP DETAILS PAGE === */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            {logoUrl && <Image src={logoUrl} style={styles.headerLogoImage} />}
            <Text style={styles.headerBrand}>Headway Trips</Text>
          </View>
          <Text style={styles.headerTitle}>Detalles de cada destino</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tripCardsSection}>
            {trips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripCardHeader}>
                  <Text style={styles.tripCardTitle}>{trip.title}</Text>
                  <Text style={styles.tripCardSubtitle}>{trip.subtitle}</Text>
                </View>
                <View style={styles.tripCardContent}>
                  <Text style={styles.tripCardDescription}>{trip.description}</Text>
                  
                  {trip.highlights.length > 0 && (
                    <View style={styles.tripCardHighlights}>
                      <Text style={styles.tripCardHighlightsTitle}>Lo que incluye:</Text>
                      <View style={styles.tripCardHighlightsList}>
                        {trip.highlights.slice(0, 4).map((highlight, idx) => (
                          <View key={idx} style={styles.highlightBadge}>
                            <Text style={styles.highlightBadgeText}>✓ {highlight}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.tripCardMeta}>
                    <Text style={styles.tripCardPrice}>{trip.price}</Text>
                    <Text style={styles.tripCardDuration}>{trip.duration}</Text>
                  </View>
                </View>
              </View>
            ))}
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

      {/* === CTA PAGE === */}
      <Page size="A4" style={styles.ctaPage}>
        <Text style={styles.ctaTitle}>¿Listo para tu próxima aventura?</Text>
        <Text style={styles.ctaSubtitle}>Estamos a un mensaje de hacerlo realidad</Text>

        {qrCodeDataUrl && (
          <>
            <View style={styles.ctaQrContainer}>
              <Image src={qrCodeDataUrl} style={styles.ctaQr} />
            </View>
            <Text style={styles.ctaQrLabel}>Escaneá para ver tu comparación online</Text>
          </>
        )}

        <View style={styles.ctaContact}>
          <Text style={styles.ctaContactItem}>📧 info@headwaytrips.com</Text>
          <Text style={styles.ctaContactItem}>📱 WhatsApp: +525527118391</Text>
          <Link src="https://headwaytrips.com" style={styles.ctaContactLink}>
            www.headwaytrips.com
          </Link>
        </View>

        <View style={styles.ctaDivider} />
        
        <Text style={styles.ctaQuote}>
          "El mundo es un libro, y quienes no viajan solo leen una página."
        </Text>

        <Text style={styles.ctaBrand}>HEADWAY TRIPS</Text>
        <Text style={styles.ctaTagline}>Viajes personalizados a medida</Text>
      </Page>
    </Document>
  );
}
