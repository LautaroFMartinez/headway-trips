'use client';

import { useBlockEditor } from './BlockEditorContext';
import { SortableBlockList } from './SortableBlockList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { BLOCK_CATEGORIES, BLOCK_NAMES, BlockType } from '@/types/blocks';
import { getBlockIcon } from './utils/blockIcons';

interface EditorPreviewProps {
  onBlockClick: (id: string) => void;
}

export function EditorPreview({ onBlockClick }: EditorPreviewProps) {
  const { state, addBlock } = useBlockEditor();
  const { blocks } = state;

  const { setNodeRef, isOver } = useDroppable({
    id: 'editor-preview-dropzone',
  });

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20 min-h-0">
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-full p-6',
            isOver && 'bg-primary/5'
          )}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Comienza a crear contenido
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Arrastra bloques desde el panel derecho o haz clic en el botón
                para agregar tu primer bloque de contenido.
              </p>
              <AddBlockDropdown onAddBlock={handleAddBlock} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              <SortableBlockList onBlockClick={onBlockClick} />

              {/* Add block button at the end */}
              <div className="flex justify-center pt-4">
                <AddBlockDropdown onAddBlock={handleAddBlock} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function AddBlockDropdown({
  onAddBlock,
}: {
  onAddBlock: (type: BlockType) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar bloque
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Contenido</DropdownMenuLabel>
        {BLOCK_CATEGORIES.content.map((type) => {
          const Icon = getBlockIcon(type);
          return (
            <DropdownMenuItem key={type} onClick={() => onAddBlock(type)}>
              <Icon className="h-4 w-4 mr-2" />
              {BLOCK_NAMES[type]}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Viaje</DropdownMenuLabel>
        {BLOCK_CATEGORIES.trip.map((type) => {
          const Icon = getBlockIcon(type);
          return (
            <DropdownMenuItem key={type} onClick={() => onAddBlock(type)}>
              <Icon className="h-4 w-4 mr-2" />
              {BLOCK_NAMES[type]}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Servicios</DropdownMenuLabel>
        {BLOCK_CATEGORIES.services.map((type) => {
          const Icon = getBlockIcon(type);
          return (
            <DropdownMenuItem key={type} onClick={() => onAddBlock(type)}>
              <Icon className="h-4 w-4 mr-2" />
              {BLOCK_NAMES[type]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
