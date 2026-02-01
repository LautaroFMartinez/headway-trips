import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.admin) {
      return NextResponse.json({ error: result.error || 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: result.admin,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
