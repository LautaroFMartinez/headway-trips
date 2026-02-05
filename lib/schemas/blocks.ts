import { z } from 'zod';

// Block types enum
export const blockTypeSchema = z.enum([
  'text',
  'heading',
  'itinerary',
  'services',
  'price',
  'image',
  'gallery',
  'file',
  'accommodation',
  'activity',
  'transport',
  'flight',
  'food',
]);

// Base block schema
export const baseBlockSchema = z.object({
  id: z.string().uuid(),
  type: blockTypeSchema,
  order: z.number().int().min(0),
  isVisible: z.boolean(),
});

// Text Block
export const textBlockDataSchema = z.object({
  content: z.string(),
  alignment: z.enum(['left', 'center', 'right', 'justify']),
});

export const textBlockSchema = baseBlockSchema.extend({
  type: z.literal('text'),
  data: textBlockDataSchema,
});

// Heading Block
export const headingBlockDataSchema = z.object({
  text: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export const headingBlockSchema = baseBlockSchema.extend({
  type: z.literal('heading'),
  data: headingBlockDataSchema,
});

// Itinerary Block
export const itineraryDaySchema = z.object({
  id: z.string().uuid(),
  dayNumber: z.number().int().min(1),
  title: z.string(),
  description: z.string(),
  meals: z.object({
    breakfast: z.boolean(),
    lunch: z.boolean(),
    dinner: z.boolean(),
  }),
  activities: z.array(z.string()),
});

export const itineraryBlockDataSchema = z.object({
  days: z.array(itineraryDaySchema),
});

export const itineraryBlockSchema = baseBlockSchema.extend({
  type: z.literal('itinerary'),
  data: itineraryBlockDataSchema,
});

// Services Block
export const servicesBlockDataSchema = z.object({
  includes: z.array(z.string()),
  excludes: z.array(z.string()),
});

export const servicesBlockSchema = baseBlockSchema.extend({
  type: z.literal('services'),
  data: servicesBlockDataSchema,
});

// Price Block
export const priceOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
});

export const priceBlockDataSchema = z.object({
  basePrice: z.number().min(0),
  currency: z.enum(['ARS', 'USD', 'EUR']),
  priceType: z.enum(['per_person', 'per_group', 'per_night']),
  options: z.array(priceOptionSchema),
  notes: z.string().optional(),
});

export const priceBlockSchema = baseBlockSchema.extend({
  type: z.literal('price'),
  data: priceBlockDataSchema,
});

// Image Block
export const imageBlockDataSchema = z.object({
  url: z.string().url().or(z.literal('')),
  alt: z.string(),
  caption: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'full']),
  alignment: z.enum(['left', 'center', 'right']),
});

export const imageBlockSchema = baseBlockSchema.extend({
  type: z.literal('image'),
  data: imageBlockDataSchema,
});

// Gallery Block
export const galleryImageSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const galleryBlockDataSchema = z.object({
  images: z.array(galleryImageSchema),
  layout: z.enum(['grid', 'masonry', 'carousel']),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
});

export const galleryBlockSchema = baseBlockSchema.extend({
  type: z.literal('gallery'),
  data: galleryBlockDataSchema,
});

// File Block
export const fileBlockDataSchema = z.object({
  url: z.string().url().or(z.literal('')),
  name: z.string(),
  type: z.enum(['pdf', 'doc', 'other']),
  size: z.number().min(0).optional(),
  description: z.string().optional(),
});

export const fileBlockSchema = baseBlockSchema.extend({
  type: z.literal('file'),
  data: fileBlockDataSchema,
});

// Accommodation Block
export const accommodationBlockDataSchema = z.object({
  name: z.string(),
  category: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  type: z.enum(['hotel', 'hostel', 'apartment', 'resort', 'cabin', 'camping', 'other']),
  nights: z.number().int().min(1),
  roomType: z.string().optional(),
  amenities: z.array(z.string()),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export const accommodationBlockSchema = baseBlockSchema.extend({
  type: z.literal('accommodation'),
  data: accommodationBlockDataSchema,
});

// Activity Block
export const activityBlockDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']),
  included: z.boolean(),
  price: z.number().min(0).optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const activityBlockSchema = baseBlockSchema.extend({
  type: z.literal('activity'),
  data: activityBlockDataSchema,
});

// Transport Block
export const transportBlockDataSchema = z.object({
  type: z.enum(['bus', 'van', 'car', 'train', 'boat', 'other']),
  origin: z.string(),
  destination: z.string(),
  duration: z.string().optional(),
  company: z.string().optional(),
  class: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  included: z.boolean(),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const transportBlockSchema = baseBlockSchema.extend({
  type: z.literal('transport'),
  data: transportBlockDataSchema,
});

// Flight Block
export const flightSegmentSchema = z.object({
  id: z.string().uuid(),
  airline: z.string(),
  flightNumber: z.string(),
  origin: z.string(),
  originCode: z.string(),
  destination: z.string(),
  destinationCode: z.string(),
  departureDate: z.string(),
  departureTime: z.string(),
  arrivalDate: z.string(),
  arrivalTime: z.string(),
  class: z.enum(['economy', 'premium_economy', 'business', 'first']),
  baggage: z.string().optional(),
});

export const flightBlockDataSchema = z.object({
  segments: z.array(flightSegmentSchema),
  included: z.boolean(),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const flightBlockSchema = baseBlockSchema.extend({
  type: z.literal('flight'),
  data: flightBlockDataSchema,
});

// Food Block
export const foodBlockDataSchema = z.object({
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'all_inclusive']),
  name: z.string(),
  description: z.string().optional(),
  venue: z.string().optional(),
  included: z.boolean(),
  price: z.number().min(0).optional(),
  dietary: z.array(z.string()).optional(),
});

export const foodBlockSchema = baseBlockSchema.extend({
  type: z.literal('food'),
  data: foodBlockDataSchema,
});

// Union of all block schemas
export const contentBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  headingBlockSchema,
  itineraryBlockSchema,
  servicesBlockSchema,
  priceBlockSchema,
  imageBlockSchema,
  galleryBlockSchema,
  fileBlockSchema,
  accommodationBlockSchema,
  activityBlockSchema,
  transportBlockSchema,
  flightBlockSchema,
  foodBlockSchema,
]);

// Array of content blocks
export const contentBlocksSchema = z.array(contentBlockSchema);

// Type exports from schemas
export type TextBlockSchema = z.infer<typeof textBlockSchema>;
export type HeadingBlockSchema = z.infer<typeof headingBlockSchema>;
export type ItineraryBlockSchema = z.infer<typeof itineraryBlockSchema>;
export type ServicesBlockSchema = z.infer<typeof servicesBlockSchema>;
export type PriceBlockSchema = z.infer<typeof priceBlockSchema>;
export type ImageBlockSchema = z.infer<typeof imageBlockSchema>;
export type GalleryBlockSchema = z.infer<typeof galleryBlockSchema>;
export type FileBlockSchema = z.infer<typeof fileBlockSchema>;
export type AccommodationBlockSchema = z.infer<typeof accommodationBlockSchema>;
export type ActivityBlockSchema = z.infer<typeof activityBlockSchema>;
export type TransportBlockSchema = z.infer<typeof transportBlockSchema>;
export type FlightBlockSchema = z.infer<typeof flightBlockSchema>;
export type FoodBlockSchema = z.infer<typeof foodBlockSchema>;
export type ContentBlockSchema = z.infer<typeof contentBlockSchema>;
