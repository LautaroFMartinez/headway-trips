'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlockEditorProvider, useBlockEditor } from './BlockEditorContext';
import { EditorLayout } from './EditorLayout';
import { ContentBlock } from '@/types/blocks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BLOCK_NAMES } from '@/types/blocks';
import { getBlockIcon } from './utils/blockIcons';

// Import all block editors
import { TextBlockEditor } from './editors/TextBlockEditor';
import { HeadingBlockEditor } from './editors/HeadingBlockEditor';
import { ItineraryBlockEditor } from './editors/ItineraryBlockEditor';
import { ServicesBlockEditor } from './editors/ServicesBlockEditor';
import { PriceBlockEditor } from './editors/PriceBlockEditor';
import { ImageBlockEditor } from './editors/ImageBlockEditor';
import { GalleryBlockEditor } from './editors/GalleryBlockEditor';
import { FileBlockEditor } from './editors/FileBlockEditor';
import { AccommodationBlockEditor } from './editors/AccommodationBlockEditor';
import { ActivityBlockEditor } from './editors/ActivityBlockEditor';
import { TransportBlockEditor } from './editors/TransportBlockEditor';
import { FlightBlockEditor } from './editors/FlightBlockEditor';
import { FoodBlockEditor } from './editors/FoodBlockEditor';

interface BlockEditorProps {
  initialBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

function BlockEditorInner({ onChange }: { onChange: (blocks: ContentBlock[]) => void }) {
  const { state, setEditingBlock, getBlockById } = useBlockEditor();
  const { blocks, editingBlockId } = state;

  // Notify parent of changes
  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const editingBlock = editingBlockId ? getBlockById(editingBlockId) : null;

  const handleBlockClick = useCallback((id: string) => {
    setEditingBlock(id);
  }, [setEditingBlock]);

  const handleCloseEditor = useCallback(() => {
    setEditingBlock(null);
  }, [setEditingBlock]);

  const renderBlockEditor = () => {
    if (!editingBlock) return null;

    switch (editingBlock.type) {
      case 'text':
        return <TextBlockEditor block={editingBlock} />;
      case 'heading':
        return <HeadingBlockEditor block={editingBlock} />;
      case 'itinerary':
        return <ItineraryBlockEditor block={editingBlock} />;
      case 'services':
        return <ServicesBlockEditor block={editingBlock} />;
      case 'price':
        return <PriceBlockEditor block={editingBlock} />;
      case 'image':
        return <ImageBlockEditor block={editingBlock} />;
      case 'gallery':
        return <GalleryBlockEditor block={editingBlock} />;
      case 'file':
        return <FileBlockEditor block={editingBlock} />;
      case 'accommodation':
        return <AccommodationBlockEditor block={editingBlock} />;
      case 'activity':
        return <ActivityBlockEditor block={editingBlock} />;
      case 'transport':
        return <TransportBlockEditor block={editingBlock} />;
      case 'flight':
        return <FlightBlockEditor block={editingBlock} />;
      case 'food':
        return <FoodBlockEditor block={editingBlock} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorLayout onBlockClick={handleBlockClick} />

      {/* Block Editor Sheet */}
      <Sheet open={!!editingBlock} onOpenChange={(open) => !open && handleCloseEditor()}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto px-6">
          {editingBlock && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = getBlockIcon(editingBlock.type);
                    return <Icon className="h-5 w-5" />;
                  })()}
                  Editar {BLOCK_NAMES[editingBlock.type]}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {renderBlockEditor()}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function BlockEditor({ initialBlocks, onChange }: BlockEditorProps) {
  return (
    <BlockEditorProvider initialBlocks={initialBlocks}>
      <BlockEditorInner onChange={onChange} />
    </BlockEditorProvider>
  );
}
