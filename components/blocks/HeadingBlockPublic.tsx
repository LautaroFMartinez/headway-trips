'use client';

import { HeadingBlock } from '@/types/blocks';

interface HeadingBlockPublicProps {
  block: HeadingBlock;
}

export function HeadingBlockPublic({ block }: HeadingBlockPublicProps) {
  const { text, level } = block.data;

  if (!text) return null;

  const sizeClasses = {
    1: 'text-3xl md:text-4xl font-bold text-foreground',
    2: 'text-2xl md:text-3xl font-semibold text-foreground',
    3: 'text-xl md:text-2xl font-semibold text-foreground',
    4: 'text-lg md:text-xl font-medium text-foreground',
  };

  const className = sizeClasses[level];

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
