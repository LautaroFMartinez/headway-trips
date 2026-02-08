import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if there are bookings for this email
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .ilike('customer_email', normalizedEmail);

    if (!count || count === 0) {
      return NextResponse.json(
        { error: 'No encontramos reservas asociadas a este email.' },
        { status: 404 }
      );
    }

    // Check if Clerk user exists
    const client = await clerkClient();
    const existingUsers = await client.users.getUserList({
      emailAddress: [normalizedEmail],
    });

    if (existingUsers.totalCount === 0) {
      // Create the user in Clerk
      await client.users.createUser({
        emailAddress: [normalizedEmail],
      });
    }

    return NextResponse.json({ success: true, hasBookings: true });
  } catch (error) {
    console.error('Ensure user error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
