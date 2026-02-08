import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Listar pagos de una reserva
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: payments, error } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', id)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
    }

    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Registrar un pago
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'El monto es requerido y debe ser mayor a 0' }, { status: 400 });
    }

    // Verificar que la reserva existe
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, total_price')
      .eq('id', id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Insertar pago
    const { data: payment, error: insertError } = await supabase
      .from('booking_payments')
      .insert({
        booking_id: id,
        amount: body.amount,
        currency: body.currency || 'USD',
        payment_method: body.payment_method || 'transferencia',
        reference: body.reference || null,
        notes: body.notes || null,
        payment_date: body.payment_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting payment:', insertError);
      return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 });
    }

    // Recalcular payment_status
    await recalculatePaymentStatus(id, booking.total_price);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

async function recalculatePaymentStatus(bookingId: string, totalPrice: number) {
  const { data: payments } = await supabase
    .from('booking_payments')
    .select('amount')
    .eq('booking_id', bookingId);

  const totalPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);

  let paymentStatus: string;
  if (totalPaid >= totalPrice) {
    paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    paymentStatus = 'partial';
  } else {
    paymentStatus = 'pending';
  }

  await supabase
    .from('bookings')
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}
