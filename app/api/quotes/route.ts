import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { trips } from '@/lib/trips-data';
import { resend, isResendConfigured, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend';
import {
  quoteAdminNotificationHtml,
  quoteAdminNotificationText,
  quoteCustomerConfirmationHtml,
  quoteCustomerConfirmationText,
} from '@/lib/email-templates';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

// Schema de validación para la cotización
const quoteRequestSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
  customerCountry: z.string().optional(),
  travelDate: z.string().optional(),
  adults: z.number().min(1, 'At least 1 adult required').default(1),
  children: z.number().min(0).default(0),
  message: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`quotes:${clientId}`, RATE_LIMITS.quotes);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Has enviado demasiadas solicitudes. Por favor espera unos minutos.',
          retryAfter: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Limit': String(RATE_LIMITS.quotes.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    const body = await request.json();

    // Validar datos de entrada
    const validationResult = quoteRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Si Supabase no está configurado, simular respuesta exitosa
    if (!isSupabaseConfigured()) {
      const trip = trips.find((t) => t.id === data.tripId);
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }

      // En producción esto guardaría en Supabase
      // Por ahora retornamos éxito simulado para desarrollo
      return NextResponse.json(
        {
          success: true,
          message: 'Quote request received (demo mode - Supabase not configured)',
          data: {
            id: `demo-${Date.now()}`,
            tripTitle: trip.title,
          },
        },
        { status: 201 },
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Verificar que el viaje existe
    const { data: trip, error: tripError } = await supabase.from('trips').select('id, title, available').eq('id', data.tripId).single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (!trip.available) {
      return NextResponse.json({ error: 'This trip is not currently available' }, { status: 400 });
    }

    // Crear la solicitud de cotización
    const { data: quoteRequest, error: insertError } = await supabase
      .from('quote_requests')
      .insert({
        trip_id: data.tripId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        customer_country: data.customerCountry || null,
        travel_date: data.travelDate || null,
        adults: data.adults,
        children: data.children,
        message: data.message || null,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Error creating quote request', details: insertError.message }, { status: 500 });
    }

    // Enviar emails si Resend está configurado
    if (isResendConfigured() && resend) {
      const resendClient = resend;
      
      // Render email templates in parallel
      const adminEmailProps = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerCountry: data.customerCountry,
        tripTitle: trip.title,
        tripId: data.tripId,
        travelDate: data.travelDate,
        adults: data.adults,
        children: data.children,
        message: data.message,
        quoteId: quoteRequest.id,
      };

      const customerEmailProps = {
        customerName: data.customerName,
        tripTitle: trip.title,
      };

      // Render templates first, then send emails (fire-and-forget)
      Promise.all([
        quoteAdminNotificationHtml(adminEmailProps),
        quoteAdminNotificationText(adminEmailProps),
        quoteCustomerConfirmationHtml(customerEmailProps),
        quoteCustomerConfirmationText(customerEmailProps),
      ])
        .then(([adminHtml, adminText, customerHtml, customerText]) => {
          const emailPromises = [
            resendClient.emails.send({
              from: FROM_EMAIL,
              to: ADMIN_EMAIL,
              subject: `Nueva cotización: ${trip.title} - ${data.customerName}`,
              html: adminHtml,
              text: adminText,
            }),
            resendClient.emails.send({
              from: FROM_EMAIL,
              to: data.customerEmail,
              subject: `Recibimos tu solicitud para ${trip.title} - Headway Trips`,
              html: customerHtml,
              text: customerText,
            }),
          ];
          return Promise.allSettled(emailPromises);
        })
        .catch(console.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Quote request created successfully',
        data: {
          id: quoteRequest.id,
          tripTitle: trip.title,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Este endpoint requiere autenticación (para el panel admin)
  // Por ahora retornamos 401
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
}
