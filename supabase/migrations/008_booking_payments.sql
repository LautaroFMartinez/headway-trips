-- =============================================
-- 008: Tabla booking_payments (Historial de pagos)
-- =============================================

CREATE TABLE IF NOT EXISTS public.booking_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT DEFAULT 'transferencia',
  reference TEXT,
  notes TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por booking
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking_id ON public.booking_payments(booking_id);

-- RLS
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booking payments viewable by authenticated users"
  ON public.booking_payments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Booking payments insertable by authenticated users"
  ON public.booking_payments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Booking payments deletable by authenticated users"
  ON public.booking_payments FOR DELETE
  USING (auth.role() = 'authenticated');
