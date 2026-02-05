interface ContactAdminNotificationProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  messageId: string;
}

export function contactAdminNotificationHtml({
  name,
  email,
  phone,
  message,
  messageId,
}: ContactAdminNotificationProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo mensaje de contacto</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Nuevo Mensaje de Contacto
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #71717a; font-size: 14px;">
                Has recibido un nuevo mensaje a través del formulario de contacto de Headway Trips.
              </p>

              <!-- Contact Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 16px; font-weight: 500;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                          <p style="margin: 4px 0 0;"><a href="mailto:${email}" style="color: #0f766e; font-size: 16px; text-decoration: none;">${email}</a></p>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono</span>
                          <p style="margin: 4px 0 0;"><a href="tel:${phone}" style="color: #0f766e; font-size: 16px; text-decoration: none;">${phone}</a></p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Box -->
              <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje</span>
                <p style="margin: 8px 0 0; color: #18181b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/admin/mensajes"
                       style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      Ver en el Panel de Admin
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                ID del mensaje: ${messageId}
              </p>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 11px;">
                Este email fue enviado automáticamente por Headway Trips
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function contactAdminNotificationText({
  name,
  email,
  phone,
  message,
  messageId,
}: ContactAdminNotificationProps): string {
  return `
NUEVO MENSAJE DE CONTACTO
========================

Has recibido un nuevo mensaje a través del formulario de contacto de Headway Trips.

DATOS DEL CONTACTO
------------------
Nombre: ${name}
Email: ${email}
${phone ? `Teléfono: ${phone}` : ''}

MENSAJE
-------
${message}

---
ID del mensaje: ${messageId}
Ver en el panel: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/admin/mensajes
  `.trim();
}
