-- App settings table for runtime configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default: payments enabled
INSERT INTO public.app_settings (key, value) VALUES ('payments_enabled', 'true')
ON CONFLICT (key) DO NOTHING;
