export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
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

export const blogCategories = [
  { id: 'destinos', name: 'Destinos', count: 8 },
  { id: 'tips', name: 'Tips de Viaje', count: 5 },
  { id: 'cultura', name: 'Cultura', count: 4 },
  { id: 'aventura', name: 'Aventura', count: 3 },
  { id: 'gastronomia', name: 'Gastronomía', count: 2 },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'mejores-epocas-bariloche',
    title: 'Las mejores épocas para visitar Bariloche',
    excerpt: 'Descubrí cuándo viajar para disfrutar de la nieve, los lagos cristalinos o el otoño dorado en la Patagonia argentina.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'destinos',
    author: {
      name: 'María González',
    },
    publishedAt: '2026-01-14',
    readingTime: 5,
    featured: true,
  },
  {
    slug: 'guia-cataratas',
    title: 'Guía completa para recorrer las Cataratas del Iguazú',
    excerpt: 'Tips esenciales para tu visita a una de las maravillas naturales del mundo. Qué llevar, mejores circuitos y secretos locales.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'destinos',
    author: {
      name: 'Carlos Rodríguez',
    },
    publishedAt: '2026-01-10',
    readingTime: 8,
  },
  {
    slug: 'que-llevar-ushuaia',
    title: '¿Qué llevar a Ushuaia? Lista completa de equipaje',
    excerpt: 'Desde ropa térmica hasta protección solar, todo lo que necesitás para el fin del mundo según la temporada.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'tips',
    author: {
      name: 'Laura Martínez',
    },
    publishedAt: '2026-01-05',
    readingTime: 4,
  },
  {
    slug: 'ruta-del-vino-mendoza',
    title: 'Ruta del Vino en Mendoza: Las 10 bodegas imperdibles',
    excerpt: 'Un recorrido por las mejores bodegas de Mendoza, desde Luján de Cuyo hasta el Valle de Uco.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'gastronomia',
    author: {
      name: 'Diego Fernández',
    },
    publishedAt: '2025-12-28',
    readingTime: 6,
  },
  {
    slug: 'trekking-el-chalten',
    title: 'Los 5 mejores trekkings en El Chaltén',
    excerpt: 'Desde caminatas de medio día hasta expediciones de varios días, los senderos más espectaculares de la capital del trekking.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'aventura',
    author: {
      name: 'Pablo López',
    },
    publishedAt: '2025-12-20',
    readingTime: 7,
  },
  {
    slug: 'tradiciones-norte-argentino',
    title: 'Tradiciones y festividades del Norte Argentino',
    excerpt: 'Un viaje a través de la cultura, la música y las celebraciones ancestrales de Salta y Jujuy.',
    coverImage: '/ushuaia-tierra-del-fuego-end-of-world.jpg',
    category: 'cultura',
    author: {
      name: 'Sofía Ruiz',
    },
    publishedAt: '2025-12-15',
    readingTime: 5,
  },
];

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.featured);
}

export function getRecentPosts(count: number = 5): BlogPost[] {
  return blogPosts.slice(0, count);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getCategoryName(id: string): string {
  return blogCategories.find((cat) => cat.id === id)?.name || id;
}
