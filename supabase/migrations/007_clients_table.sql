-- =============================================
-- MIGRACIÓN 007: Tabla de Clientes
-- =============================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  birth_date DATE,
  document_type TEXT,
  document_number TEXT,
  passport_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_full_name ON public.clients(full_name);
CREATE INDEX IF NOT EXISTS idx_clients_document_number ON public.clients(document_number);
CREATE INDEX IF NOT EXISTS idx_clients_passport_number ON public.clients(passport_number);

-- FK en bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);

-- Trigger updated_at
CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients viewable by authenticated users"
  ON public.clients FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Clients insertable by authenticated users"
  ON public.clients FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Clients updatable by authenticated users"
  ON public.clients FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Clients deletable by authenticated users"
  ON public.clients FOR DELETE
  USING (auth.role() = 'authenticated');
