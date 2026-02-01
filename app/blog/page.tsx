import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Viajes | Headway Trips',
  description: 'Noticias, consejos y guías para tus próximas aventuras.',
};

export default function BlogPage() {
  const posts = [
    {
      slug: 'mejores-epicas-bariloche',
      title: 'Las mejores épocas para visitar Bariloche',
      excerpt: 'Descubrí cuándo viajar para disfrutar de la nieve o los lagos cristalinos.',
      date: '14 Enero, 2026',
    },
    {
      slug: 'guia-cataratas',
      title: 'Guía completa para recorrer las Cataratas del Iguazú',
      excerpt: 'Tips esenciales para tu visita a una de las maravillas naturales del mundo.',
      date: '10 Enero, 2026',
    },
  ];

  return (
    <main className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">Blog de Viajes</h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all">
              <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
              <h2 className="text-2xl font-serif font-bold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Link href="#" className="text-primary font-medium hover:underline">
                Leer más →
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
