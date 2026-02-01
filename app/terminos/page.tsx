import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Headway Trips',
  description: 'Términos y condiciones de uso de los servicios de Headway Trips. Condiciones de reserva, pagos, cancelaciones y más.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-4xl font-bold mb-4">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">Al acceder y utilizar el sitio web y los servicios de Headway Trips (&quot;la Empresa&quot;, &quot;nosotros&quot;), usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.</p>
            <p className="text-muted-foreground leading-relaxed">Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Servicios Ofrecidos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Headway Trips actúa como agencia de viajes, facilitando la reserva de:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Paquetes turísticos y excursiones</li>
              <li>Alojamiento en hoteles y establecimientos similares</li>
              <li>Transporte terrestre, aéreo y marítimo</li>
              <li>Actividades y experiencias turísticas</li>
              <li>Servicios de guía y asistencia</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">Actuamos como intermediarios entre usted y los proveedores de servicios turísticos. Los servicios finales son prestados por terceros proveedores sujetos a sus propios términos y condiciones.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Proceso de Reserva</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Solicitud de Cotización</h3>
            <p className="text-muted-foreground leading-relaxed">Las cotizaciones proporcionadas son válidas por 7 días desde su emisión, salvo indicación contraria. Los precios están sujetos a disponibilidad y pueden variar sin previo aviso hasta la confirmación de la reserva.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Confirmación de Reserva</h3>
            <p className="text-muted-foreground leading-relaxed">Una reserva se considera confirmada únicamente cuando: (a) hemos recibido el pago correspondiente según las condiciones acordadas, y (b) le hemos enviado una confirmación por escrito. Hasta ese momento, no existe ningún compromiso contractual.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Información del Pasajero</h3>
            <p className="text-muted-foreground leading-relaxed">Es su responsabilidad proporcionar información precisa y completa de todos los pasajeros, incluyendo nombres exactamente como aparecen en los documentos de viaje. Errores en esta información pueden resultar en cargos adicionales o la imposibilidad de viajar.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Precios y Pagos</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Precios</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Los precios se expresan en dólares estadounidenses (USD) salvo indicación contraria</li>
              <li>Los precios incluyen los servicios especificados en cada paquete</li>
              <li>Impuestos, tasas aeroportuarias y cargos adicionales se indicarán por separado cuando apliquen</li>
              <li>Los precios pueden estar sujetos a suplementos por temporada alta, eventos especiales o fluctuaciones cambiarias</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Formas de Pago</h3>
            <p className="text-muted-foreground leading-relaxed">Aceptamos diversos métodos de pago que serán comunicados al momento de la reserva. Los pagos con tarjeta de crédito pueden estar sujetos a cargos adicionales por procesamiento.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Calendario de Pagos</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Depósito inicial:</strong> Generalmente 30% del total al momento de la reserva
              </li>
              <li>
                <strong>Pago final:</strong> Saldo restante con un mínimo de 30 días antes de la fecha de viaje
              </li>
              <li>Para reservas realizadas con menos de 30 días de anticipación, se requiere el pago total</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cancelaciones y Reembolsos</h2>
            <h3 className="text-xl font-semibold mb-3">5.1 Cancelación por el Cliente</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">Las cancelaciones deben comunicarse por escrito. Se aplicarán los siguientes cargos:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Más de 60 días antes:</strong> Retención del 10% o gastos administrativos mínimos
              </li>
              <li>
                <strong>30-60 días antes:</strong> Retención del 30% del total
              </li>
              <li>
                <strong>15-29 días antes:</strong> Retención del 50% del total
              </li>
              <li>
                <strong>7-14 días antes:</strong> Retención del 75% del total
              </li>
              <li>
                <strong>Menos de 7 días o no presentación:</strong> Sin reembolso
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">Algunos servicios pueden tener políticas de cancelación más restrictivas según los proveedores.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Cancelación por la Empresa</h3>
            <p className="text-muted-foreground leading-relaxed">Nos reservamos el derecho de cancelar un viaje por razones de fuerza mayor, seguridad, o si no se alcanza el número mínimo de participantes. En estos casos, ofreceremos fechas alternativas o reembolso completo.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Modificaciones</h3>
            <p className="text-muted-foreground leading-relaxed">Las solicitudes de modificación están sujetas a disponibilidad y pueden generar cargos adicionales. Cambios significativos pueden tratarse como cancelación y nueva reserva.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Documentación y Requisitos de Viaje</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Es responsabilidad exclusiva del viajero:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Poseer pasaporte válido con la vigencia requerida (generalmente 6 meses después del regreso)</li>
              <li>Obtener las visas necesarias para los destinos visitados</li>
              <li>Cumplir con los requisitos sanitarios (vacunas, certificados de salud)</li>
              <li>Verificar restricciones de viaje vigentes</li>
              <li>Contratar seguro de viaje adecuado</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">Headway Trips no se responsabiliza por la denegación de entrada a ningún país debido a documentación insuficiente o incumplimiento de requisitos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Seguro de Viaje</h2>
            <p className="text-muted-foreground leading-relaxed">Recomendamos encarecidamente contratar un seguro de viaje completo que incluya: cancelación de viaje, gastos médicos y de evacuación, pérdida de equipaje y responsabilidad civil. Podemos ofrecer opciones de seguro como servicio adicional.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Responsabilidad</h2>
            <h3 className="text-xl font-semibold mb-3">8.1 Limitación de Responsabilidad</h3>
            <p className="text-muted-foreground leading-relaxed">Como intermediarios, no somos responsables por actos, omisiones o incumplimientos de los proveedores de servicios turísticos. Nuestra responsabilidad se limita a la correcta gestión de las reservas solicitadas.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Fuerza Mayor</h3>
            <p className="text-muted-foreground leading-relaxed">No seremos responsables por incumplimientos causados por circunstancias fuera de nuestro control razonable, incluyendo pero no limitado a: desastres naturales, conflictos, pandemias, huelgas, decisiones gubernamentales o condiciones meteorológicas extremas.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Conducta del Viajero</h3>
            <p className="text-muted-foreground leading-relaxed">El viajero es responsable de su conducta durante el viaje. Nos reservamos el derecho de excluir de un viaje a cualquier persona cuyo comportamiento cause molestias, peligro o daño a otros viajeros, personal o propiedad, sin derecho a reembolso.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Reclamaciones</h2>
            <p className="text-muted-foreground leading-relaxed">Cualquier problema durante el viaje debe comunicarse inmediatamente al proveedor del servicio y a nuestro equipo de soporte. Las reclamaciones formales deben presentarse por escrito dentro de los 30 días siguientes al regreso del viaje, adjuntando toda la documentación relevante.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Propiedad Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">Todo el contenido del sitio web, incluyendo textos, imágenes, logotipos, diseños y software, es propiedad de Headway Trips o sus licenciantes y está protegido por leyes de propiedad intelectual. No está permitido reproducir, distribuir o utilizar comercialmente dicho contenido sin autorización previa por escrito.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Protección de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              El tratamiento de sus datos personales se rige por nuestra{' '}
              <Link href="/privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
              , que forma parte integral de estos Términos y Condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Legislación Aplicable y Jurisdicción</h2>
            <p className="text-muted-foreground leading-relaxed">Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes aplicables en la jurisdicción donde opera la Empresa. Cualquier disputa que surja será sometida a la jurisdicción exclusiva de los tribunales competentes de dicha jurisdicción.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Disposiciones Generales</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Si alguna disposición de estos términos se considera inválida, las demás disposiciones permanecerán en vigor</li>
              <li>La falta de ejercicio de cualquier derecho no constituirá renuncia al mismo</li>
              <li>Estos términos constituyen el acuerdo completo entre las partes respecto a su objeto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Para consultas sobre estos Términos y Condiciones:</p>
            <div className="bg-secondary/50 p-6 rounded-lg space-y-2">
              <p className="text-foreground">
                <strong>Headway Trips</strong>
              </p>
              <p className="text-muted-foreground">Email: legal@headwaytrips.com</p>
              <p className="text-muted-foreground">Email general: info@headwaytrips.com</p>
              <p className="text-muted-foreground">Teléfono: +54 11 1234-5678</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/privacidad" className="text-primary hover:underline">
            Ver Política de Privacidad →
          </Link>
        </div>
      </div>
    </main>
  );
}
