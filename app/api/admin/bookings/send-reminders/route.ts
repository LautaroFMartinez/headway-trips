import { NextResponse } from 'next/server';
import { processBookingReminders } from '@/lib/booking-reminders';

export async function POST() {
  try {
    const result = await processBookingReminders();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin send reminders error:', error);
    return NextResponse.json(
      { error: 'Error al enviar reminders' },
      { status: 500 }
    );
  }
}
