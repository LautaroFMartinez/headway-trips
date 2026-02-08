'use client';

import type { CancellationPolicyBlock } from '@/types/blocks';
import { ShieldX } from 'lucide-react';

interface ProposalCancellationProps {
  block: CancellationPolicyBlock;
}

export function ProposalCancellation({ block }: ProposalCancellationProps) {
  const { rules, notes } = block.data;

  if (rules.length === 0) return null;

  const sortedRules = [...rules].sort((a, b) => b.daysBeforeTrip - a.daysBeforeTrip);

  return (
    <section id="cancelacion" className="scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShieldX className="w-6 h-6 text-gray-600" />
        Política de cancelación
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sortedRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Más de {rule.daysBeforeTrip} días antes del viaje
                </p>
                {rule.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
                )}
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  rule.refundPercentage === 100
                    ? 'bg-green-100 text-green-700'
                    : rule.refundPercentage > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {rule.refundPercentage}% reembolso
              </span>
            </div>
          ))}
        </div>

        {notes && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 whitespace-pre-line">{notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
