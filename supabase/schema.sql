-- =============================================
-- HEADWAY TRIPS - SUPABASE SCHEMA
-- =============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Paste & Run

-- =============================================
-- 1. TABLA: trips (Viajes/Destinos)
-- =============================================
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price TEXT NOT NULL,
  price_value NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Campos extendidos para sistema de reservas
  available BOOLEAN DEFAULT TRUE,
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  start_dates DATE[] DEFAULT '{}',
  max_capacity INTEGER DEFAULT 20,
  current_bookings INTEGER DEFAULT 0,
  difficulty_level TEXT DEFAULT 'moderate' CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'difficult')),
  min_age INTEGER DEFAULT 0,
  accommodation_type TEXT DEFAULT 'hotel',
  cancellation_policy TEXT DEFAULT 'Cancelación gratuita hasta 30 días antes del viaje.',
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_trips_region ON public.trips(region);
CREATE INDEX IF NOT EXISTS idx_trips_price ON public.trips(price_value);
CREATE INDEX IF NOT EXISTS idx_trips_available ON public.trips(available);
CREATE INDEX IF NOT EXISTS idx_trips_tags ON public.trips USING GIN(tags);

-- =============================================
-- 2. TABLA: quote_requests (Solicitudes de Cotización)
-- =============================================
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información del viaje
  trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  
  -- Información del cliente
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_country TEXT,
  
  -- Detalles de la solicitud
  travel_date DATE,
  adults INTEGER DEFAULT 1 CHECK (adults >= 1),
  children INTEGER DEFAULT 0 CHECK (children >= 0),
  message TEXT,
  
  -- Estado de la solicitud
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'confirmed', 'cancelled')),
  
  -- Información del agente (para seguimiento interno)
  assigned_agent TEXT,
  internal_notes TEXT,
  quoted_price NUMERIC(10, 2),
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Marketing
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotes_trip ON public.quote_requests(trip_id);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON public.quote_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON public.quote_requests(created_at DESC);

-- =============================================
-- 3. TABLA: bookings (Reservas Confirmadas)
-- =============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relación con cotización (opcional)
  quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  
  -- Información del viaje
  trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  travel_date DATE NOT NULL,
  
  -- Información del cliente principal
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_document_type TEXT, -- DNI, Passport, etc.
  customer_document_number TEXT,
  customer_country TEXT,
  
  -- Detalles de la reserva
  adults INTEGER DEFAULT 1 CHECK (adults >= 1),
  children INTEGER DEFAULT 0 CHECK (children >= 0),
  
  -- Precios
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_code TEXT,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Estado
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  
  -- Notas
  special_requests TEXT,
  internal_notes TEXT,
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON public.bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(customer_email);

-- =============================================
-- 4. TABLA: booking_passengers (Pasajeros)
-- =============================================
CREATE TABLE IF NOT EXISTS public.booking_passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Información del pasajero
  full_name TEXT NOT NULL,
  document_type TEXT, -- DNI, Passport, etc.
  document_number TEXT,
  nationality TEXT,
  birth_date DATE,
  is_adult BOOLEAN DEFAULT TRUE,
  
  -- Contacto (opcional para pasajeros adicionales)
  email TEXT,
  phone TEXT,
  
  -- Preferencias
  dietary_restrictions TEXT,
  medical_conditions TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON public.booking_passengers(booking_id);

-- =============================================
-- 5. TABLA: contact_messages (Mensajes de Contacto)
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  
  -- Estado
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at DESC);

-- =============================================
-- 6. FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_quotes_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Función para actualizar current_bookings al confirmar reserva
CREATE OR REPLACE FUNCTION update_trip_bookings()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE public.trips 
    SET current_bookings = current_bookings + NEW.adults + NEW.children
    WHERE id = NEW.trip_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Si cambia a confirmado
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE public.trips 
      SET current_bookings = current_bookings + NEW.adults + NEW.children
      WHERE id = NEW.trip_id;
    -- Si cambia de confirmado a cancelado
    ELSIF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'refunded') THEN
      UPDATE public.trips 
      SET current_bookings = GREATEST(0, current_bookings - OLD.adults - OLD.children)
      WHERE id = NEW.trip_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_bookings
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_bookings();

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para trips (lectura pública)
CREATE POLICY "Trips are viewable by everyone" 
  ON public.trips FOR SELECT 
  USING (true);

CREATE POLICY "Trips are manageable by authenticated users" 
  ON public.trips FOR ALL 
  USING (auth.role() = 'authenticated');

-- Políticas para quote_requests (crear público, ver solo autenticado)
CREATE POLICY "Anyone can create quote requests" 
  ON public.quote_requests FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Quote requests viewable by authenticated users" 
  ON public.quote_requests FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Quote requests manageable by authenticated users" 
  ON public.quote_requests FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Políticas para bookings (crear público, ver solo autenticado)
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Bookings viewable by authenticated users" 
  ON public.bookings FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Bookings manageable by authenticated users" 
  ON public.bookings FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Políticas para booking_passengers
CREATE POLICY "Anyone can create passengers" 
  ON public.booking_passengers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Passengers viewable by authenticated users" 
  ON public.booking_passengers FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Políticas para contact_messages
CREATE POLICY "Anyone can create contact messages" 
  ON public.contact_messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Contact messages viewable by authenticated users" 
  ON public.contact_messages FOR SELECT 
  USING (auth.role() = 'authenticated');

-- =============================================
-- 8. COMENTARIOS DE DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE public.trips IS 'Catálogo de viajes/destinos disponibles';
COMMENT ON TABLE public.quote_requests IS 'Solicitudes de cotización de clientes';
COMMENT ON TABLE public.bookings IS 'Reservas confirmadas de viajes';
COMMENT ON TABLE public.booking_passengers IS 'Pasajeros asociados a cada reserva';
COMMENT ON TABLE public.contact_messages IS 'Mensajes del formulario de contacto';

COMMENT ON COLUMN public.trips.difficulty_level IS 'Nivel de dificultad física: easy, moderate, challenging, difficult';
COMMENT ON COLUMN public.quote_requests.status IS 'Estado: pending, contacted, quoted, confirmed, cancelled';
COMMENT ON COLUMN public.bookings.status IS 'Estado: pending, confirmed, paid, completed, cancelled, refunded';
