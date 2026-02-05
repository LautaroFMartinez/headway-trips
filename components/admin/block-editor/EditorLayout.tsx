'use client';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { EditorPreview } from './EditorPreview';
import { EditorSidebar } from './EditorSidebar';
import { useBlockEditor } from './BlockEditorContext';
import { BlockType } from '@/types/blocks';

interface EditorLayoutProps {
  onBlockClick: (id: string) => void;
}

export function EditorLayout({ onBlockClick }: EditorLayoutProps) {
  const { addBlock } = useBlockEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;

    // If dropping from palette onto the preview area
    if (activeData?.type === 'palette-item' && over.id === 'editor-preview-dropzone') {
      const blockType = activeData.blockType as BlockType;
      addBlock(blockType);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        <EditorPreview onBlockClick={onBlockClick} />
        <div className="w-72 shrink-0">
          <EditorSidebar />
        </div>
      </div>
    </DndContext>
  );
}
