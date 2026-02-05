export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  trip: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María García',
    location: 'Buenos Aires, Argentina',
    rating: 5,
    text: 'Increíble experiencia en Bariloche. El equipo de Headway Trips se encargó de todo, desde los traslados hasta las excursiones. Definitivamente repetiré con ellos.',
    trip: 'Bariloche Aventura',
    date: '2025-12-15',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    location: 'Córdoba, Argentina',
    rating: 5,
    text: 'Las Cataratas del Iguazú fueron impresionantes. La atención personalizada y los guías expertos hicieron que el viaje fuera inolvidable.',
    trip: 'Cataratas del Iguazú',
    date: '2025-11-20',
  },
  {
    id: '3',
    name: 'Laura Martínez',
    location: 'Mendoza, Argentina',
    rating: 5,
    text: 'Viajé sola por primera vez y me sentí muy segura. La organización fue impecable y los hoteles superaron mis expectativas.',
    trip: 'Ushuaia Fin del Mundo',
    date: '2025-10-08',
  },
  {
    id: '4',
    name: 'Pablo Fernández',
    location: 'Rosario, Argentina',
    rating: 5,
    text: 'Llevamos a toda la familia a Mendoza y fue perfecto. Los tours de vino estuvieron geniales y los niños disfrutaron muchísimo.',
    trip: 'Mendoza y Viñedos',
    date: '2025-09-25',
  },
  {
    id: '5',
    name: 'Sofía López',
    location: 'La Plata, Argentina',
    rating: 5,
    text: 'El viaje a Salta fue mágico. Los paisajes del norte argentino son únicos y Headway Trips supo mostrarnos lo mejor de cada lugar.',
    trip: 'Norte Argentino',
    date: '2025-08-12',
  },
  {
    id: '6',
    name: 'Diego Ruiz',
    location: 'Mar del Plata, Argentina',
    rating: 5,
    text: 'Excelente relación calidad-precio. El paquete a El Calafate incluía todo lo prometido y más. El glaciar Perito Moreno es imperdible.',
    trip: 'Glaciares Patagónicos',
    date: '2025-07-30',
  },
];

export function getAverageRating(): number {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / testimonials.length) * 10) / 10;
}

export function getTestimonialCount(): number {
  return testimonials.length;
}
