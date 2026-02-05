import { ContentBlock } from '@/types/blocks';

export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  description: string;
  duration: string;
  durationDays: number;
  price: string;
  priceValue: number;
  image: string;
  heroImage: string;
  highlights: string[];
  tags: string[];
  pdfUrl?: string;
  contentBlocks?: ContentBlock[];
}

// Datos estáticos de fallback (cuando Supabase no está disponible)
export const trips: Trip[] = [
  {
    id: 'maldivas-grupo-mayo-2026',
    title: 'Viaje en Grupo a las Maldivas: Maafushi',
    subtitle: 'Maldivas - Mayo 2026',
    region: 'Asia',
    description: 'No es un viaje. Es una experiencia que te cambia el ritmo. Un lugar en el que se vive descalzo, sin prisas, mirando el mar todos los días como si fuera la primera vez. Aguas turquesas, arena blanca, islas diminutas en medio del Océano Índico.',
    duration: '8 días / 7 noches',
    durationDays: 8,
    price: 'USD $1,100',
    priceValue: 1100,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&h=900&fit=crop',
    highlights: ['Snorkel con tiburones', 'Atardeceres únicos', 'Playa privada', 'Excursión a banco de arena'],
    tags: ['aventura', 'playa', 'grupo', 'snorkel'],
  },
  {
    id: 'patagonia-glaciares-2026',
    title: 'Patagonia Argentina: Glaciares y Montañas',
    subtitle: 'El Calafate y El Chaltén',
    region: 'Sudamerica',
    description: 'Descubrí la majestuosidad de la Patagonia argentina. Caminá sobre el glaciar más famoso del mundo, navegá entre icebergs milenarios y recorré senderos con vistas a montañas que quitan el aliento.',
    duration: '7 días / 6 noches',
    durationDays: 7,
    price: 'USD $1,850',
    priceValue: 1850,
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&h=900&fit=crop',
    highlights: ['Glaciar Perito Moreno', 'Trekking en El Chaltén', 'Navegación', 'Monte Fitz Roy'],
    tags: ['aventura', 'trekking', 'glaciares', 'naturaleza'],
  },
  {
    id: 'japon-tradicion-2026',
    title: 'Japón: Tradición y Modernidad',
    subtitle: 'Tokio, Kioto y Osaka',
    region: 'Asia',
    description: 'Sumérgete en la fascinante cultura japonesa. Desde los templos milenarios de Kioto hasta los rascacielos futuristas de Tokio, este viaje te llevará por los contrastes únicos del país del sol naciente.',
    duration: '12 días / 11 noches',
    durationDays: 12,
    price: 'USD $4,200',
    priceValue: 4200,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&h=900&fit=crop',
    highlights: ['Templos de Kioto', 'Monte Fuji', 'Shibuya Crossing', 'Gastronomía japonesa'],
    tags: ['cultura', 'templos', 'gastronomía', 'tecnología'],
  },
  {
    id: 'riviera-maya-2026',
    title: 'Riviera Maya All Inclusive',
    subtitle: 'Cancún y Playa del Carmen',
    region: 'Norteamérica',
    description: 'Playas de arena blanca, aguas turquesas y la magia de la cultura maya. Relax total en resort all inclusive con excursiones a cenotes sagrados, ruinas de Tulum y la vibrante vida de Playa del Carmen.',
    duration: '7 días / 6 noches',
    durationDays: 7,
    price: 'USD $1,650',
    priceValue: 1650,
    image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1600&h=900&fit=crop',
    highlights: ['Resort All Inclusive', 'Ruinas de Tulum', 'Cenotes', 'Playa del Carmen'],
    tags: ['playa', 'relax', 'cultura', 'all-inclusive'],
  },
];

export function getTripById(id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}

export function getRegions(): string[] {
  return [...new Set(trips.map((trip) => trip.region))];
}

export function getAllTags(): string[] {
  const allTags = trips.flatMap((trip) => trip.tags);
  return [...new Set(allTags)];
}
