import { NextResponse } from 'next/server';

// Logout is now handled by Clerk's signOut().
export async function POST() {
  return NextResponse.json(
    { error: 'Logout is now handled by Clerk.' },
    { status: 410 }
  );
}
