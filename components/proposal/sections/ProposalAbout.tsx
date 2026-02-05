'use client';

import type { TextBlock } from '@/types/blocks';

interface ProposalAboutProps {
  description: string;
  textBlocks?: TextBlock[];
}

export function ProposalAbout({ description, textBlocks = [] }: ProposalAboutProps) {
  // Combinar descripción principal con bloques de texto
  const hasTextBlocks = textBlocks.length > 0;

  return (
    <section id="sobre-el-viaje" className="scroll-mt-24">
      <div className="prose prose-gray max-w-none">
        <p className="text-base leading-relaxed text-gray-700">
          <strong className="text-gray-900">Sobre el viaje</strong>{' '}
          {description}
        </p>

        {/* Bloques de texto adicionales */}
        {hasTextBlocks && textBlocks.map((block) => (
          <div
            key={block.id}
            className="mt-4 text-gray-700"
            style={{ textAlign: block.data.alignment }}
            dangerouslySetInnerHTML={{ __html: block.data.content }}
          />
        ))}
      </div>
    </section>
  );
}
