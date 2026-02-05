'use client';

import { Check, X } from 'lucide-react';

interface ProposalServicesProps {
  includes: string[];
  excludes: string[];
}

export function ProposalServices({ includes, excludes }: ProposalServicesProps) {
  return (
    <section id="servicios-incluidos" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Servicios incluidos</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Incluido */}
        {includes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Incluido</h3>
            </div>
            <ul className="space-y-2.5">
              {includes.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No incluido */}
        {excludes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">No incluido</h3>
            </div>
            <ul className="space-y-2.5">
              {excludes.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
