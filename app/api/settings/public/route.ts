import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['payments_enabled']);

    if (error) {
      console.error('Error fetching public settings:', error);
      return NextResponse.json({ payments_enabled: true });
    }

    const settings: Record<string, unknown> = { payments_enabled: true };
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ payments_enabled: true });
  }
}
