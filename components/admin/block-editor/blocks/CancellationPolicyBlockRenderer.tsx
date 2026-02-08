'use client';

import { CancellationPolicyBlock, CancellationPolicyItem } from '@/types/blocks';

interface CancellationPolicyBlockRendererProps {
  block: CancellationPolicyBlock;
}

export function CancellationPolicyBlockRenderer({ block }: CancellationPolicyBlockRendererProps) {
  const data = block.data as any;
  const items: CancellationPolicyItem[] = data.items ?? [];
  const notes: string = data.notes ?? '';

  const hasContent = items.some((i) => i.title || i.content) || notes;

  if (!hasContent) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para configurar la política de cancelación...
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          {item.title && (
            <p className="text-sm font-medium">{item.title}</p>
          )}
          {item.content && (
            <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
          )}
        </div>
      ))}
      {notes && (
        <p className="text-xs text-muted-foreground italic line-clamp-2">{notes}</p>
      )}
    </div>
  );
}
