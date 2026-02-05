import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Newsletter } from '@/components/newsletter';
import { blogPosts, blogCategories, getFeaturedPost, getCategoryName } from '@/lib/blog-data';
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog de Viajes',
  description: 'Noticias, consejos, guías y tips para tus próximas aventuras. Descubrí los mejores destinos de Argentina y el mundo.',
  url: '/blog',
  keywords: ['blog viajes', 'consejos viaje', 'guías turismo', 'destinos Argentina'],
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
      {initials}
    </div>
  );
}

export default function BlogPage() {
  const featuredPost = getFeaturedPost();
  const otherPosts = blogPosts.filter((post) => !post.featured);
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://headwaytrips.com' },
    { name: 'Blog', url: 'https://headwaytrips.com/blog' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />
      <main className="pt-20">
        {/* Hero with Featured Post */}
        {featuredPost && (
          <section className="relative min-h-[500px] md:min-h-[600px] flex items-end overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 pb-16 md:pb-20 relative z-10">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-accent-foreground/20" />
                  Artículo destacado
                </div>

                {/* Category */}
                <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
                  {getCategoryName(featuredPost.category)}
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                  {featuredPost.title}
                </h1>

                {/* Excerpt */}
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                  {featuredPost.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Avatar name={featuredPost.author.name} />
                    <span>{featuredPost.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readingTime} min de lectura</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all group"
                >
                  Leer artículo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Blog Grid */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Últimos <span className="font-serif italic text-primary">artículos</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  {otherPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                            {getCategoryName(post.category)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar name={post.author.name} />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{post.readingTime} min</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Categories */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full" />
                    Categorías
                  </h3>
                  <ul className="space-y-2">
                    {blogCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/blog?category=${category.id}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary transition-colors group"
                        >
                          <span className="text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {category.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Posts */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full" />
                    Más leídos
                  </h3>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 3).map((post, index) => (
                      <li key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex gap-3 group"
                        >
                          <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-accent transition-colors">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(post.publishedAt)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-foreground mb-2">
                    Suscribite al newsletter
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Recibí los mejores tips y ofertas exclusivas.
                  </p>
                  <Newsletter variant="inline" />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="container mx-auto px-6 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
