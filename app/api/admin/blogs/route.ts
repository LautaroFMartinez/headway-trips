import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Lista de blogs con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const active = searchParams.get('active') || '';

    const offset = (page - 1) * limit;

    let query = supabase.from('blog_posts').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (active && active !== 'all') {
      query = query.eq('is_active', active === 'true');
    }

    // Apply pagination and sorting
    query = query.order('published_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: blogs, count, error } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json({ error: 'Error al obtener blogs' }, { status: 500 });
    }

    return NextResponse.json({
      blogs: blogs || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'cover_image', 'category', 'author_name', 'published_at', 'reading_time'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 });
      }
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const { data: blog, error } = await supabase
      .from('blog_posts')
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog:', error.message, error.details, error.hint);
      return NextResponse.json({ error: 'Error al crear el blog', details: error.message }, { status: 500 });
    }

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
