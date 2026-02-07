-- =============================================
-- BLOG POSTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('destinos', 'tips', 'cultura', 'aventura', 'gastronomia')),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  published_at DATE NOT NULL,
  reading_time INTEGER NOT NULL CHECK (reading_time > 0),
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_active ON public.blog_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Trigger para updated_at
CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas para blog_posts (lectura pública para activos)
CREATE POLICY "Active blog posts are viewable by everyone" 
  ON public.blog_posts FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Blog posts are manageable by authenticated users" 
  ON public.blog_posts FOR ALL 
  USING (auth.role() = 'authenticated');

-- Comentario de documentación
COMMENT ON TABLE public.blog_posts IS 'Artículos del blog de viajes';
