-- =============================================
-- MIGRACIÓN: Añadir columnas faltantes a trips
-- =============================================
-- Ejecutar este script en Supabase Dashboard > SQL Editor
-- para añadir las columnas necesarias para el editor de viajes

-- Añadir columna gallery (array de URLs de imágenes)
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';

-- Añadir columna pdf_url (URL del PDF del itinerario)
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Añadir columna itinerary (datos del itinerario en JSON)
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]';

-- Añadir columna featured (viaje destacado)
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Crear índice para búsquedas por featured
CREATE INDEX IF NOT EXISTS idx_trips_featured ON public.trips(featured);

-- Comentarios para documentación
COMMENT ON COLUMN public.trips.gallery IS 'Array de URLs de imágenes adicionales del viaje';
COMMENT ON COLUMN public.trips.pdf_url IS 'URL del PDF con el itinerario detallado';
COMMENT ON COLUMN public.trips.itinerary IS 'Datos estructurados del itinerario día a día';
COMMENT ON COLUMN public.trips.featured IS 'Indica si el viaje aparece destacado en la página principal';
