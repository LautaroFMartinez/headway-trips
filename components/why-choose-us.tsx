import { Shield, Award, Users, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Seguridad garantizada',
    description: 'Viaja con total tranquilidad. Todos nuestros destinos cumplen con los mas altos estandares.',
  },
  {
    icon: Award,
    title: 'Experiencias unicas',
    description: 'Diseñamos itinerarios exclusivos que te llevan mas alla de lo turistico convencional.',
  },
  {
    icon: Users,
    title: 'Grupos pequeños',
    description: 'Maximo 15 personas por grupo para garantizar una atencion personalizada.',
  },
  {
    icon: HeartHandshake,
    title: 'Atencion 24/7',
    description: 'Equipo de soporte disponible en todo momento para asistirte antes y durante tu viaje.',
  },
];

const stats = [
  { value: '500+', label: 'Viajeros' },
  { value: '25+', label: 'Destinos' },
  { value: '98%', label: 'Satisfaccion' },
  { value: '10+', label: 'Años' },
];

export function WhyChooseUs() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
            Por que elegirnos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Tu viaje perfecto <span className="font-serif italic text-primary">comienza aqui</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Nos dedicamos a crear experiencias de viaje inolvidables con la mejor relacion calidad-precio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Mas de 500 viajeros satisfechos
            </h3>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              Unite a nuestra comunidad de aventureros que han descubierto el mundo con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
