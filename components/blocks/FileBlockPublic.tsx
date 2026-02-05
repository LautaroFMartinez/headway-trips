'use client';

import { FileBlock } from '@/types/blocks';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface FileBlockPublicProps {
  block: FileBlock;
}

export function FileBlockPublic({ block }: FileBlockPublicProps) {
  const { url, name, type, description } = block.data;

  if (!url) return null;

  return (
    <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <FileText className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">
            {name || 'Documento'}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir {type.toUpperCase()}
            </a>
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 text-sm border border-border px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
