-- =============================================
-- MIGRACIÓN: Alinear schema con el código del admin panel
-- =============================================
-- Ejecutar en Supabase Dashboard > SQL Editor
-- Corrige las inconsistencias entre el schema original y el código

-- =============================================
-- 1. contact_messages: Agregar columnas faltantes
-- =============================================

-- El código usa un campo `read` boolean en vez del `status` text
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;

-- Sincronizar `read` con `status` existente
UPDATE public.contact_messages
SET read = CASE WHEN status IN ('read', 'replied', 'archived') THEN TRUE ELSE FALSE END
WHERE read IS NULL OR read = FALSE;

-- El código usa `subject` para el asunto del mensaje
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT '';

-- El código intenta actualizar `updated_at`
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Trigger para auto-update de updated_at en contact_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_contact_messages_updated_at'
  ) THEN
    CREATE TRIGGER trigger_contact_messages_updated_at
      BEFORE UPDATE ON public.contact_messages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END
$$;

-- Política para UPDATE en contact_messages (faltaba)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Contact messages updatable by authenticated users'
  ) THEN
    CREATE POLICY "Contact messages updatable by authenticated users"
      ON public.contact_messages FOR UPDATE
      USING (auth.role() = 'authenticated');
  END IF;
END
$$;

-- Política para DELETE en contact_messages (faltaba)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Contact messages deletable by authenticated users'
  ) THEN
    CREATE POLICY "Contact messages deletable by authenticated users"
      ON public.contact_messages FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END
$$;

-- =============================================
-- 2. quote_requests: Agregar campo `notes` (alias de internal_notes)
-- =============================================

-- El código usa `notes` pero el schema tiene `internal_notes`
-- Agregar `notes` como alias para mantener compatibilidad
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Copiar datos existentes de internal_notes a notes
UPDATE public.quote_requests
SET notes = internal_notes
WHERE internal_notes IS NOT NULL AND (notes IS NULL OR notes = '');

-- Política para DELETE en quote_requests (faltaba)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Quote requests deletable by authenticated users'
  ) THEN
    CREATE POLICY "Quote requests deletable by authenticated users"
      ON public.quote_requests FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END
$$;

-- =============================================
-- 3. Comentarios actualizados
-- =============================================
COMMENT ON COLUMN public.contact_messages.read IS 'Indica si el mensaje fue leído por el admin';
COMMENT ON COLUMN public.contact_messages.subject IS 'Asunto del mensaje de contacto';
COMMENT ON COLUMN public.contact_messages.updated_at IS 'Última actualización del registro';
COMMENT ON COLUMN public.quote_requests.notes IS 'Notas internas del agente sobre la cotización';
