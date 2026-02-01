'use client';

import { Shield, Award, Users, HeartHandshake } from 'lucide-react';
import { FadeIn, StaggerContainer, fadeInVariant } from './animations';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Shield,
    title: 'Seguridad garantizada',
    description: 'Viaja con total tranquilidad. Todos nuestros destinos cumplen con los más altos estándares de seguridad.',
  },
  {
    icon: Award,
    title: 'Experiencias únicas',
    description: 'Diseñamos itinerarios exclusivos que te llevan más allá de lo turístico convencional.',
  },
  {
    icon: Users,
    title: 'Grupos pequeños',
    description: 'Máximo 15 personas por grupo para garantizar una atención personalizada y experiencias íntimas.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención 24/7',
    description: 'Equipo de soporte disponible en todo momento para asistirte antes, durante y después de tu viaje.',
  },
];

export function WhyChooseUs() {
  return (
    <section id="nosotros" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase mb-3">Por qué elegirnos</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Tu viaje perfecto comienza aquí</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">Nos dedicamos a crear experiencias de viaje inolvidables con la mejor relación calidad-precio del mercado</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={fadeInVariant} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </StaggerContainer>

        <FadeIn delay={0.3} className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Más de 500 viajeros satisfechos</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Únete a nuestra comunidad de aventureros que han descubierto el mundo con nosotros</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl font-bold text-primary mb-1">500+</div>
              <div className="text-muted-foreground">Viajeros</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl font-bold text-primary mb-1">25+</div>
              <div className="text-muted-foreground">Destinos</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl font-bold text-primary mb-1">98%</div>
              <div className="text-muted-foreground">Satisfacción</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl font-bold text-primary mb-1">10+</div>
              <div className="text-muted-foreground">Años</div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
