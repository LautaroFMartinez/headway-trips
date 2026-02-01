import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de mensajes con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const read = searchParams.get('read') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase.from('contact_messages').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    if (read && read !== 'all') {
      query = query.eq('read', read === 'true');
    }

    // Apply pagination and sorting
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: messages, count, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
    }

    return NextResponse.json({
      messages: messages || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo mensaje (desde formulario de contacto público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    const { data: message, error } = await supabase
      .from('contact_messages')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
        read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
