// Block Editor Types - MOGU-style content blocks for trips

export type BlockType =
  | 'text'
  | 'heading'
  | 'itinerary'
  | 'services'
  | 'price'
  | 'image'
  | 'gallery'
  | 'file'
  | 'accommodation'
  | 'activity'
  | 'transport'
  | 'flight'
  | 'food';

// Base interface for all blocks
export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  isVisible: boolean;
}

// Text Block - Rich text content
export interface TextBlockData {
  content: string; // HTML content from TipTap
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  data: TextBlockData;
}

// Heading Block - Section titles
export interface HeadingBlockData {
  text: string;
  level: 1 | 2 | 3 | 4;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  data: HeadingBlockData;
}

// Itinerary Block - Day by day schedule
export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  activities: string[];
}

export interface ItineraryBlockData {
  days: ItineraryDay[];
}

export interface ItineraryBlock extends BaseBlock {
  type: 'itinerary';
  data: ItineraryBlockData;
}

// Services Block - Includes/Excludes
export interface ServicesBlockData {
  includes: string[];
  excludes: string[];
}

export interface ServicesBlock extends BaseBlock {
  type: 'services';
  data: ServicesBlockData;
}

// Price Block - Pricing options
export interface PriceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounts
}

export interface PriceBlockData {
  basePrice: number;
  currency: 'ARS' | 'USD' | 'EUR';
  priceType: 'per_person' | 'per_group' | 'per_night';
  options: PriceOption[];
  notes?: string;
}

export interface PriceBlock extends BaseBlock {
  type: 'price';
  data: PriceBlockData;
}

// Image Block - Single image
export interface ImageBlockData {
  url: string;
  alt: string;
  caption?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: ImageBlockData;
}

// Gallery Block - Multiple images
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlockData {
  images: GalleryImage[];
  layout: 'grid' | 'masonry' | 'carousel';
  columns: 2 | 3 | 4;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  data: GalleryBlockData;
}

// File Block - PDF and other documents
export interface FileBlockData {
  url: string;
  name: string;
  type: 'pdf' | 'doc' | 'other';
  size?: number; // bytes
  description?: string;
}

export interface FileBlock extends BaseBlock {
  type: 'file';
  data: FileBlockData;
}

// Accommodation Block - Hotels and lodging
export interface AccommodationBlockData {
  name: string;
  category: 1 | 2 | 3 | 4 | 5; // Stars
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'cabin' | 'camping' | 'other';
  nights: number;
  roomType?: string;
  amenities: string[];
  checkIn?: string;
  checkOut?: string;
  address?: string;
  image?: string;
  description?: string;
}

export interface AccommodationBlock extends BaseBlock {
  type: 'accommodation';
  data: AccommodationBlockData;
}

// Activity Block - Excursions and activities
export interface ActivityBlockData {
  name: string;
  description: string;
  duration: string; // e.g., "2 hours", "Full day"
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  included: boolean;
  price?: number;
  location?: string;
  image?: string;
  equipment?: string[];
  notes?: string;
}

export interface ActivityBlock extends BaseBlock {
  type: 'activity';
  data: ActivityBlockData;
}

// Transport Block - Ground transportation
export interface TransportBlockData {
  type: 'bus' | 'van' | 'car' | 'train' | 'boat' | 'other';
  origin: string;
  destination: string;
  duration?: string;
  company?: string;
  class?: string;
  departureTime?: string;
  arrivalTime?: string;
  included: boolean;
  price?: number;
  notes?: string;
}

export interface TransportBlock extends BaseBlock {
  type: 'transport';
  data: TransportBlockData;
}

// Flight Block - Air travel
export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  class: 'economy' | 'premium_economy' | 'business' | 'first';
  baggage?: string;
}

export interface FlightBlockData {
  segments: FlightSegment[];
  included: boolean;
  price?: number;
  notes?: string;
}

export interface FlightBlock extends BaseBlock {
  type: 'flight';
  data: FlightBlockData;
}

// Food Block - Meals and dining
export interface FoodBlockData {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all_inclusive';
  name: string;
  description?: string;
  venue?: string;
  included: boolean;
  price?: number;
  dietary?: string[]; // vegetarian, vegan, gluten-free, etc.
}

export interface FoodBlock extends BaseBlock {
  type: 'food';
  data: FoodBlockData;
}

// Union type of all blocks
export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ItineraryBlock
  | ServicesBlock
  | PriceBlock
  | ImageBlock
  | GalleryBlock
  | FileBlock
  | AccommodationBlock
  | ActivityBlock
  | TransportBlock
  | FlightBlock
  | FoodBlock;

// Helper type to get data type from block type
export type BlockDataMap = {
  text: TextBlockData;
  heading: HeadingBlockData;
  itinerary: ItineraryBlockData;
  services: ServicesBlockData;
  price: PriceBlockData;
  image: ImageBlockData;
  gallery: GalleryBlockData;
  file: FileBlockData;
  accommodation: AccommodationBlockData;
  activity: ActivityBlockData;
  transport: TransportBlockData;
  flight: FlightBlockData;
  food: FoodBlockData;
};

// Block categories for the palette
export const BLOCK_CATEGORIES = {
  content: ['text', 'heading', 'image', 'gallery', 'file'] as BlockType[],
  trip: ['itinerary', 'services', 'price'] as BlockType[],
  services: ['accommodation', 'activity', 'transport', 'flight', 'food'] as BlockType[],
} as const;

// Block display names
export const BLOCK_NAMES: Record<BlockType, string> = {
  text: 'Texto',
  heading: 'Encabezado',
  itinerary: 'Itinerario',
  services: 'Servicios',
  price: 'Precio',
  image: 'Imagen',
  gallery: 'Galería',
  file: 'Archivo',
  accommodation: 'Alojamiento',
  activity: 'Actividad',
  transport: 'Transporte',
  flight: 'Vuelo',
  food: 'Comida',
};

// Block descriptions for palette tooltips
export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  text: 'Bloque de texto enriquecido con formato',
  heading: 'Título o encabezado de sección',
  itinerary: 'Cronograma día por día del viaje',
  services: 'Lista de servicios incluidos y no incluidos',
  price: 'Información de precios y opciones',
  image: 'Imagen única con descripción',
  gallery: 'Galería de múltiples imágenes',
  file: 'Documento PDF o archivo adjunto',
  accommodation: 'Información del alojamiento',
  activity: 'Excursión o actividad',
  transport: 'Traslado terrestre o marítimo',
  flight: 'Información de vuelos',
  food: 'Comidas incluidas o extras',
};
