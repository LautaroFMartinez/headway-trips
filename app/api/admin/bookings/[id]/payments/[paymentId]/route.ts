import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string; paymentId: string }>;
}

// DELETE - Eliminar un pago
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, paymentId } = await params;

    // Obtener total_price de la reserva
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, total_price')
      .eq('id', id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Eliminar el pago
    const { error: deleteError } = await supabase
      .from('booking_payments')
      .delete()
      .eq('id', paymentId)
      .eq('booking_id', id);

    if (deleteError) {
      console.error('Error deleting payment:', deleteError);
      return NextResponse.json({ error: 'Error al eliminar pago' }, { status: 500 });
    }

    // Recalcular payment_status
    const { data: payments } = await supabase
      .from('booking_payments')
      .select('amount')
      .eq('booking_id', id);

    const totalPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);

    let paymentStatus: string;
    if (totalPaid >= booking.total_price) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    } else {
      paymentStatus = 'pending';
    }

    await supabase
      .from('bookings')
      .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
