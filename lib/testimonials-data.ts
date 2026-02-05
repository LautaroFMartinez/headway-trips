export interface TestimonialMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  trip: string;
  tripSlug?: string;
  date: string;
  media?: TestimonialMedia;
  verified?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María García',
    location: 'Buenos Aires, Argentina',
    rating: 5,
    text: 'Increíble experiencia en Bariloche. El equipo de Headway Trips se encargó de todo, desde los traslados hasta las excursiones. Definitivamente repetiré con ellos.',
    trip: 'Bariloche Aventura',
    tripSlug: 'bariloche-aventura',
    date: '2025-12-15',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      alt: 'Hermoso paisaje de Bariloche con montañas nevadas',
    },
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    location: 'Córdoba, Argentina',
    rating: 5,
    text: 'Las Cataratas del Iguazú fueron impresionantes. La atención personalizada y los guías expertos hicieron que el viaje fuera inolvidable.',
    trip: 'Cataratas del Iguazú',
    tripSlug: 'cataratas-iguazu',
    date: '2025-11-20',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=600&fit=crop',
      alt: 'Cataratas del Iguazú con arcoíris',
    },
  },
  {
    id: '3',
    name: 'Laura Martínez',
    location: 'Mendoza, Argentina',
    rating: 5,
    text: 'Viajé sola por primera vez y me sentí muy segura. La organización fue impecable y los hoteles superaron mis expectativas.',
    trip: 'Ushuaia Fin del Mundo',
    tripSlug: 'ushuaia-fin-del-mundo',
    date: '2025-10-08',
    verified: true,
  },
  {
    id: '4',
    name: 'Pablo Fernández',
    location: 'Rosario, Argentina',
    rating: 5,
    text: 'Llevamos a toda la familia a Mendoza y fue perfecto. Los tours de vino estuvieron geniales y los niños disfrutaron muchísimo.',
    trip: 'Mendoza y Viñedos',
    tripSlug: 'mendoza-vinedos',
    date: '2025-09-25',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Viñedos de Mendoza con los Andes de fondo',
    },
  },
  {
    id: '5',
    name: 'Sofía López',
    location: 'La Plata, Argentina',
    rating: 5,
    text: 'El viaje a Salta fue mágico. Los paisajes del norte argentino son únicos y Headway Trips supo mostrarnos lo mejor de cada lugar.',
    trip: 'Norte Argentino',
    tripSlug: 'norte-argentino',
    date: '2025-08-12',
    verified: true,
  },
  {
    id: '6',
    name: 'Diego Ruiz',
    location: 'Mar del Plata, Argentina',
    rating: 5,
    text: 'Excelente relación calidad-precio. El paquete a El Calafate incluía todo lo prometido y más. El glaciar Perito Moreno es imperdible.',
    trip: 'Glaciares Patagónicos',
    tripSlug: 'glaciares-patagonicos',
    date: '2025-07-30',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=600&fit=crop',
      alt: 'Glaciar Perito Moreno en El Calafate',
    },
  },
];

export function getAverageRating(): number {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / testimonials.length) * 10) / 10;
}

export function getTestimonialCount(): number {
  return testimonials.length;
}
