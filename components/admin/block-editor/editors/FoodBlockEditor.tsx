'use client';

import { FoodBlock } from '@/types/blocks';
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

interface FoodBlockEditorProps {
  block: FoodBlock;
}

const FOOD_TYPES = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Almuerzo' },
  { value: 'dinner', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
  { value: 'all_inclusive', label: 'Todo Incluido' },
];

const COMMON_DIETARY = [
  'Vegetariano',
  'Vegano',
  'Sin gluten',
  'Sin lactosa',
  'Kosher',
  'Halal',
  'Sin mariscos',
  'Sin frutos secos',
];

export function FoodBlockEditor({ block }: FoodBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { type, name, description, venue, included, price, dietary } = block.data;
  const [newDietary, setNewDietary] = useState('');

  const addDietary = (item: string) => {
    if (item && !dietary?.includes(item)) {
      updateBlock(block.id, { dietary: [...(dietary || []), item] });
    }
    setNewDietary('');
  };

  const removeDietary = (item: string) => {
    updateBlock(block.id, { dietary: dietary?.filter((d) => d !== item) || [] });
  };

  return (
    <div className="space-y-4">
      {/* Type */}
      <div className="space-y-2">
        <Label>Tipo de comida</Label>
        <Select
          value={type}
          onValueChange={(value) => updateBlock(block.id, { type: value as FoodBlock['data']['type'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FOOD_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="food-name">Nombre</Label>
        <Input
          id="food-name"
          value={name}
          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
          placeholder="Asado tradicional argentino"
        />
      </div>

      {/* Venue */}
      <div className="space-y-2">
        <Label htmlFor="food-venue">Lugar / Restaurante</Label>
        <Input
          id="food-venue"
          value={venue || ''}
          onChange={(e) => updateBlock(block.id, { venue: e.target.value })}
          placeholder="Restaurante Don Julio"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="food-description">Descripción</Label>
        <Textarea
          id="food-description"
          value={description || ''}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          placeholder="Descripción del menú o comida..."
          rows={3}
        />
      </div>

      {/* Included & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label htmlFor="food-included" className="cursor-pointer">
            Incluido en el viaje
          </Label>
          <Switch
            id="food-included"
            checked={included}
            onCheckedChange={(checked) => updateBlock(block.id, { included: checked })}
          />
        </div>

        {!included && (
          <div className="space-y-2">
            <Label htmlFor="food-price">Precio adicional</Label>
            <Input
              id="food-price"
              type="number"
              min="0"
              value={price || ''}
              onChange={(e) => updateBlock(block.id, { price: parseFloat(e.target.value) || undefined })}
              placeholder="0"
            />
          </div>
        )}
      </div>

      {/* Dietary Options */}
      <div className="space-y-2">
        <Label>Opciones dietéticas disponibles</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {COMMON_DIETARY.filter((d) => !dietary?.includes(d)).map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => addDietary(item)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {item}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newDietary}
            onChange={(e) => setNewDietary(e.target.value)}
            placeholder="Agregar otra opción..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDietary(newDietary))}
          />
          <Button onClick={() => addDietary(newDietary)} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {dietary && dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dietary.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => removeDietary(item)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
