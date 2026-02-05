'use client';

import { ContentBlock } from '@/types/blocks';
import { TextBlockPublic } from './TextBlockPublic';
import { HeadingBlockPublic } from './HeadingBlockPublic';
import { ItineraryBlockPublic } from './ItineraryBlockPublic';
import { ServicesBlockPublic } from './ServicesBlockPublic';
import { PriceBlockPublic } from './PriceBlockPublic';
import { ImageBlockPublic } from './ImageBlockPublic';
import { GalleryBlockPublic } from './GalleryBlockPublic';
import { FileBlockPublic } from './FileBlockPublic';
import { AccommodationBlockPublic } from './AccommodationBlockPublic';
import { ActivityBlockPublic } from './ActivityBlockPublic';
import { TransportBlockPublic } from './TransportBlockPublic';
import { FlightBlockPublic } from './FlightBlockPublic';
import { FoodBlockPublic } from './FoodBlockPublic';

interface BlockRendererProps {
  blocks: ContentBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  // Filter only visible blocks and sort by order
  const visibleBlocks = blocks
    .filter((block) => block.isVisible)
    .sort((a, b) => a.order - b.order);

  if (visibleBlocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {visibleBlocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}

function renderBlock(block: ContentBlock) {
  switch (block.type) {
    case 'text':
      return <TextBlockPublic block={block} />;
    case 'heading':
      return <HeadingBlockPublic block={block} />;
    case 'itinerary':
      return <ItineraryBlockPublic block={block} />;
    case 'services':
      return <ServicesBlockPublic block={block} />;
    case 'price':
      return <PriceBlockPublic block={block} />;
    case 'image':
      return <ImageBlockPublic block={block} />;
    case 'gallery':
      return <GalleryBlockPublic block={block} />;
    case 'file':
      return <FileBlockPublic block={block} />;
    case 'accommodation':
      return <AccommodationBlockPublic block={block} />;
    case 'activity':
      return <ActivityBlockPublic block={block} />;
    case 'transport':
      return <TransportBlockPublic block={block} />;
    case 'flight':
      return <FlightBlockPublic block={block} />;
    case 'food':
      return <FoodBlockPublic block={block} />;
    default:
      return null;
  }
}
