import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag, Link2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Newsletter } from '@/components/newsletter';
import {
  getPostBySlug,
  getPostsByCategory,
  getCategoryName,
  getAllBlogPosts,
} from '@/lib/blog-db';
import {
  generateSEOMetadata,
  generateBreadcrumbSchema,
  generateBlogPostingSchema,
} from '@/lib/seo-helpers';

export const revalidate = 60; // Revalidate every minute

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    image: `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt.slice(0, 80))}`,
    type: 'article',
    keywords: [post.category, 'blog viajes', 'Europa'],
    author: post.author.name,
    publishedTime: post.publishedAt,
  });
}

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
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
      {initials}
    </div>
  );
}

function CopyLinkButton() {
  return (
    <button
      id="copy-link-btn"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-4 py-2 transition-colors"
      title="Copiar enlace"
    >
      <Link2 className="h-4 w-4" />
      <span>Copiar enlace</span>
    </button>
  );
}

function BlogContent({ content }: { content: string }) {
  // Check if content is already HTML (from WYSIWYG editor)
  const isHtml = content.trim().startsWith('<');
  
  if (isHtml) {
    // Content from TipTap WYSIWYG editor - already HTML
    return (
      <div
        className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary/30"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  // Legacy Markdown content - convert to HTML
  const html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
    // Wrap consecutive li elements in ul
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc space-y-1 my-4">$1</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
    // Paragraphs (lines that aren't already HTML)
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed;
      return `<p class="text-muted-foreground leading-relaxed mb-4">${trimmed}</p>`;
    })
    .join('\n');

  return (
    <div
      className="prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allRelated = await getPostsByCategory(post.category);
  const relatedPosts = allRelated
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const blogPostingSchema = generateBlogPostingSchema({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    image: `https://headwaytrips.com${post.coverImage}`,
    datePublished: post.publishedAt,
    author: post.author.name,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://headwaytrips.com' },
    { name: 'Blog', url: 'https://headwaytrips.com/blog' },
    { name: post.title, url: `https://headwaytrips.com/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Copy link script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var btn = document.getElementById('copy-link-btn');
              if (btn) {
                btn.addEventListener('click', function() {
                  navigator.clipboard.writeText(window.location.href).then(function() {
                    var span = btn.querySelector('span');
                    var originalText = span.textContent;
                    span.textContent = 'Enlace copiado';
                    setTimeout(function() { span.textContent = originalText; }, 2000);
                  });
                });
              }
            })();
          `,
        }}
      />

      <Header />
      <main className="pt-20">
        {/* Hero Image */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </section>

        {/* Article Content */}
        <section className="relative -mt-32 z-10 pb-16 md:pb-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <article className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-lg">
                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Inicio
                    </Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-foreground transition-colors">
                      Blog
                    </Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                  </nav>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent uppercase tracking-widest">
                      {getCategoryName(post.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Avatar name={post.author.name} />
                      <div>
                        <p className="font-medium text-foreground">{post.author.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime} min de lectura</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-8">
                    <BlogContent content={post.content} />
                  </div>

                  {/* Share & Actions */}
                  <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver al blog
                    </Link>

                    <CopyLinkButton />
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-8 lg:mt-0 mt-8">
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-accent rounded-full" />
                      Artículos relacionados
                    </h3>
                    <ul className="space-y-4">
                      {relatedPosts.map((related) => (
                        <li key={related.slug}>
                          <Link
                            href={`/blog/${related.slug}`}
                            className="flex gap-3 group"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={related.coverImage}
                                alt={related.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {related.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {related.readingTime} min de lectura
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Newsletter */}
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-foreground mb-2">
                    Suscribite al newsletter
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Recibí los mejores tips y ofertas exclusivas.
                  </p>
                  <Newsletter variant="inline" />
                </div>

                {/* Back to Blog */}
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <p className="text-muted-foreground text-sm mb-4">
                    Explorá más artículos sobre viajes, tips y destinos.
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                  >
                    Ver todos los artículos
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
