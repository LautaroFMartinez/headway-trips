-- Add Revolut-specific columns to booking_payments
ALTER TABLE public.booking_payments
  ADD COLUMN IF NOT EXISTS revolut_order_id TEXT,
  ADD COLUMN IF NOT EXISTS revolut_status TEXT;

CREATE INDEX IF NOT EXISTS idx_booking_payments_revolut_order
  ON public.booking_payments(revolut_order_id)
  WHERE revolut_order_id IS NOT NULL;
