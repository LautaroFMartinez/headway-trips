interface QuoteCustomerConfirmationProps {
  customerName: string;
  tripTitle: string;
}

export function quoteCustomerConfirmationHtml({
  customerName,
  tripTitle,
}: QuoteCustomerConfirmationProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibimos tu solicitud - Headway Trips</title>
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
                ¡Hola ${customerName}!
              </h2>

              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Gracias por tu interés en viajar con nosotros. Hemos recibido tu solicitud de cotización y estamos preparando una propuesta personalizada para ti.
              </p>

              <!-- Trip Box -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <span style="color: #15803d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Destino solicitado</span>
                <h3 style="margin: 8px 0 0; color: #18181b; font-size: 18px; font-weight: 600;">${tripTitle}</h3>
              </div>

              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Nuestro equipo de expertos en viajes está trabajando en tu cotización. Te contactaremos en un plazo de <strong>24 a 48 horas hábiles</strong> con todos los detalles.
              </p>

              <!-- What's Next -->
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">¿Qué sigue?</h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #0f766e; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">1</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #3f3f46; font-size: 14px;">Revisamos tu solicitud y preparamos una propuesta a medida</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #0f766e; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">2</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #3f3f46; font-size: 14px;">Te enviamos el itinerario detallado con precios y opciones</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #0f766e; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">3</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #3f3f46; font-size: 14px;">Ajustamos los detalles según tus preferencias</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 24px; color: #71717a; font-size: 14px; text-align: center;">
                ¿Tienes alguna pregunta mientras tanto? No dudes en contactarnos.
              </p>

              <!-- WhatsApp CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'}"
                       style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      Escribirnos por WhatsApp
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
                Este email fue enviado porque solicitaste una cotización en nuestro sitio web.
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

export function quoteCustomerConfirmationText({
  customerName,
  tripTitle,
}: QuoteCustomerConfirmationProps): string {
  return `
¡Hola ${customerName}!

Gracias por tu interés en viajar con nosotros. Hemos recibido tu solicitud de cotización para:

DESTINO SOLICITADO: ${tripTitle}

Nuestro equipo de expertos en viajes está trabajando en tu cotización. Te contactaremos en un plazo de 24 a 48 horas hábiles con todos los detalles.

¿QUÉ SIGUE?
1. Revisamos tu solicitud y preparamos una propuesta a medida
2. Te enviamos el itinerario detallado con precios y opciones
3. Ajustamos los detalles según tus preferencias

¿Tienes alguna pregunta mientras tanto? Escríbenos por WhatsApp: https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'}

---
Headway Trips
Viajes personalizados a medida
  `.trim();
}
