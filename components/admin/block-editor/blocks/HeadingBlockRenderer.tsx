'use client';

import { HeadingBlock } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface HeadingBlockRendererProps {
  block: HeadingBlock;
}

export function HeadingBlockRenderer({ block }: HeadingBlockRendererProps) {
  const { text, level } = block.data;

  if (!text) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para agregar un encabezado...
      </p>
    );
  }

  const sizeClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-semibold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-medium',
  };

  const className = cn(sizeClasses[level]);

  switch (level) {
    case 1:
      return <h1 className={className}>{text}</h1>;
    case 2:
      return <h2 className={className}>{text}</h2>;
    case 3:
      return <h3 className={className}>{text}</h3>;
    case 4:
      return <h4 className={className}>{text}</h4>;
    default:
      return <h2 className={className}>{text}</h2>;
  }
}
