-- =============================================
-- MIGRACIÓN: Crear tabla newsletter_subscribers
-- =============================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- Habilitar RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Solo service role puede INSERT (desde API routes)
CREATE POLICY "Newsletter subscribers insertable by service role"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Solo authenticated users (admin) pueden SELECT
CREATE POLICY "Newsletter subscribers readable by authenticated users"
  ON public.newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Solo authenticated users (admin) pueden UPDATE (para cambiar status)
CREATE POLICY "Newsletter subscribers updatable by authenticated users"
  ON public.newsletter_subscribers FOR UPDATE
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.newsletter_subscribers IS 'Suscriptores al newsletter';
COMMENT ON COLUMN public.newsletter_subscribers.status IS 'Estado: active o unsubscribed';
