-- Viajes que se realizan con Cachi y Nano (filtro en página principal)
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS con_cachi_y_nano BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.trips.con_cachi_y_nano IS 'Indica si el viaje es con Cachi y Nano (filtro en home)';

CREATE INDEX IF NOT EXISTS idx_trips_con_cachi_y_nano ON public.trips(con_cachi_y_nano) WHERE con_cachi_y_nano = TRUE;
