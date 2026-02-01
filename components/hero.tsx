import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image src="/Alesund_Noruega.webp" alt="Paisaje de Alesund Noruega" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-primary font-medium tracking-widest uppercase mb-4">Tu próxima aventura comienza aquí</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          <span className="text-foreground">Descubrí el mundo con nosotros</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">Explora destinos únicos y paisajes increíbles. Diseñamos experiencias inolvidables con atención personalizada y los mejores precios del mercado.</p>
        <a href="#destinos" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105">
          Ver Destinos
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
