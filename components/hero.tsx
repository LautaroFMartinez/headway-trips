import Image from 'next/image';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: MapPin, value: '25+', label: 'Destinos' },
  { icon: Calendar, value: '10+', label: 'Años de experiencia' },
  { icon: Users, value: '500+', label: 'Viajeros felices' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image 
          src="/Alesund_Noruega.webp" 
          alt="Paisaje de Alesund Noruega" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">Tu proxima aventura comienza aqui</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            <span className="text-foreground">Descubri el mundo</span>
            <br />
            <span className="text-primary font-serif italic">con nosotros</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
            Explora destinos unicos y paisajes increibles. Diseñamos experiencias 
            inolvidables con atencion personalizada y los mejores precios.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="#destinos" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all group w-full sm:w-auto justify-center"
            >
              Ver destinos
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#contacto" 
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-medium hover:bg-secondary/80 transition-all w-full sm:w-auto justify-center border border-border"
            >
              Contactanos
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mb-2">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
