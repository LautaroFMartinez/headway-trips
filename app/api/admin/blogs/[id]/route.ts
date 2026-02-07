import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un blog específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: blog, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();

    if (error || !blog) {
      return NextResponse.json({ error: 'Blog no encontrado' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar blog completo
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'cover_image', 'category', 'author_name', 'published_at', 'reading_time'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    // Generate slug if title changed
    let slug = body.slug;
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug already exists (excluding current blog)
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const { data: blog, error } = await supabase
      .from('blog_posts')
      .update({
        slug: finalSlug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.cover_image,
        category: body.category,
        author_name: body.author_name,
        author_avatar: body.author_avatar || null,
        published_at: body.published_at,
        reading_time: body.reading_time,
        featured: body.featured || false,
        is_active: body.is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog:', error);
      return NextResponse.json({ error: 'Error al actualizar el blog' }, { status: 500 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH - Actualización parcial (para toggles)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.is_active !== undefined) updates.is_active = body.is_active;
    if (body.featured !== undefined) updates.featured = body.featured;

    const { data: blog, error } = await supabase.from('blog_posts').update(updates).eq('id', id).select().single();

    if (error) {
      console.error('Error patching blog:', error);
      return NextResponse.json({ error: 'Error al actualizar el blog' }, { status: 500 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Patch blog error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar blog
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting blog:', error);
      return NextResponse.json({ error: 'Error al eliminar el blog' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
