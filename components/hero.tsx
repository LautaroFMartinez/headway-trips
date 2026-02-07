import Image from 'next/image';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: MapPin, value: '25+', label: 'Destinos' },
  { icon: Calendar, value: '10+', label: 'Años de experiencia' },
  { icon: Users, value: '500+', label: 'Viajeros felices' },
];

// Estilos de text-shadow multi-capa para legibilidad extrema
const textShadowStyles = {
  // Títulos principales: sombra fuerte multi-capa
  heading: {
    textShadow: `
      0 2px 4px rgba(0,0,0,0.8),
      0 4px 8px rgba(0,0,0,0.6),
      0 8px 16px rgba(0,0,0,0.4),
      0 0 40px rgba(0,0,0,0.5)
    `.trim().replace(/\s+/g, ' ')
  },
  // Texto del badge y subtítulos
  badge: {
    textShadow: `
      0 1px 2px rgba(0,0,0,0.9),
      0 2px 4px rgba(0,0,0,0.7),
      0 4px 8px rgba(0,0,0,0.5)
    `.trim().replace(/\s+/g, ' ')
  },
  // Descripción principal
  description: {
    textShadow: `
      0 1px 3px rgba(0,0,0,0.9),
      0 3px 6px rgba(0,0,0,0.7),
      0 6px 12px rgba(0,0,0,0.5),
      0 0 30px rgba(0,0,0,0.4)
    `.trim().replace(/\s+/g, ' ')
  },
  // Stats y texto pequeño
  stats: {
    textShadow: `
      0 1px 2px rgba(0,0,0,0.8),
      0 2px 4px rgba(0,0,0,0.6),
      0 0 20px rgba(0,0,0,0.4)
    `.trim().replace(/\s+/g, ' ')
  },
  // Scroll indicator
  scroll: {
    textShadow: `
      0 1px 2px rgba(0,0,0,0.7),
      0 2px 4px rgba(0,0,0,0.5)
    `.trim().replace(/\s+/g, ' ')
  }
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - SIN overlay que tape la imagen */}
      <div className="absolute inset-0">
        <Image 
          src="/hero-background.jpeg" 
          alt="Paisaje de viaje" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw" 
          quality={85} 
        />
        
        {/* Viñeta radial - oscurece bordes, deja centro claro para el tiburón ballena */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 80% 70% at 50% 50%,
              transparent 0%,
              transparent 30%,
              rgba(0,0,0,0.15) 50%,
              rgba(0,0,0,0.35) 70%,
              rgba(0,0,0,0.55) 100%
            )`
          }}
        />
        
        {/* Gradiente lineal superior - muy sutil para el navbar */}
        <div 
          className="absolute inset-x-0 top-0 h-24"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
          }}
        />
        
        {/* Gradiente lineal inferior - solo para zona de stats */}
        <div 
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 40%, transparent 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge - con text-shadow en lugar de fondo */}
          <div 
            className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 mb-8 backdrop-blur-[2px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span 
              className="text-sm font-medium text-white"
              style={textShadowStyles.badge}
            >
              Tu proxima aventura comienza aqui
            </span>
          </div>

          {/* Heading - text-shadow multi-capa fuerte */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight"
            style={textShadowStyles.heading}
          >
            <span className="text-white">Descubri el mundo</span>
            <br />
            <span className="text-primary font-serif italic drop-shadow-lg">con nosotros</span>
          </h1>

          {/* Description - SIN recuadro, solo text-shadow fuerte */}
          <p 
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 text-pretty leading-relaxed font-medium"
            style={textShadowStyles.description}
          >
            Explora destinos unicos y paisajes increibles. Diseñamos experiencias inolvidables con atencion personalizada y los mejores precios.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="#destinos" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all group w-full sm:w-auto justify-center shadow-lg shadow-primary/30"
            >
              Ver destinos
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#contacto" 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-medium hover:bg-white/20 transition-all w-full sm:w-auto justify-center border border-white/30 shadow-lg"
              style={textShadowStyles.badge}
            >
              Contactanos
            </Link>
          </div>

          {/* Stats - con text-shadow en lugar de fondos */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div 
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 border border-white/20"
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                  >
                    <Icon className="w-5 h-5 text-accent drop-shadow-lg" />
                  </div>
                  <div 
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={textShadowStyles.stats}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-xs sm:text-sm text-white/90"
                    style={textShadowStyles.scroll}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span 
            className="text-xs uppercase tracking-widest text-white/80"
            style={textShadowStyles.scroll}
          >
            Scroll
          </span>
          <div 
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
