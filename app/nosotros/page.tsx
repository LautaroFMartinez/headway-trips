import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Shield, Award, Users, HeartHandshake, Globe, MapPin, Plane, Star } from 'lucide-react';
import { generateSEOMetadata, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';
import { TeamMemberCard } from '@/components/team-member-card';
import { teamMembers } from '@/lib/nosotros-data';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sobre Nosotros',
  description: 'Conoce a Headway Trips, tu agencia de viajes de confianza internacional. Mas de 10 años creando experiencias de viaje unicas e inolvidables.',
  url: '/nosotros',
  keywords: ['sobre nosotros', 'agencia de viajes internacional', 'equipo headway trips', 'historia'],
});

const values = [
  {
    icon: Shield,
    title: 'Confianza',
    description: 'Cada viaje esta respaldado por nuestra experiencia y compromiso con tu seguridad.',
  },
  {
    icon: HeartHandshake,
    title: 'Pasion',
    description: 'Amamos lo que hacemos y eso se refleja en cada itinerario que diseñamos.',
  },
  {
    icon: Award,
    title: 'Excelencia',
    description: 'Buscamos superar tus expectativas con atencion al detalle en cada aspecto.',
  },
  {
    icon: Users,
    title: 'Personalizacion',
    description: 'Cada viajero es unico. Creamos experiencias a medida de tus sueños.',
  },
];

const milestones = [
  { year: '2014', title: 'Nuestros inicios', description: 'Fundamos Headway Trips con la vision de hacer viajes accesibles y memorables.' },
  { year: '2016', title: 'Expansion regional', description: 'Incorporamos destinos en toda Latinoamerica y el Caribe.' },
  { year: '2019', title: 'Alcance global', description: 'Ampliamos nuestra oferta a Europa, Asia y Oceania.' },
  { year: '2022', title: 'Transformacion digital', description: 'Lanzamos nuestra plataforma online para una experiencia mas agil.' },
  { year: '2024', title: 'Hoy', description: 'Mas de 500 viajeros satisfechos y 25+ destinos en todo el mundo.' },
];

const stats = [
  { icon: Globe, value: '25+', label: 'Destinos' },
  { icon: Users, value: '500+', label: 'Viajeros' },
  { icon: Star, value: '98%', label: 'Satisfaccion' },
  { icon: Plane, value: '10+', label: 'Años de experiencia' },
];

export default function NosotrosPage() {
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://headwaytrips.com' },
    { name: 'Sobre Nosotros', url: 'https://headwaytrips.com/nosotros' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Sobre nosotros
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Hacemos que tus sueños de viaje <span className="font-serif italic text-accent">se hagan realidad</span>
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
              Somos una agencia de viajes internacional diseñamos experiencias unicas e inolvidables alrededor del mundo.
            </p>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
                Nuestra historia
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Un camino de <span className="font-serif italic text-primary">pasion y aventura</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Headway Trips nacio de la conviccion de que viajar transforma vidas. Comenzamos como un pequeño equipo con grandes sueños, y hoy somos una agencia reconocida por crear experiencias que van mas alla del turismo convencional.
              </p>
            </div>
          </div>
            {/* aca poner timeline con fotitos de ig etc*/}
        </section>

        {/* Nuestro equipo */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
                Nuestro equipo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Los rostros detrás de <span className="font-serif italic text-primary">Headway Trips</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tres apasionados por los viajes que diseñan cada experiencia con dedicación
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
                Nuestros valores
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Lo que nos <span className="font-serif italic text-primary">define</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cada decision que tomamos esta guiada por estos principios fundamentales
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
       {/* <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="bg-primary rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Numeros que hablan por nosotros
                </h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto">
                  Cada numero representa viajeros que confiaron en nosotros para sus aventuras
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.value}</div>
                      <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
       */}
        {/* Por qué elegirnos */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
                Por que elegirnos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Tu proxima aventura esta a <span className="font-serif italic text-primary">un paso</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Destinos cuidadosamente seleccionados</h3>
                <p className="text-sm text-muted-foreground">
                  Cada destino que ofrecemos ha sido visitado y evaluado por nuestro equipo para garantizar la mejor experiencia.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Grupos reducidos</h3>
                <p className="text-sm text-muted-foreground">
                  Maximo 15 personas por grupo para una atencion personalizada y experiencias mas autenticas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Soporte 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo esta disponible en todo momento antes, durante y despues de tu viaje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Listo para tu proxima aventura?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Explora nuestros destinos o contactanos para diseñar un viaje a tu medida.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#destinos"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Plane className="w-4 h-4" />
                Explorar destinos
              </a>
              <a
                href="/#contacto"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                Contactanos
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
