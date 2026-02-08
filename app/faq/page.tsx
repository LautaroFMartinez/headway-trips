import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, CreditCard, XCircle, FileText, MapPin } from 'lucide-react';
import { generateSEOMetadata, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Preguntas Frecuentes',
  description: 'Resolvemos tus dudas sobre reservas, pagos, cancelaciones, documentacion y destinos. Todo lo que necesitas saber antes de viajar con Headway Trips.',
  url: '/faq',
  keywords: ['preguntas frecuentes', 'FAQ', 'reservas', 'pagos', 'cancelaciones', 'documentacion viaje'],
});

const faqCategories = [
  {
    id: 'reservas',
    title: 'Reservas',
    icon: MessageCircle,
    questions: [
      {
        question: '¿Como reservo mi viaje?',
        answer: 'Podes reservar tu viaje directamente a traves de nuestro sitio web seleccionando el destino y completando el formulario de cotizacion. Tambien podes contactarnos por WhatsApp o email para una atencion personalizada. Nuestro equipo te va a guiar en todo el proceso.',
      },
      {
        question: '¿Con cuanta anticipacion debo reservar?',
        answer: 'Recomendamos reservar con al menos 30 dias de anticipacion para vuelos domesticos y 60 dias para internacionales. Para temporada alta (julio-agosto y diciembre-enero), lo ideal es reservar con 3 meses de anticipacion.',
      },
      {
        question: '¿Los viajes incluyen vuelos?',
        answer: 'Depende del paquete. Cada viaje detalla claramente que incluye y que no. Ofrecemos paquetes solo terrestre y paquetes completos con aereos. Podes ver el detalle en la ficha de cada destino.',
      },
      {
        question: '¿Organizan viajes a medida?',
        answer: '¡Si! Somos especialistas en crear experiencias personalizadas. Contanos que buscas: destino, fechas, presupuesto y preferencias, y armamos un itinerario exclusivo para vos.',
      },
      {
        question: '¿Cual es el tamaño de los grupos?',
        answer: 'Trabajamos con grupos reducidos de maximo 20 personas para garantizar una experiencia mas personalizada y autentica. Tambien organizamos viajes privados para familias o amigos.',
      },
    ],
  },
  {
    id: 'pagos',
    title: 'Pagos y financiacion',
    icon: CreditCard,
    questions: [
      {
        question: '¿Cuales son las formas de pago?',
        answer: 'Aceptamos tarjetas de credito y debito (Visa, Mastercard), transferencias bancarias y pagos digitales Offrecemos planes de financiacion en cuotas siempre que el viaje se encuentre completamente saldado 15 dias antes de realizar el mismo.',
      },
      {
        question: '¿Puedo pagar en cuotas?',
        answer: 'Ofrecemos planes de ahorro previos para viajes programados con antelacion.',
      },
      {
        question: '¿Los precios estan en dolares o pesos?',
        answer: 'Todos los precios en nuestra pagina estan expresados en dolares estadounidenses (USD)',
      },
      {
        question: '¿Hay cargos adicionales?',
        answer: 'Todos los precios publicados incluyen impuestos y tasas. Pueden existir cargos adicionales por servicios opcionales como excursiones extras, seguros premium o upgrades de alojamiento, que siempre se informan previamente.',
      },
      {
        question: '¿Como realizo pagos adicionales o completo el saldo de mi reserva?',
        answer: 'Podes gestionar tus pagos directamente desde la seccion "Mis Reservas". Inicia sesion con el email asociado a tu reserva, selecciona la reserva que deseas pagar y hace click en "Realizar pago". Podras elegir pagar el total pendiente, el 50% o un monto personalizado. Se generara un link de pago seguro para completar la transaccion, sin necesidad de contactar al equipo.',
      },
    ],
  },
  {
    id: 'cancelaciones',
    title: 'Cancelaciones y cambios',
    icon: XCircle,
    questions: [
      {
        question: '¿Que pasa si necesito cancelar?',

        answer: 'Entendemos que tus planes pueden cambiar. Nuestras políticas de cancelación contemplan reintegros según la antelación del aviso: 90% si es con más de 60 días, y 50% entre 30 y 60 días. Lamentablemente, con menos de 30 días de anticipación no podemos realizar reembolsos.',
      },
      {
        question: '¿Puedo cambiar las fechas del viaje?',
        answer: 'Si, los cambios de fecha estan sujetos a disponibilidad y pueden tener un costo adicional dependiendo de la diferencia tarifaria. Te recomendamos solicitarlos con la mayor anticipacion posible.',
      },
      {
        question: '¿Que pasa si el viaje se cancela por causas externas?',
        answer: 'En caso de fuerza mayor (catastrofes, pandemias, etc.), ofrecemos reprogramacion sin costo o un voucher por el valor total del viaje. Siempre priorizamos la seguridad y satisfaccion de nuestros viajeros.',
      },
      {
        question: '¿Incluyen seguro de viaje?',
        answer: 'Si, todos nuestros paquetes internacionales incluyen asistencia al viajero basica. Podes optar por ampliar la cobertura con planes premium que incluyen cancelacion por cualquier causa, equipaje extra y mas.',
      },
    ],
  },
  {
    id: 'documentacion',
    title: 'Documentacion',
    icon: FileText,
    questions: [
      {
        question: '¿Que documentos necesito para viajar?',
        answer: 'Los documentos necesarios para viajar varian de acuerdo a la nacionalidad y el destino de cada viajero. Si tenes alguna duda en cuanto a que documentos necesitas, no dudes en contactarnos mediante el boton de contacto que se encuentra mas abajo.',
      },
      {
        question: '¿Me ayudan con el tramite de visa?',
        answer: 'Si, brindamos asesoramiento completo para tramites de visa. Te indicamos los documentos necesarios, plazos y requisitos especificos. No somos gestores oficiales, pero te acompañamos en todo el proceso.',
      },
      {
        question: '¿Necesito vacunas especiales?',
        answer: 'Depende del destino. Te informamos sobre las vacunas requeridas u opcionales para cada viaje.',
      },
    ],
  },
  {
    id: 'destinos',
    title: 'Destinos y experiencias',
    icon: MapPin,
    questions: [
      {
        question: '¿Los viajes son solo para adultos?',
        answer: 'No, tenemos opciones para todos. Ofrecemos viajes familiares con actividades para niños, viajes de aventura para jovenes, escapadas romanticas y tours culturales. Cada paquete indica el perfil de viajero recomendado.',
      },
      {
        question: '¿Que tipo de alojamiento ofrecen?',
        answer: 'Trabajamos con una seleccion cuidada de hoteles de 3 a 5 estrellas, boutique hotels, lodges y apartamentos. Siempre priorizamos la ubicacion, limpieza y relacion calidad-precio.',
      },
      {
        question: '¿Incluyen guia turistico?',
        answer: 'La mayoria de nuestros paquetes grupales incluyen guia bilingue (español/ingles). Para viajes a medida, ofrecemos la opcion de guia privado como servicio adicional.',
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = faqCategories.flatMap((cat) => cat.questions);
  const faqSchema = generateFAQSchema(allQuestions);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://headwaytrips.com' },
    { name: 'Preguntas Frecuentes', url: 'https://headwaytrips.com/faq' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Preguntas <span className="font-serif italic text-accent">Frecuentes</span>
            </h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
              Resolvemos tus dudas para que viajes con total tranquilidad
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-12">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} id={category.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="text-left font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-card border border-border rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                ¿No encontraste lo que buscabas?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Nuestro equipo esta listo para responder todas tus consultas de forma personalizada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactanos
                </a>
                <a
                  href="https://wa.me/5411123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
