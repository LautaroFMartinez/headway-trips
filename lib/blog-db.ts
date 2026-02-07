import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author_name: string;
  author_avatar?: string;
  published_at: string;
  reading_time: number;
  featured: boolean;
  is_active: boolean;
}

// Transform to match the old interface for compatibility
export interface BlogPostDisplay {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

function transformPost(post: BlogPost): BlogPostDisplay {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    category: post.category,
    author: {
      name: post.author_name,
      avatar: post.author_avatar,
    },
    publishedAt: post.published_at,
    readingTime: post.reading_time,
    featured: post.featured,
  };
}

export async function getAllBlogPosts(): Promise<BlogPostDisplay[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

export async function getFeaturedPost(): Promise<BlogPostDisplay | undefined> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_active', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return undefined;
  }

  return transformPost(data);
}

export async function getRecentPosts(count: number = 5): Promise<BlogPostDisplay[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

export async function getPostsByCategory(category: string): Promise<BlogPostDisplay[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPostDisplay | undefined> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return undefined;
  }

  return transformPost(data);
}

export async function getBlogCategories(): Promise<{ id: string; name: string; count: number }[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categoryMap: Record<string, { name: string; count: number }> = {
    destinos: { name: 'Destinos', count: 0 },
    tips: { name: 'Tips de Viaje', count: 0 },
    cultura: { name: 'Cultura', count: 0 },
    aventura: { name: 'Aventura', count: 0 },
    gastronomia: { name: 'Gastronomía', count: 0 },
  };

  for (const post of data || []) {
    if (categoryMap[post.category]) {
      categoryMap[post.category].count++;
    }
  }

  return Object.entries(categoryMap).map(([id, { name, count }]) => ({
    id,
    name,
    count,
  }));
}

export function getCategoryName(id: string): string {
  const categories: Record<string, string> = {
    destinos: 'Destinos',
    tips: 'Tips de Viaje',
    cultura: 'Cultura',
    aventura: 'Aventura',
    gastronomia: 'Gastronomía',
  };
  return categories[id] || id;
}
