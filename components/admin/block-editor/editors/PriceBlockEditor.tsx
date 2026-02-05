'use client';

import { PriceBlock, PriceOption } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PriceBlockEditorProps {
  block: PriceBlock;
}

export function PriceBlockEditor({ block }: PriceBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { basePrice, currency, priceType, options, notes } = block.data;

  const addOption = () => {
    const newOption: PriceOption = {
      id: uuidv4(),
      name: '',
      description: '',
      price: 0,
    };
    updateBlock(block.id, { options: [...options, newOption] });
  };

  const updateOption = (optionId: string, updates: Partial<PriceOption>) => {
    const newOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    updateBlock(block.id, { options: newOptions });
  };

  const removeOption = (optionId: string) => {
    const newOptions = options.filter((opt) => opt.id !== optionId);
    updateBlock(block.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base-price">Precio base</Label>
          <Input
            id="base-price"
            type="number"
            min="0"
            step="0.01"
            value={basePrice}
            onChange={(e) => updateBlock(block.id, { basePrice: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select
            value={currency}
            onValueChange={(value) => updateBlock(block.id, { currency: value as PriceBlock['data']['currency'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - Dólar</SelectItem>
              <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo de precio</Label>
        <Select
          value={priceType}
          onValueChange={(value) => updateBlock(block.id, { priceType: value as PriceBlock['data']['priceType'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_person">Por persona</SelectItem>
            <SelectItem value="per_group">Por grupo</SelectItem>
            <SelectItem value="per_night">Por noche</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Opciones de precio ({options.length})</Label>
          <Button size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar opción
          </Button>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-3 pr-4">
            {options.map((option) => (
              <Card key={option.id} className="p-3">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nombre de la opción"
                      value={option.name}
                      onChange={(e) => updateOption(option.id, { name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={option.price}
                      onChange={(e) => updateOption(option.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Descripción (opcional)"
                    value={option.description}
                    onChange={(e) => updateOption(option.id, { description: e.target.value })}
                  />
                </div>
              </Card>
            ))}
            {options.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay opciones de precio adicionales
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea
          id="notes"
          value={notes || ''}
          onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
          placeholder="Ej: Precio no incluye impuestos..."
          rows={3}
        />
      </div>
    </div>
  );
}
