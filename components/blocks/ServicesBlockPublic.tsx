'use client';

import { ServicesBlock } from '@/types/blocks';
import { Check, X } from 'lucide-react';

interface ServicesBlockPublicProps {
  block: ServicesBlock;
}

export function ServicesBlockPublic({ block }: ServicesBlockPublicProps) {
  const { includes, excludes } = block.data;

  if (includes.length === 0 && excludes.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {includes.length > 0 && (
        <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
            <Check className="h-5 w-5" />
            El viaje incluye
          </h3>
          <ul className="space-y-3">
            {includes.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {excludes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            <X className="h-5 w-5" />
            No incluye
          </h3>
          <ul className="space-y-3">
            {excludes.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
