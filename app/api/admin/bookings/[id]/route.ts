import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener una reserva específica
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, trips(title, image, price, price_value), clients(id, full_name, email, phone)')
      .eq('id', id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Fetch passengers with linked client data
    const { data: passengers } = await supabase
      .from('booking_passengers')
      .select('*, clients(id, full_name, email, phone, nationality, passport_number)')
      .eq('booking_id', id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ ...booking, passengers: passengers || [] });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar reserva
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // customer_name/email/phone son de solo lectura (se gestionan desde Clientes)
    if (body.travel_date !== undefined) updateData.travel_date = body.travel_date;
    if (body.adults !== undefined) updateData.adults = body.adults;
    if (body.children !== undefined) updateData.children = body.children;
    if (body.total_price !== undefined) updateData.total_price = body.total_price;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.payment_status !== undefined) updateData.payment_status = body.payment_status;
    if (body.special_requests !== undefined) updateData.special_requests = body.special_requests;
    if (body.internal_notes !== undefined) updateData.internal_notes = body.internal_notes;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select('*, trips(title, image)')
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar reserva
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('bookings').delete().eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return NextResponse.json({ error: 'Error al eliminar la reserva' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
