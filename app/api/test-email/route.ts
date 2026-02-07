import { NextRequest, NextResponse } from 'next/server';
import { resend, isResendConfigured, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testEmail = searchParams.get('to') || ADMIN_EMAIL;
  // Verificar configuración
  const diagnostics = {
    resendConfigured: isResendConfigured(),
    fromEmail: FROM_EMAIL,
    adminEmail: ADMIN_EMAIL,
    apiKeyPresent: !!process.env.RESEND_API_KEY,
    apiKeyPrefix: process.env.RESEND_API_KEY?.slice(0, 10) + '...',
  };

  if (!isResendConfigured() || !resend) {
    return NextResponse.json({
      success: false,
      error: 'Resend no está configurado',
      diagnostics,
    });
  }

  try {
    // Intentar enviar un email de prueba
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: testEmail,
      subject: '🧪 Test de Email - Headway Trips',
      html: `
        <h1>¡El sistema de emails funciona!</h1>
        <p>Este es un email de prueba enviado el ${new Date().toLocaleString('es-AR')}.</p>
        <p><strong>Configuración:</strong></p>
        <ul>
          <li>From: ${FROM_EMAIL}</li>
          <li>To: ${testEmail}</li>
        </ul>
      `,
      text: `¡El sistema de emails funciona! Este es un email de prueba enviado el ${new Date().toLocaleString('es-AR')}.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Email enviado correctamente',
      result,
      diagnostics,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = error instanceof Error ? error : { raw: String(error) };
    
    return NextResponse.json({
      success: false,
      error: 'Error al enviar email',
      errorMessage,
      errorDetails,
      diagnostics,
    });
  }
}
