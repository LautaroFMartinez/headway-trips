'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BlockType, BLOCK_CATEGORIES, BLOCK_NAMES, BLOCK_DESCRIPTIONS } from '@/types/blocks';
import { getBlockIcon } from './utils/blockIcons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DraggableBlockProps {
  type: BlockType;
}

function DraggableBlock({ type }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: 'palette-item',
      blockType: type,
    },
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  const Icon = getBlockIcon(type);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border',
              'bg-card hover:bg-accent hover:border-primary/50 transition-colors',
              'cursor-grab active:cursor-grabbing',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isDragging && 'opacity-50 ring-2 ring-primary'
            )}
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-medium text-center leading-tight">
              {BLOCK_NAMES[type]}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="text-sm">{BLOCK_DESCRIPTIONS[type]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface BlockCategoryProps {
  title: string;
  types: BlockType[];
}

function BlockCategory({ title, types }: BlockCategoryProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {types.map((type) => (
          <DraggableBlock key={type} type={type} />
        ))}
      </div>
    </div>
  );
}

export function BlockPalette() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <BlockCategory title="Contenido" types={BLOCK_CATEGORIES.content} />
        <BlockCategory title="Viaje" types={BLOCK_CATEGORIES.trip} />
        <BlockCategory title="Servicios" types={BLOCK_CATEGORIES.services} />
      </div>
    </ScrollArea>
  );
}
