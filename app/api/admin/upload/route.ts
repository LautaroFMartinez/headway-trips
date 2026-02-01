import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó un archivo' }, { status: 400 });
    }

    if (!type || !['main', 'gallery', 'pdf'].includes(type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 });
    }

    // Validate file type
    const isPdf = type === 'pdf';
    const allowedTypes = isPdf ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Tipo de archivo no permitido. Formatos aceptados: ${allowedTypes.join(', ')}` }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: `El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || (isPdf ? 'pdf' : 'jpg');
    const folder = isPdf ? 'pdfs' : 'images';
    const filename = `${folder}/${timestamp}-${randomId}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from('trips').upload(filename, buffer, {
      contentType: file.type,
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('trips').getPublicUrl(data.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
      filename: file.name,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Remove file from storage
export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json({ error: 'No se proporcionó la ruta del archivo' }, { status: 400 });
    }

    const { error } = await supabase.storage.from('trips').remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Error al eliminar el archivo' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
