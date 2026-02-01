'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

export function FAQSection() {
  const faqs = [
    {
      question: '¿Cómo reservo mi viaje?',
      answer: 'Podes reservar tu viaje directamente a través de nuestro sitio web seleccionando el destino y la fecha, o contactándonos por WhatsApp para una atención personalizada.',
    },
    {
      question: '¿Cuáles son las formas de pago?',
      answer: 'Aceptamos tarjetas de crédito, débito, transferencias bancarias y efectivo. Ofrecemos planes de financiación en cuotas sin interés con bancos seleccionados.',
    },
    {
      question: '¿Incluyen seguro de viaje?',
      answer: 'Sí, todos nuestros paquetes incluyen asistencia al viajero básica. Podés optar por ampliar la cobertura por un costo adicional.',
    },
    {
      question: '¿Qué pasa si necesito cancelar?',
      answer: 'Nuestras políticas de cancelación varían según la anticipación con la que nos avises. Generalmente, si cancelás con más de 30 días de anticipación, tenés un reintegro del 80%.',
    },
    {
      question: '¿Organizan viajes a medida?',
      answer: '¡Sí! Somos especialistas en crear experiencias personalizadas. Contanos qué buscás y armamos un itinerario exclusivo para vos.',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground">Resolvemos tus dudas para que viajes tranquilo</p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
