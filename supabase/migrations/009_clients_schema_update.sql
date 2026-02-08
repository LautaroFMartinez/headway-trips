-- =============================================
-- 009: Actualizar esquema de clientes
-- Sacar document_type/document_number
-- Agregar relación contacto emergencia, país emisión pasaporte, vencimiento pasaporte
-- =============================================

-- Eliminar campos de documento
ALTER TABLE public.clients DROP COLUMN IF EXISTS document_type;
ALTER TABLE public.clients DROP COLUMN IF EXISTS document_number;

-- Eliminar índice de document_number
DROP INDEX IF EXISTS idx_clients_document_number;

-- Agregar nuevos campos
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS passport_issuing_country TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS passport_expiry_date DATE;
