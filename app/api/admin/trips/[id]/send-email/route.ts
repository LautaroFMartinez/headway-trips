import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend, isResendConfigured, FROM_EMAIL } from '@/lib/resend';
import { tripUpdateHtml, tripUpdateText } from '@/lib/email-templates';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    if (!isResendConfigured() || !resend) {
      return NextResponse.json({ error: 'El servicio de email no está configurado' }, { status: 503 });
    }

    const { id } = await params;
    const body = await request.json();

    const { subject, message } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'El asunto y el mensaje son requeridos' }, { status: 400 });
    }

    // Get trip title
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('title')
      .eq('id', id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 });
    }

    // Get active bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('customer_name, customer_email')
      .eq('trip_id', id)
      .not('status', 'in', '("cancelled","refunded")');

    if (bookingsError) {
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }

    // Deduplicate by email
    const recipientMap = new Map<string, { email: string; name: string }>();
    for (const booking of bookings || []) {
      if (booking.customer_email && !recipientMap.has(booking.customer_email)) {
        recipientMap.set(booking.customer_email, {
          email: booking.customer_email,
          name: booking.customer_name,
        });
      }
    }

    const recipients = Array.from(recipientMap.values());

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No hay destinatarios para este viaje' }, { status: 400 });
    }

    const result = { sent: 0, errors: 0, details: [] as { email: string; name: string; status: 'sent' | 'error'; error?: string }[] };

    for (const recipient of recipients) {
      try {
        const [html, text] = await Promise.all([
          tripUpdateHtml({
            customerName: recipient.name,
            tripTitle: trip.title,
            subject: subject.trim(),
            messageBody: message.trim(),
          }),
          tripUpdateText({
            customerName: recipient.name,
            tripTitle: trip.title,
            subject: subject.trim(),
            messageBody: message.trim(),
          }),
        ]);

        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: recipient.email,
          subject: `${subject.trim()} - ${trip.title}`,
          html,
          text,
        });

        if (sendError) {
          throw new Error(sendError.message);
        }

        result.sent++;
        result.details.push({ email: recipient.email, name: recipient.name, status: 'sent' });
      } catch (err) {
        result.errors++;
        result.details.push({
          email: recipient.email,
          name: recipient.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
