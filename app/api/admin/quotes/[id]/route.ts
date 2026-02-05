import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener una cotización específica
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: quote, error } = await supabase.from('quote_requests').select('*, trips(title, region, price_value, image)').eq('id', id).single();

    if (error || !quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Get quote error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH - Actualizar estado de cotización
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedStatuses = ['pending', 'contacted', 'quoted', 'confirmed', 'cancelled'];

    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.status) updates.status = body.status;
    if (body.notes !== undefined) {
      updates.notes = body.notes;
    }
    if (body.quoted_price !== undefined) updates.quoted_price = body.quoted_price;
    if (body.assigned_agent !== undefined) updates.assigned_agent = body.assigned_agent;

    const { data: quote, error } = await supabase.from('quote_requests').update(updates).eq('id', id).select().single();

    if (error) {
      console.error('Error updating quote:', error);
      return NextResponse.json({ error: 'Error al actualizar la cotización' }, { status: 500 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Update quote error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar cotización
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('quote_requests').delete().eq('id', id);

    if (error) {
      console.error('Error deleting quote:', error);
      return NextResponse.json({ error: 'Error al eliminar la cotización' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
