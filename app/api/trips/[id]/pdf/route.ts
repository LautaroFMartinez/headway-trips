import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';
import { TripPdfDocument } from '@/lib/pdf/trip-pdf-document';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting for PDF generation
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`pdf:${clientId}`, RATE_LIMITS.pdf);

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

    const { id } = await params;
    let tripData = null;

    // Try to fetch from Supabase first
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          tripData = {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            duration: data.duration,
            durationDays: data.duration_days,
            price: data.price,
            priceValue: data.price_value,
            region: data.region,
            includes: data.includes,
            excludes: data.excludes,
            itinerary: data.itinerary,
            content_blocks: data.content_blocks,
          };
        }
      }
    }

    // Fallback to static data
    if (!tripData) {
      const staticTrip = trips.find((t) => t.id === id);
      if (staticTrip) {
        tripData = {
          id: staticTrip.id,
          title: staticTrip.title,
          subtitle: staticTrip.subtitle,
          description: staticTrip.description,
          duration: staticTrip.duration,
          durationDays: staticTrip.durationDays,
          price: staticTrip.price,
          priceValue: staticTrip.priceValue,
          region: staticTrip.region,
          includes: staticTrip.includes,
          excludes: staticTrip.excludes,
          itinerary: [],
          content_blocks: [],
        };
      }
    }

    if (!tripData) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(TripPdfDocument({ trip: tripData }));

    // Create filename from trip title
    const sanitizedTitle = tripData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${sanitizedTitle}-headway-trips.pdf`;

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error generating PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
