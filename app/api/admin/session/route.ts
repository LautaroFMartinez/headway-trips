import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await currentUser();

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: userId,
        name: user?.fullName || user?.firstName || 'Admin',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
