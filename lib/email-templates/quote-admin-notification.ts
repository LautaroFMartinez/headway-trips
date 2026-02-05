interface QuoteAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  tripTitle: string;
  tripId: string;
  travelDate?: string;
  adults: number;
  children: number;
  message?: string;
  quoteId: string;
}

export function quoteAdminNotificationHtml({
  customerName,
  customerEmail,
  customerPhone,
  customerCountry,
  tripTitle,
  tripId,
  travelDate,
  adults,
  children,
  message,
  quoteId,
}: QuoteAdminNotificationProps): string {
  const totalTravelers = adults + children;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva solicitud de cotización</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Nueva Solicitud de Cotización
              </h1>
            </td>
          </tr>

          <!-- Trip Banner -->
          <tr>
            <td style="padding: 24px 40px; background-color: #faf5ff; border-bottom: 1px solid #e9d5ff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="color: #7c3aed; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Destino solicitado</span>
                    <h2 style="margin: 4px 0 0; color: #18181b; font-size: 20px; font-weight: 600;">${tripTitle}</h2>
                  </td>
                  <td style="text-align: right;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/viaje/${tripId}"
                       style="color: #7c3aed; font-size: 13px; text-decoration: none;">
                      Ver viaje →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              <!-- Customer Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: #18181b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Datos del Cliente</h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px; width: 50%;">
                          <span style="color: #71717a; font-size: 12px;">Nombre</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 15px; font-weight: 500;">${customerName}</p>
                        </td>
                        <td style="padding-bottom: 12px; width: 50%;">
                          <span style="color: #71717a; font-size: 12px;">Email</span>
                          <p style="margin: 4px 0 0;"><a href="mailto:${customerEmail}" style="color: #7c3aed; font-size: 15px; text-decoration: none;">${customerEmail}</a></p>
                        </td>
                      </tr>
                      ${customerPhone || customerCountry ? `
                      <tr>
                        ${customerPhone ? `
                        <td style="padding-bottom: 12px;">
                          <span style="color: #71717a; font-size: 12px;">Teléfono</span>
                          <p style="margin: 4px 0 0;"><a href="tel:${customerPhone}" style="color: #7c3aed; font-size: 15px; text-decoration: none;">${customerPhone}</a></p>
                        </td>
                        ` : '<td></td>'}
                        ${customerCountry ? `
                        <td style="padding-bottom: 12px;">
                          <span style="color: #71717a; font-size: 12px;">País</span>
                          <p style="margin: 4px 0 0; color: #18181b; font-size: 15px;">${customerCountry}</p>
                        </td>
                        ` : '<td></td>'}
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Travel Details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #ecfdf5; padding: 16px 20px; border-radius: 8px; width: 50%;">
                    <span style="color: #059669; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Viajeros</span>
                    <p style="margin: 4px 0 0; color: #18181b; font-size: 18px; font-weight: 600;">
                      ${totalTravelers} ${totalTravelers === 1 ? 'persona' : 'personas'}
                    </p>
                    <p style="margin: 4px 0 0; color: #71717a; font-size: 13px;">
                      ${adults} ${adults === 1 ? 'adulto' : 'adultos'}${children > 0 ? `, ${children} ${children === 1 ? 'niño' : 'niños'}` : ''}
                    </p>
                  </td>
                  <td style="width: 16px;"></td>
                  <td style="background-color: #fef3c7; padding: 16px 20px; border-radius: 8px; width: 50%;">
                    <span style="color: #d97706; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Fecha de viaje</span>
                    <p style="margin: 4px 0 0; color: #18181b; font-size: 18px; font-weight: 600;">
                      ${travelDate || 'Flexible'}
                    </p>
                  </td>
                </tr>
              </table>

              ${message ? `
              <!-- Message Box -->
              <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje del cliente</span>
                <p style="margin: 8px 0 0; color: #18181b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/admin/cotizaciones"
                       style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
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
                ID de cotización: ${quoteId}
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

export function quoteAdminNotificationText({
  customerName,
  customerEmail,
  customerPhone,
  customerCountry,
  tripTitle,
  tripId,
  travelDate,
  adults,
  children,
  message,
  quoteId,
}: QuoteAdminNotificationProps): string {
  const totalTravelers = adults + children;

  return `
NUEVA SOLICITUD DE COTIZACIÓN
=============================

DESTINO SOLICITADO
------------------
${tripTitle}
Ver viaje: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/viaje/${tripId}

DATOS DEL CLIENTE
-----------------
Nombre: ${customerName}
Email: ${customerEmail}
${customerPhone ? `Teléfono: ${customerPhone}` : ''}
${customerCountry ? `País: ${customerCountry}` : ''}

DETALLES DEL VIAJE
------------------
Viajeros: ${totalTravelers} persona${totalTravelers !== 1 ? 's' : ''} (${adults} adulto${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} niño${children !== 1 ? 's' : ''}` : ''})
Fecha de viaje: ${travelDate || 'Flexible'}

${message ? `MENSAJE DEL CLIENTE
-------------------
${message}` : ''}

---
ID de cotización: ${quoteId}
Ver en el panel: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com'}/admin/cotizaciones
  `.trim();
}
