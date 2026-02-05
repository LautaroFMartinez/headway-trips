import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un mensaje específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: message, error } = await supabase.from('contact_messages').select('*').eq('id', id).single();

    if (error || !message) {
      return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH - Actualizar estado de lectura
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.read !== undefined) {
      updates.read = body.read;
      updates.status = body.read ? 'read' : 'unread';
    }

    const { data: message, error } = await supabase.from('contact_messages').update(updates).eq('id', id).select().single();

    if (error) {
      console.error('Error updating message:', error);
      return NextResponse.json({ error: 'Error al actualizar el mensaje' }, { status: 500 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar mensaje
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('contact_messages').delete().eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      return NextResponse.json({ error: 'Error al eliminar el mensaje' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
