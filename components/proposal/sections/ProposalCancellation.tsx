'use client';

import type { CancellationPolicyBlock, CancellationPolicyItem } from '@/types/blocks';
import { ShieldX } from 'lucide-react';

interface ProposalCancellationProps {
  block: CancellationPolicyBlock;
}

export function ProposalCancellation({ block }: ProposalCancellationProps) {
  const data = block.data as any;
  const items: CancellationPolicyItem[] = data.items ?? [];
  const notes: string = data.notes ?? '';

  const hasContent = items.some((i: any) => i.title || i.content) || notes;
  if (!hasContent) return null;

  return (
    <section id="cancelacion" className="scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShieldX className="w-6 h-6 text-gray-600" />
        Política de cancelación
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {items.map((item) => (
          (item.title || item.content) && (
            <div key={item.id} className="px-6 py-4">
              {item.title && (
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
              )}
              {item.content && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{item.content}</p>
              )}
            </div>
          )
        ))}

        {notes && (
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-sm text-gray-600 whitespace-pre-line">{notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
