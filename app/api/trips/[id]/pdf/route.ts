import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';
import { TripPdfDocument, type TripData } from '@/lib/pdf/trip-pdf-document';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import type { ContentBlock } from '@/types/blocks';

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
    let tripData: TripData | null = null;

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
          const dbData = data as Record<string, unknown>;
          tripData = {
            id: dbData.id as string,
            title: dbData.title as string,
            subtitle: (dbData.subtitle as string) || undefined,
            description: (dbData.description as string) || undefined,
            duration: (dbData.duration as string) || undefined,
            durationDays: (dbData.duration_days as number) || undefined,
            price: (dbData.price as string) || undefined,
            priceValue: (dbData.price_value as number) || undefined,
            region: (dbData.region as string) || undefined,
            includes: (dbData.includes as string[]) || [],
            excludes: (dbData.excludes as string[]) || [],
            itinerary: (dbData.itinerary as Array<{ day: number; description: string }>) || [],
            content_blocks: (dbData.content_blocks as ContentBlock[]) || [],
            heroImage: (dbData.hero_image as string) || (dbData.image as string) || null,
            gallery: (dbData.gallery as string[]) || [],
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
          includes: staticTrip.highlights || [],
          excludes: [],
          itinerary: [],
          content_blocks: staticTrip.contentBlocks || [],
          heroImage: staticTrip.heroImage || null,
          gallery: [],
        };
      }
    }

    if (!tripData) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(TripPdfDocument({ trip: tripData }));

    // Create filename from trip title
    const sanitizedTitle = tripData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${sanitizedTitle}-headway-trips.pdf`;

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
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error generating PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
