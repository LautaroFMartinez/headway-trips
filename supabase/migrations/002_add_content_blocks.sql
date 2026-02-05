-- =============================================
-- MIGRACIÓN: Añadir columna content_blocks a trips
-- =============================================
-- Ejecutar este script en Supabase Dashboard > SQL Editor
-- para añadir soporte de bloques de contenido tipo MOGU

-- Añadir columna content_blocks (array de bloques de contenido en JSON)
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Crear índice GIN para búsquedas eficientes en JSONB
CREATE INDEX IF NOT EXISTS idx_trips_content_blocks ON public.trips USING GIN(content_blocks);

-- Comentario para documentación
COMMENT ON COLUMN public.trips.content_blocks IS 'Bloques de contenido estructurado tipo MOGU (texto, itinerario, servicios, precios, imágenes, etc.)';
