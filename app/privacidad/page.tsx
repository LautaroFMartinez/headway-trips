import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Headway Trips',
  description: 'Conoce cómo Headway Trips protege y utiliza tu información personal. Política de privacidad y protección de datos.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-4xl font-bold mb-4">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
            <p className="text-muted-foreground leading-relaxed">
              En Headway Trips (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Empresa&quot;), nos comprometemos a proteger la privacidad de nuestros usuarios y clientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios de viajes.
            </p>
            <p className="text-muted-foreground leading-relaxed">Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. Le recomendamos leer este documento detenidamente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Información que Recopilamos</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Información proporcionada directamente</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Nombre completo y datos de contacto (email, teléfono)</li>
              <li>Información de pasaporte o documento de identidad</li>
              <li>Preferencias de viaje y requisitos especiales</li>
              <li>Información de pago (procesada de forma segura por terceros)</li>
              <li>Comunicaciones que mantiene con nosotros</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Información recopilada automáticamente</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Dirección IP y datos de ubicación aproximada</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Cookies y tecnologías similares (ver sección 6)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Uso de la Información</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Utilizamos su información personal para:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Procesar y gestionar sus reservas de viajes</li>
              <li>Comunicarnos con usted sobre sus solicitudes y reservas</li>
              <li>Enviar confirmaciones, itinerarios y documentos de viaje</li>
              <li>Proporcionar atención al cliente y soporte</li>
              <li>Enviar información promocional (con su consentimiento)</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Compartición de Datos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Podemos compartir su información con:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Proveedores de servicios de viaje:</strong> Aerolíneas, hoteles, operadores turísticos y empresas de transporte necesarios para completar su reserva
              </li>
              <li>
                <strong>Procesadores de pago:</strong> Para gestionar transacciones de forma segura
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Que nos ayudan a operar nuestro negocio (hosting, email, analytics)
              </li>
              <li>
                <strong>Autoridades gubernamentales:</strong> Cuando sea requerido por ley o para cumplir con regulaciones de viaje
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">No vendemos ni alquilamos su información personal a terceros con fines de marketing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Transferencias Internacionales</h2>
            <p className="text-muted-foreground leading-relaxed">Debido a la naturaleza internacional de nuestros servicios de viajes, su información puede ser transferida y procesada en países distintos al suyo. Nos aseguramos de que dichas transferencias cumplan con las leyes de protección de datos aplicables y que se implementen salvaguardas apropiadas para proteger su información.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies y Tecnologías de Seguimiento</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Utilizamos cookies y tecnologías similares para:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Mantener su sesión activa y preferencias</li>
              <li>Analizar el uso del sitio web y mejorar su funcionamiento</li>
              <li>Personalizar contenido y recomendaciones</li>
              <li>Medir la efectividad de nuestras campañas</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Seguridad de los Datos</h2>
            <p className="text-muted-foreground leading-relaxed">Implementamos medidas técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, pérdida, alteración o divulgación. Esto incluye encriptación de datos, acceso restringido y auditorías de seguridad regulares. Sin embargo, ningún método de transmisión por Internet es 100% seguro.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Retención de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conservamos su información personal durante el tiempo necesario para cumplir con los fines descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. Los criterios para determinar el período de retención incluyen: la duración de nuestra relación con usted, obligaciones legales y posibles disputas o reclamaciones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Sus Derechos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Dependiendo de su ubicación, puede tener los siguientes derechos:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Acceso:</strong> Solicitar una copia de sus datos personales
              </li>
              <li>
                <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
              </li>
              <li>
                <strong>Eliminación:</strong> Solicitar la eliminación de sus datos en ciertos casos
              </li>
              <li>
                <strong>Oposición:</strong> Oponerse al procesamiento de sus datos
              </li>
              <li>
                <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado
              </li>
              <li>
                <strong>Retiro del consentimiento:</strong> Retirar su consentimiento en cualquier momento
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">Para ejercer estos derechos, contáctenos a través de los medios indicados al final de esta política.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Menores de Edad</h2>
            <p className="text-muted-foreground leading-relaxed">Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información de menores sin el consentimiento de sus padres o tutores legales. Si descubrimos que hemos recopilado información de un menor sin el consentimiento apropiado, tomaremos medidas para eliminarla.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Cambios a esta Política</h2>
            <p className="text-muted-foreground leading-relaxed">Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web y, cuando sea apropiado, enviándole una notificación directa. Le recomendamos revisar esta página regularmente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos:</p>
            <div className="bg-secondary/50 p-6 rounded-lg space-y-2">
              <p className="text-foreground">
                <strong>Headway Trips</strong>
              </p>
              <p className="text-muted-foreground">Email: privacy@headwaytrips.com</p>
              <p className="text-muted-foreground">Email general: info@headwaytrips.com</p>
              <p className="text-muted-foreground">Teléfono: +525527118391</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/terminos" className="text-primary hover:underline">
            Ver Términos y Condiciones →
          </Link>
        </div>
      </div>
    </main>
  );
}
