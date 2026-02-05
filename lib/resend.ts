import { Resend } from 'resend';

// Inicializar Resend solo si hay API key configurada
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function isResendConfigured(): boolean {
  return !!resendApiKey;
}

// Email del administrador que recibirá las notificaciones
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@headwaytrips.com';

// Email desde el cual se envían los correos (debe estar verificado en Resend)
export const FROM_EMAIL = process.env.FROM_EMAIL || 'Headway Trips <noreply@headwaytrips.com>';
