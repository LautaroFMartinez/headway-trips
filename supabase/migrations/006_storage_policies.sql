-- Crear bucket 'trips' si no existe (público para lectura)
INSERT INTO storage.buckets (id, name, public)
VALUES ('trips', 'trips', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir lectura pública de archivos
CREATE POLICY "Public read access on trips bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'trips');

-- Permitir upload a usuarios autenticados
CREATE POLICY "Authenticated users can upload to trips bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trips');

-- Permitir que usuarios autenticados actualicen sus archivos
CREATE POLICY "Authenticated users can update in trips bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'trips');

-- Permitir que usuarios autenticados eliminen archivos
CREATE POLICY "Authenticated users can delete from trips bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trips');
