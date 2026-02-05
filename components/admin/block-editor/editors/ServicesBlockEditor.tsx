'use client';

import { ServicesBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';

interface ServicesBlockEditorProps {
  block: ServicesBlock;
}

export function ServicesBlockEditor({ block }: ServicesBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { includes, excludes } = block.data;

  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');

  const addInclude = () => {
    if (newInclude.trim()) {
      updateBlock(block.id, { includes: [...includes, newInclude.trim()] });
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    const newIncludes = includes.filter((_, i) => i !== index);
    updateBlock(block.id, { includes: newIncludes });
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      updateBlock(block.id, { excludes: [...excludes, newExclude.trim()] });
      setNewExclude('');
    }
  };

  const removeExclude = (index: number) => {
    const newExcludes = excludes.filter((_, i) => i !== index);
    updateBlock(block.id, { excludes: newExcludes });
  };

  return (
    <div className="space-y-6">
      {/* Includes Section */}
      <div className="space-y-3">
        <Label className="text-green-600 flex items-center gap-2">
          <Check className="h-4 w-4" />
          El viaje incluye
        </Label>

        <div className="flex gap-2">
          <Input
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            placeholder="Ej: Traslados aeropuerto-hotel"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
          />
          <Button onClick={addInclude} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[150px]">
          <div className="space-y-2">
            {includes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg"
              >
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeInclude(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
            {includes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay servicios incluidos
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Excludes Section */}
      <div className="space-y-3">
        <Label className="text-red-600 flex items-center gap-2">
          <X className="h-4 w-4" />
          No incluye
        </Label>

        <div className="flex gap-2">
          <Input
            value={newExclude}
            onChange={(e) => setNewExclude(e.target.value)}
            placeholder="Ej: Seguro de viaje"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
          />
          <Button onClick={addExclude} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[150px]">
          <div className="space-y-2">
            {excludes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg"
              >
                <X className="h-4 w-4 text-red-600 shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeExclude(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
            {excludes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay servicios excluidos
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
