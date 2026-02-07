import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { resend, isResendConfigured, CONTACT_FORM_EMAIL, FROM_EMAIL } from '@/lib/resend';
import {
  contactAdminNotificationHtml,
  contactAdminNotificationText,
  contactCustomerConfirmationHtml,
  contactCustomerConfirmationText,
} from '@/lib/email-templates';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

// Schema de validación para mensaje de contacto
const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`contact:${clientId}`, RATE_LIMITS.contact);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Has enviado demasiados mensajes. Por favor espera unos minutos.',
          retryAfter: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Limit': String(RATE_LIMITS.contact.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    const body = await request.json();

    // Validar datos de entrada
    const validationResult = contactMessageSchema.safeParse(body);

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
      return NextResponse.json(
        {
          success: true,
          message: 'Message received (demo mode - Supabase not configured)',
          data: {
            id: `demo-${Date.now()}`,
          },
        },
        { status: 201 },
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Crear el mensaje de contacto
    const { data: contactMessage, error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        status: 'unread',
        read: false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Error saving message', details: insertError.message }, { status: 500 });
    }

    // Enviar emails si Resend está configurado
    if (isResendConfigured() && resend) {
      const resendClient = resend;
      
      const emailProps = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        messageId: contactMessage.id,
      };

      const customerEmailProps = { name: data.name };

      // Render templates first, then send emails (fire-and-forget)
      Promise.all([
        contactAdminNotificationHtml(emailProps),
        contactAdminNotificationText(emailProps),
        contactCustomerConfirmationHtml(customerEmailProps),
        contactCustomerConfirmationText(customerEmailProps),
      ])
        .then(([adminHtml, adminText, customerHtml, customerText]) => {
          const emailPromises = [
            resendClient.emails.send({
              from: FROM_EMAIL,
              to: CONTACT_FORM_EMAIL,
              subject: `Nuevo mensaje de contacto de ${data.name}`,
              html: adminHtml,
              text: adminText,
            }),
            resendClient.emails.send({
              from: FROM_EMAIL,
              to: data.email,
              subject: 'Recibimos tu mensaje - Headway Trips',
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
        message: 'Message sent successfully',
        data: {
          id: contactMessage.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
