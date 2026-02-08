'use client';

import { CancellationPolicyBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CancellationPolicyBlockEditorProps {
  block: CancellationPolicyBlock;
}

export function CancellationPolicyBlockEditor({ block }: CancellationPolicyBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { items, notes } = block.data;

  const addItem = () => {
    updateBlock(block.id, {
      items: [
        ...items,
        {
          id: uuidv4(),
          title: '',
          content: '',
        },
      ],
    });
  };

  const removeItem = (id: string) => {
    updateBlock(block.id, { items: items.filter((i) => i.id !== id) });
  };

  const updateItem = (id: string, field: string, value: string) => {
    updateBlock(block.id, {
      items: items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Secciones de cancelación</Label>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    placeholder="Título (ej: Cancelación con más de 30 días)"
                  />
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                    placeholder="Descripción de la política..."
                    rows={3}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 mt-1"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button onClick={addItem} variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar sección
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Notas adicionales</Label>
        <Textarea
          value={notes || ''}
          onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
          placeholder="Ej: En caso de fuerza mayor se evaluará cada situación..."
          rows={3}
        />
      </div>
    </div>
  );
}
