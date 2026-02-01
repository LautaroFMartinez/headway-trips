import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';

// Schema de validación para mensaje de contacto
const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
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
          }))
        },
        { status: 400 }
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
          }
        },
        { status: 201 }
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
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
      })
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json(
        { error: 'Error saving message', details: insertError.message },
        { status: 500 }
      );
    }
    
    // TODO: Enviar email de notificación al equipo
    // TODO: Enviar email de confirmación al cliente
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully',
        data: {
          id: contactMessage.id,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
