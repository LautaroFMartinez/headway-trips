import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips as staticTrips } from '@/lib/trips-data';
import { ComparisonPdfDocument } from '@/lib/pdf/comparison-pdf-document';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import type { TripData } from '@/components/trip-comparator';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting for PDF generation
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`pdf-comparison:${clientId}`, RATE_LIMITS.pdf);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Has generado demasiados PDFs. Por favor espera un momento.',
          retryAfter: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Limit': String(RATE_LIMITS.pdf.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // Get trip IDs from query params
    const { searchParams } = new URL(request.url);
    const tripIds = searchParams.get('trips')?.split(',').filter(Boolean) || [];

    if (tripIds.length === 0) {
      return NextResponse.json({ error: 'No trips specified' }, { status: 400 });
    }

    if (tripIds.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 trips allowed' }, { status: 400 });
    }

    let trips: TripData[] = [];

    // Try to fetch from Supabase first
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .in('id', tripIds)
          .eq('available', true);

        if (!error && data) {
          trips = data.map((trip) => ({
            id: trip.id,
            title: trip.title,
            subtitle: trip.subtitle || '',
            region: trip.region || 'sudamerica',
            description: trip.description || '',
            duration: trip.duration || `${trip.duration_days} días`,
            durationDays: trip.duration_days || 1,
            price: trip.price || `USD $${trip.price_value}`,
            priceValue: trip.price_value || 0,
            image: trip.image || '/placeholder-trip.jpg',
            heroImage: trip.hero_image || trip.image || '/placeholder-trip.jpg',
            highlights: trip.highlights || [],
            tags: trip.tags || [],
            includes: trip.includes || [],
            excludes: trip.excludes || [],
          }));
        }
      }
    }

    // Fallback to static data for any missing trips
    if (trips.length < tripIds.length) {
      const foundIds = new Set(trips.map((t) => t.id));
      const missingIds = tripIds.filter((id) => !foundIds.has(id));
      
      for (const id of missingIds) {
        const staticTrip = staticTrips.find((t) => t.id === id);
        if (staticTrip) {
          trips.push({
            ...staticTrip,
            includes: [],
            excludes: [],
          });
        }
      }
    }

    if (trips.length === 0) {
      return NextResponse.json({ error: 'No valid trips found' }, { status: 404 });
    }

    // Maintain original order from query params
    trips.sort((a, b) => tripIds.indexOf(a.id) - tripIds.indexOf(b.id));

    // Generate QR code with comparison URL
    const comparisonUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/comparador?trips=${tripIds.join(',')}`;
    const qrCodeDataUrl = await QRCode.toDataURL(comparisonUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0f766e', light: '#ffffff' },
    });

    // Generate PDF buffer with QR code
    const pdfBuffer = await renderToBuffer(ComparisonPdfDocument({ trips, qrCodeDataUrl }));

    // Create filename
    const tripNames = trips.map((t) => t.title.split(':')[0].trim().toLowerCase().replace(/\s+/g, '-')).slice(0, 2).join('-vs-');
    const filename = `comparacion-${tripNames}-headway-trips.pdf`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return PDF as response
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating comparison PDF:', error);
    return NextResponse.json(
      { error: 'Error generating PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
