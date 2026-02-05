interface ContactCustomerConfirmationProps {
  name: string;
}

export function contactCustomerConfirmationHtml({
  name,
}: ContactCustomerConfirmationProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibimos tu mensaje - Headway Trips</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                Headway Trips
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Tu próxima aventura comienza aquí
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 600;">
                ¡Hola ${name}!
              </h2>

              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
              </p>

              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Nuestro equipo suele responder en un plazo de <strong>24 a 48 horas hábiles</strong>. Si tu consulta es urgente, no dudes en contactarnos por WhatsApp.
              </p>

              <!-- WhatsApp CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'}"
                       style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      Escribirnos por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">

              <!-- Features -->
              <p style="margin: 0 0 16px; color: #71717a; font-size: 14px; text-align: center;">
                Mientras tanto, te invitamos a explorar nuestros destinos
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}"
                       style="display: inline-block; border: 2px solid #0f766e; color: #0f766e; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      Ver Destinos
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #ffffff; font-size: 16px; font-weight: 500;">
                Headway Trips
              </p>
              <p style="margin: 0 0 16px; color: #a1a1aa; font-size: 13px;">
                Viajes personalizados a medida
              </p>
              <p style="margin: 0; color: #71717a; font-size: 11px;">
                Este email fue enviado porque completaste el formulario de contacto en nuestro sitio web.
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

export function contactCustomerConfirmationText({
  name,
}: ContactCustomerConfirmationProps): string {
  return `
¡Hola ${name}!

Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.

Nuestro equipo suele responder en un plazo de 24 a 48 horas hábiles. Si tu consulta es urgente, no dudes en contactarnos por WhatsApp: https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'}

Mientras tanto, te invitamos a explorar nuestros destinos en: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}

---
Headway Trips
Viajes personalizados a medida
  `.trim();
}
