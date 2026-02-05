'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useBlockEditor } from './BlockEditorContext';
import { SortableBlockItem } from './SortableBlockItem';
import { BlockWrapper } from './blocks/BlockWrapper';
import { BlockType, BLOCK_NAMES } from '@/types/blocks';
import { getBlockIcon } from './utils/blockIcons';
import { cn } from '@/lib/utils';

interface SortableBlockListProps {
  onBlockClick: (id: string) => void;
}

export function SortableBlockList({ onBlockClick }: SortableBlockListProps) {
  const { state, moveBlock, addBlock } = useBlockEditor();
  const { blocks, selectedBlockId } = state;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedPaletteType, setDraggedPaletteType] = useState<BlockType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'palette-item') {
      setDraggedPaletteType(activeData.blockType as BlockType);
    } else {
      setActiveId(active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over for visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDraggedPaletteType(null);
      return;
    }

    const activeData = active.data.current;

    // If dragging from palette
    if (activeData?.type === 'palette-item') {
      const blockType = activeData.blockType as BlockType;
      const overId = over.id as string;

      // Find the block to insert after
      const overBlock = blocks.find((b) => b.id === overId);
      if (overBlock) {
        addBlock(blockType, overId);
      } else {
        // If dropped on empty area, add at end
        addBlock(blockType);
      }
    } else {
      // Reordering existing blocks
      if (active.id !== over.id) {
        moveBlock(active.id as string, over.id as string);
      }
    }

    setActiveId(null);
    setDraggedPaletteType(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedPaletteType(null);
  };

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              id={block.id}
              isSelected={selectedBlockId === block.id}
            >
              <BlockWrapper
                block={block}
                onClick={() => onBlockClick(block.id)}
              />
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>

      {/* Drag overlay for existing blocks */}
      <DragOverlay>
        {activeBlock && (
          <div className="opacity-80 shadow-lg">
            <BlockWrapper block={activeBlock} isDragOverlay />
          </div>
        )}
        {draggedPaletteType && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-3',
              'bg-card border rounded-lg shadow-lg'
            )}
          >
            {(() => {
              const Icon = getBlockIcon(draggedPaletteType);
              return <Icon className="h-5 w-5 text-muted-foreground" />;
            })()}
            <span className="font-medium">{BLOCK_NAMES[draggedPaletteType]}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
