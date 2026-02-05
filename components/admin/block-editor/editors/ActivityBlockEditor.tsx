'use client';

import { ActivityBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ActivityBlockEditorProps {
  block: ActivityBlock;
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Fácil' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'challenging', label: 'Desafiante' },
  { value: 'extreme', label: 'Extremo' },
];

export function ActivityBlockEditor({ block }: ActivityBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { name, description, duration, difficulty, included, price, location, equipment, notes } = block.data;
  const [newEquipment, setNewEquipment] = useState('');

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment?.includes(newEquipment.trim())) {
      updateBlock(block.id, { equipment: [...(equipment || []), newEquipment.trim()] });
      setNewEquipment('');
    }
  };

  const removeEquipment = (item: string) => {
    updateBlock(block.id, { equipment: equipment?.filter((e) => e !== item) || [] });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="act-name">Nombre de la actividad</Label>
        <Input
          id="act-name"
          value={name}
          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
          placeholder="Trekking al Glaciar Perito Moreno"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="act-description">Descripción</Label>
        <Textarea
          id="act-description"
          value={description}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          placeholder="Descripción de la actividad..."
          rows={3}
        />
      </div>

      {/* Duration & Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="act-duration">Duración</Label>
          <Input
            id="act-duration"
            value={duration}
            onChange={(e) => updateBlock(block.id, { duration: e.target.value })}
            placeholder="4 horas"
          />
        </div>

        <div className="space-y-2">
          <Label>Dificultad</Label>
          <Select
            value={difficulty}
            onValueChange={(value) => updateBlock(block.id, { difficulty: value as ActivityBlock['data']['difficulty'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="act-location">Ubicación</Label>
        <Input
          id="act-location"
          value={location || ''}
          onChange={(e) => updateBlock(block.id, { location: e.target.value })}
          placeholder="Parque Nacional Los Glaciares"
        />
      </div>

      {/* Included & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label htmlFor="act-included" className="cursor-pointer">
            Incluido en el viaje
          </Label>
          <Switch
            id="act-included"
            checked={included}
            onCheckedChange={(checked) => updateBlock(block.id, { included: checked })}
          />
        </div>

        {!included && (
          <div className="space-y-2">
            <Label htmlFor="act-price">Precio adicional</Label>
            <Input
              id="act-price"
              type="number"
              min="0"
              value={price || ''}
              onChange={(e) => updateBlock(block.id, { price: parseFloat(e.target.value) || undefined })}
              placeholder="0"
            />
          </div>
        )}
      </div>

      {/* Equipment */}
      <div className="space-y-2">
        <Label>Equipamiento necesario</Label>
        <div className="flex gap-2">
          <Input
            value={newEquipment}
            onChange={(e) => setNewEquipment(e.target.value)}
            placeholder="Agregar equipamiento..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
          />
          <Button onClick={addEquipment} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {equipment && equipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {equipment.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => removeEquipment(item)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="act-notes">Notas adicionales</Label>
        <Textarea
          id="act-notes"
          value={notes || ''}
          onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
          placeholder="Información adicional..."
          rows={2}
        />
      </div>
    </div>
  );
}
