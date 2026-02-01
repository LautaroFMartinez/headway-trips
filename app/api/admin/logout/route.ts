import { NextResponse } from 'next/server';
import { logoutAdmin } from '@/lib/auth';

export async function POST() {
  try {
    await logoutAdmin();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
