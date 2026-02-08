import { NextResponse } from 'next/server';

// Login is now handled by Clerk's SignIn component.
export async function POST() {
  return NextResponse.json(
    { error: 'Login is now handled by Clerk. Use the /admin page to sign in.' },
    { status: 410 }
  );
}
