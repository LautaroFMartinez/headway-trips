import { trips } from '@/lib/trips-data';
import { blogPosts } from '@/lib/blog-data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa del Sitio',
  description: 'Navegá por todas las páginas y destinos de Headway Trips',
};

export default function HTMLSitemap() {
  const regions = Array.from(new Set(trips.map((t) => t.region)));

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl pt-28">
        <h1 className="text-4xl font-bold mb-8">Mapa del Sitio</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Páginas Principales</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/viaje" className="text-primary hover:underline">
                Todos los Viajes
              </Link>
            </li>
            <li>
              <Link href="/comparador" className="text-primary hover:underline">
                Comparador de Destinos
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-primary hover:underline">
                Blog de Viajes
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Información</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/nosotros" className="text-primary hover:underline">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-primary hover:underline">
                Preguntas Frecuentes
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="text-primary hover:underline">
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Blog</h2>
          <ul className="space-y-2">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Destinos por Región</h2>
          {regions.map((region) => {
            const regionTrips = trips.filter((t) => t.region === region);
            return (
              <div key={region} className="mb-6">
                <h3 className="text-xl font-medium capitalize mb-3">{region}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                  {regionTrips.map((trip) => (
                    <li key={trip.id}>
                      <Link href={`/viaje/${trip.id}`} className="text-primary hover:underline">
                        {trip.title} - {trip.subtitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Todos los Destinos</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {trips.map((trip) => (
              <li key={trip.id}>
                <Link href={`/viaje/${trip.id}`} className="block p-3 rounded-lg border hover:border-primary hover:shadow-md transition-all">
                  <div className="font-medium">{trip.title}</div>
                  <div className="text-sm text-muted-foreground">{trip.subtitle}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}
