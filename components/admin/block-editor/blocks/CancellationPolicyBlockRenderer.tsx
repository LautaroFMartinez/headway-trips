'use client';

import { CancellationPolicyBlock } from '@/types/blocks';

interface CancellationPolicyBlockRendererProps {
  block: CancellationPolicyBlock;
}

export function CancellationPolicyBlockRenderer({ block }: CancellationPolicyBlockRendererProps) {
  const { rules, notes } = block.data;

  if (rules.length === 0) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Haz clic para configurar la política de cancelación...
      </p>
    );
  }

  const sortedRules = [...rules].sort((a, b) => b.daysBeforeTrip - a.daysBeforeTrip);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {sortedRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              +{rule.daysBeforeTrip} días antes
            </span>
            <span className={rule.refundPercentage > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {rule.refundPercentage}% reembolso
            </span>
          </div>
        ))}
      </div>
      {notes && (
        <p className="text-xs text-muted-foreground line-clamp-2">{notes}</p>
      )}
    </div>
  );
}
