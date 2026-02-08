'use client';

import type { TextBlock, HeadingBlock } from '@/types/blocks';

interface ProposalAboutProps {
  description: string;
  contentBlocks?: (TextBlock | HeadingBlock)[];
}

export function ProposalAbout({ description, contentBlocks = [] }: ProposalAboutProps) {
  const hasContentBlocks = contentBlocks.length > 0;

  return (
    <section id="sobre-el-viaje" className="scroll-mt-24">
      <div className="prose prose-gray max-w-none">
        <div className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
          <strong className="text-gray-900">Sobre el viaje</strong>{' '}
          {description}
        </div>

        {/* Bloques de contenido (texto y encabezados) */}
        {hasContentBlocks && contentBlocks.map((block) => {
          if (block.type === 'heading') {
            const level = block.data.level;
            const className = "mt-8 mb-2 font-serif font-bold text-gray-900";
            const text = block.data.text;
            if (level === 1) return <h1 key={block.id} className={className}>{text}</h1>;
            if (level === 2) return <h2 key={block.id} className={className}>{text}</h2>;
            if (level === 3) return <h3 key={block.id} className={className}>{text}</h3>;
            return <h4 key={block.id} className={className}>{text}</h4>;
          }

          return (
            <div
              key={block.id}
              className="mt-4 text-gray-700"
              style={{ textAlign: block.data.alignment }}
              dangerouslySetInnerHTML={{ __html: block.data.content }}
            />
          );
        })}
      </div>
    </section>
  );
}
