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
    location: 'Madrid, España',
    rating: 5,
    text: 'Increíble experiencia en París. El equipo de Headway Trips se encargó de todo, desde los traslados hasta las excursiones. Definitivamente repetiré con ellos.',
    trip: 'París',
    tripSlug: 'europa-clasica-2026',
    date: '2025-12-15',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      alt: 'Torre Eiffel y cielo parisino',
    },
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    location: 'Barcelona, España',
    rating: 5,
    text: 'Roma fue impresionante. La atención personalizada y los guías expertos hicieron que el viaje fuera inolvidable.',
    trip: 'Roma',
    tripSlug: 'europa-clasica-2026',
    date: '2025-11-20',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
      alt: 'Coliseo de Roma',
    },
  },
  {
    id: '3',
    name: 'Laura Martínez',
    location: 'Lisboa, Portugal',
    rating: 5,
    text: 'Viajé sola por primera vez y me sentí muy segura. La organización fue impecable y los hoteles superaron mis expectativas.',
    trip: 'Barcelona',
    tripSlug: 'europa-clasica-2026',
    date: '2025-10-08',
    verified: true,
  },
  {
    id: '4',
    name: 'Pablo Fernández',
    location: 'Berlín, Alemania',
    rating: 5,
    text: 'Llevamos a toda la familia a Barcelona y fue perfecto. Los tours y la gastronomía estuvieron geniales y los niños disfrutaron muchísimo.',
    trip: 'Barcelona',
    tripSlug: 'europa-clasica-2026',
    date: '2025-09-25',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
      alt: 'Sagrada Familia y cielo de Barcelona',
    },
  },
  {
    id: '5',
    name: 'Sofía López',
    location: 'Amsterdam, Países Bajos',
    rating: 5,
    text: 'El viaje a París fue mágico. La ciudad tiene un encanto único y Headway Trips supo mostrarnos lo mejor de cada rincón.',
    trip: 'París',
    tripSlug: 'europa-clasica-2026',
    date: '2025-08-12',
    verified: true,
  },
  {
    id: '6',
    name: 'Diego Ruiz',
    location: 'Londres, Reino Unido',
    rating: 5,
    text: 'Excelente relación calidad-precio. El paquete a Roma incluía todo lo prometido y más. El Coliseo y el Vaticano son imperdibles.',
    trip: 'Roma',
    tripSlug: 'europa-clasica-2026',
    date: '2025-07-30',
    verified: true,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
      alt: 'Vista de Roma desde el río',
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
