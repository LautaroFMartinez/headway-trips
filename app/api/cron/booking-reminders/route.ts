import { NextRequest, NextResponse } from 'next/server';
import { processBookingReminders } from '@/lib/booking-reminders';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processBookingReminders();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron booking reminders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
