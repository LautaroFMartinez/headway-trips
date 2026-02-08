-- Add end date columns to trips table
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS end_dates DATE[];
