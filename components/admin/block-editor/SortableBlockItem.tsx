'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SortableBlockItemProps {
  id: string;
  children: ReactNode;
  isSelected?: boolean;
}

export function SortableBlockItem({
  id,
  children,
  isSelected,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'block',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'z-50 opacity-90',
        isSelected && 'ring-2 ring-primary ring-offset-2 rounded-lg'
      )}
    >
      {/* Drag handle - invisible but captures drag events on the left edge */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-8 cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'flex items-center justify-center',
          'hover:bg-muted/50 rounded-l-lg'
        )}
      >
        <svg
          className="h-5 w-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}
