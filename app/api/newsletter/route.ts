import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

const subscribeSchema = z.object({
  email: z.string().email('Email inválido'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`newsletter:${clientId}`, RATE_LIMITS.newsletter);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Demasiados intentos. Por favor esperá unos minutos.',
          retryAfter: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
          },
        }
      );
    }

    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Si Supabase no está configurado, modo demo
    if (!isSupabaseConfigured()) {
      console.log('[Newsletter] New subscriber (demo mode):', email);
      return NextResponse.json(
        { success: true, message: 'Suscripción exitosa' },
        { status: 200 }
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 503 }
      );
    }

    // Intentar insertar; si ya existe, verificar estado
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Este email ya está suscrito' },
          { status: 400 }
        );
      }
      // Reactivar suscripción si estaba unsubscribed
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);

      return NextResponse.json(
        { success: true, message: 'Suscripción reactivada' },
        { status: 200 }
      );
    }

    // Nuevo suscriptor
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });

    if (insertError) {
      console.error('[Newsletter] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar la suscripción' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Suscripción exitosa' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
