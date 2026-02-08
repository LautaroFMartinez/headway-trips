-- Public booking flow: departure_date on trips, completion token on bookings
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS departure_date DATE;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS completion_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS details_completed BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_bookings_completion_token
  ON public.bookings(completion_token) WHERE completion_token IS NOT NULL;
