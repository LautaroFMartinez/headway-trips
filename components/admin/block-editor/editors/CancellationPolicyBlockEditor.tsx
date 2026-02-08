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
  const { rules, notes } = block.data;

  const addRule = () => {
    updateBlock(block.id, {
      rules: [
        ...rules,
        {
          id: uuidv4(),
          daysBeforeTrip: 0,
          refundPercentage: 0,
        },
      ],
    });
  };

  const removeRule = (id: string) => {
    updateBlock(block.id, { rules: rules.filter((r) => r.id !== id) });
  };

  const updateRule = (id: string, field: string, value: number | string) => {
    updateBlock(block.id, {
      rules: rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Reglas de cancelación</Label>

        <ScrollArea className="max-h-[350px]">
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Días antes del viaje</Label>
                      <Input
                        type="number"
                        min={0}
                        value={rule.daysBeforeTrip}
                        onChange={(e) => updateRule(rule.id, 'daysBeforeTrip', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Reembolso (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={rule.refundPercentage}
                        onChange={(e) => updateRule(rule.id, 'refundPercentage', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <Input
                    value={rule.description || ''}
                    onChange={(e) => updateRule(rule.id, 'description', e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 mt-5"
                  onClick={() => removeRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button onClick={addRule} variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar regla
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
