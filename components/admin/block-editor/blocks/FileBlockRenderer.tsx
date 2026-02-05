'use client';

import { FileBlock } from '@/types/blocks';
import { FileText, FileIcon, Download } from 'lucide-react';

interface FileBlockRendererProps {
  block: FileBlock;
}

const FILE_ICONS = {
  pdf: FileText,
  doc: FileIcon,
  other: FileIcon,
};

export function FileBlockRenderer({ block }: FileBlockRendererProps) {
  const { url, name, type, description, size } = block.data;

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground italic text-sm">
          Haz clic para agregar un archivo...
        </p>
      </div>
    );
  }

  const Icon = FILE_ICONS[type] || FileIcon;

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{name || 'Archivo sin nombre'}</h4>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {type.toUpperCase()}
          {size && ` • ${formatSize(size)}`}
        </p>
      </div>
      <Download className="h-5 w-5 text-muted-foreground shrink-0" />
    </div>
  );
}
