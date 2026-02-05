import { v4 as uuidv4 } from 'uuid';
import {
  BlockType,
  ContentBlock,
  TextBlock,
  HeadingBlock,
  ItineraryBlock,
  ServicesBlock,
  PriceBlock,
  ImageBlock,
  GalleryBlock,
  FileBlock,
  AccommodationBlock,
  ActivityBlock,
  TransportBlock,
  FlightBlock,
  FoodBlock,
} from '@/types/blocks';

export function createBlock(type: BlockType, order: number): ContentBlock {
  const baseBlock = {
    id: uuidv4(),
    order,
    isVisible: true,
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        data: {
          content: '',
          alignment: 'left',
        },
      } as TextBlock;

    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        data: {
          text: '',
          level: 2,
        },
      } as HeadingBlock;

    case 'itinerary':
      return {
        ...baseBlock,
        type: 'itinerary',
        data: {
          days: [
            {
              id: uuidv4(),
              dayNumber: 1,
              title: 'Día 1',
              description: '',
              meals: { breakfast: false, lunch: false, dinner: false },
              activities: [],
            },
          ],
        },
      } as ItineraryBlock;

    case 'services':
      return {
        ...baseBlock,
        type: 'services',
        data: {
          includes: [],
          excludes: [],
        },
      } as ServicesBlock;

    case 'price':
      return {
        ...baseBlock,
        type: 'price',
        data: {
          basePrice: 0,
          currency: 'USD',
          priceType: 'per_person',
          options: [],
          notes: '',
        },
      } as PriceBlock;

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        data: {
          url: '',
          alt: '',
          caption: '',
          size: 'large',
          alignment: 'center',
        },
      } as ImageBlock;

    case 'gallery':
      return {
        ...baseBlock,
        type: 'gallery',
        data: {
          images: [],
          layout: 'grid',
          columns: 3,
        },
      } as GalleryBlock;

    case 'file':
      return {
        ...baseBlock,
        type: 'file',
        data: {
          url: '',
          name: '',
          type: 'pdf',
          description: '',
        },
      } as FileBlock;

    case 'accommodation':
      return {
        ...baseBlock,
        type: 'accommodation',
        data: {
          name: '',
          category: 3,
          type: 'hotel',
          nights: 1,
          roomType: '',
          amenities: [],
          description: '',
        },
      } as AccommodationBlock;

    case 'activity':
      return {
        ...baseBlock,
        type: 'activity',
        data: {
          name: '',
          description: '',
          duration: '',
          difficulty: 'moderate',
          included: true,
          location: '',
          equipment: [],
        },
      } as ActivityBlock;

    case 'transport':
      return {
        ...baseBlock,
        type: 'transport',
        data: {
          type: 'bus',
          origin: '',
          destination: '',
          duration: '',
          included: true,
        },
      } as TransportBlock;

    case 'flight':
      return {
        ...baseBlock,
        type: 'flight',
        data: {
          segments: [
            {
              id: uuidv4(),
              airline: '',
              flightNumber: '',
              origin: '',
              originCode: '',
              destination: '',
              destinationCode: '',
              departureDate: '',
              departureTime: '',
              arrivalDate: '',
              arrivalTime: '',
              class: 'economy',
            },
          ],
          included: false,
        },
      } as FlightBlock;

    case 'food':
      return {
        ...baseBlock,
        type: 'food',
        data: {
          type: 'lunch',
          name: '',
          description: '',
          venue: '',
          included: true,
        },
      } as FoodBlock;

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}

export function duplicateBlock(block: ContentBlock, newOrder: number): ContentBlock {
  return {
    ...JSON.parse(JSON.stringify(block)),
    id: uuidv4(),
    order: newOrder,
  };
}

export function reorderBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}
