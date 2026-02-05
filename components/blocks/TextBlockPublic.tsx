'use client';

import { TextBlock } from '@/types/blocks';

interface TextBlockPublicProps {
  block: TextBlock;
}

export function TextBlockPublic({ block }: TextBlockPublicProps) {
  const { content, alignment } = block.data;

  if (!content || content === '<p></p>') {
    return null;
  }

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[alignment];

  return (
    <div
      className={`prose prose-lg max-w-none ${alignmentClass}
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-ul:text-muted-foreground prose-ol:text-muted-foreground
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
