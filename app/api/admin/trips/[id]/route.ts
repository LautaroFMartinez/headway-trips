import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un viaje específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: trip, error } = await supabase.from('trips').select('*').eq('id', id).single();

    if (error || !trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar viaje completo
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'region', 'price', 'duration_days', 'image_url'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    // Parse itinerary: si es string, convertir a array de días
    let itineraryData: unknown[] = [];
    if (body.itinerary) {
      if (typeof body.itinerary === 'string') {
        const lines = body.itinerary.split('\n').filter((line: string) => line.trim());
        itineraryData = lines.map((line: string, index: number) => ({
          day: index + 1,
          description: line.trim(),
        }));
      } else if (Array.isArray(body.itinerary)) {
        itineraryData = body.itinerary;
      }
    }

    // Build update object, only including content_blocks if provided
    const updateData: Record<string, unknown> = {
      title: body.title,
      subtitle: body.short_description || '',
      description: body.description || '',
      region: body.region,
      duration: `${body.duration_days} días / ${body.duration_nights || body.duration_days - 1} noches`,
      duration_days: body.duration_days,
      price: `$${body.price.toLocaleString()} USD`,
      price_value: body.price,
      image: body.image_url,
      hero_image: body.image_url,
      gallery: body.gallery || [],
      includes: body.includes || [],
      excludes: body.excludes || [],
      itinerary: itineraryData,
      pdf_url: body.pdf_url || null,
      available: body.is_active ?? true,
      featured: body.is_featured || false,
      updated_at: new Date().toISOString(),
    };

    // Only include content_blocks if explicitly provided
    if (body.content_blocks !== undefined) {
      updateData.content_blocks = body.content_blocks;
    }

    const { data: trip, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating trip:', error);
      return NextResponse.json({ error: 'Error al actualizar el viaje' }, { status: 500 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH - Actualización parcial (para toggles)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    // Map frontend field names to database column names
    if (body.is_active !== undefined) updates.available = body.is_active;
    if (body.is_featured !== undefined) updates.featured = body.is_featured;
    if (body.price !== undefined) {
      updates.price_value = body.price;
      updates.price = `$${body.price.toLocaleString()} USD`;
    }
    if (body.content_blocks !== undefined) updates.content_blocks = body.content_blocks;

    const { data: trip, error } = await supabase.from('trips').update(updates).eq('id', id).select().single();

    if (error) {
      console.error('Error patching trip:', error);
      return NextResponse.json({ error: 'Error al actualizar el viaje' }, { status: 500 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Patch trip error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar viaje
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('trips').delete().eq('id', id);

    if (error) {
      console.error('Error deleting trip:', error);
      return NextResponse.json({ error: 'Error al eliminar el viaje' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
