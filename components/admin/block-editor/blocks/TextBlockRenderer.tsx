'use client';

import { TextBlock } from '@/types/blocks';
import { TipTapContent } from '../rich-text/TipTapEditor';

interface TextBlockRendererProps {
  block: TextBlock;
}

export function TextBlockRenderer({ block }: TextBlockRendererProps) {
  const { content } = block.data;

  if (!content || content === '<p></p>') {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para agregar texto...
      </p>
    );
  }

  return <TipTapContent content={content} />;
}
