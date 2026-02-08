import { getSupabaseClient } from './supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PDF_SIZE = 150 * 1024 * 1024; // 150MB

/**
 * Sube un archivo directamente a Supabase Storage desde el cliente,
 * evitando el límite de body de Vercel (4.5MB).
 */
export async function uploadToStorage(
  file: File,
  type: 'main' | 'gallery' | 'pdf'
): Promise<{ url: string; path: string; filename: string }> {
  const isPdf = type === 'pdf';
  const allowedTypes = isPdf ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
  const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido. Formatos aceptados: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw new Error(`El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`);
  }

  const supabase = getSupabaseClient();

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || (isPdf ? 'pdf' : 'jpg');
  const folder = isPdf ? 'pdfs' : 'images';
  const filename = `${folder}/${timestamp}-${randomId}.${extension}`;

  const { data, error } = await supabase.storage.from('trips').upload(filename, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Error al subir el archivo');
  }

  const { data: urlData } = supabase.storage.from('trips').getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
    filename: file.name,
  };
}
