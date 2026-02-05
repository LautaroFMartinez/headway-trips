'use client';

import { AccommodationBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface AccommodationBlockEditorProps {
  block: AccommodationBlock;
}

const ACCOMMODATION_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'resort', label: 'Resort' },
  { value: 'cabin', label: 'Cabaña' },
  { value: 'camping', label: 'Camping' },
  { value: 'other', label: 'Otro' },
];

const COMMON_AMENITIES = [
  'WiFi',
  'Desayuno incluido',
  'Piscina',
  'Estacionamiento',
  'Aire acondicionado',
  'TV',
  'Minibar',
  'Caja fuerte',
  'Room service',
  'Spa',
  'Gimnasio',
  'Restaurante',
];

export function AccommodationBlockEditor({ block }: AccommodationBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { name, category, type, nights, roomType, amenities, checkIn, checkOut, address, description } = block.data;
  const [newAmenity, setNewAmenity] = useState('');

  const addAmenity = (amenity: string) => {
    if (amenity && !amenities.includes(amenity)) {
      updateBlock(block.id, { amenities: [...amenities, amenity] });
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    updateBlock(block.id, { amenities: amenities.filter((a) => a !== amenity) });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="acc-name">Nombre del alojamiento</Label>
        <Input
          id="acc-name"
          value={name}
          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
          placeholder="Hotel Plaza Mayor"
        />
      </div>

      {/* Type & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={type}
            onValueChange={(value) => updateBlock(block.id, { type: value as AccommodationBlock['data']['type'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOMMODATION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Categoría (estrellas)</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateBlock(block.id, { category: star as AccommodationBlock['data']['category'] })}
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= category
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Nights & Room Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="acc-nights">Noches</Label>
          <Input
            id="acc-nights"
            type="number"
            min="1"
            value={nights}
            onChange={(e) => updateBlock(block.id, { nights: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acc-room">Tipo de habitación</Label>
          <Input
            id="acc-room"
            value={roomType || ''}
            onChange={(e) => updateBlock(block.id, { roomType: e.target.value })}
            placeholder="Doble estándar"
          />
        </div>
      </div>

      {/* Check-in/Check-out */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="acc-checkin">Check-in</Label>
          <Input
            id="acc-checkin"
            type="time"
            value={checkIn || ''}
            onChange={(e) => updateBlock(block.id, { checkIn: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acc-checkout">Check-out</Label>
          <Input
            id="acc-checkout"
            type="time"
            value={checkOut || ''}
            onChange={(e) => updateBlock(block.id, { checkOut: e.target.value })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="acc-address">Dirección (opcional)</Label>
        <Input
          id="acc-address"
          value={address || ''}
          onChange={(e) => updateBlock(block.id, { address: e.target.value })}
          placeholder="Av. Principal 123"
        />
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {COMMON_AMENITIES.filter((a) => !amenities.includes(a)).map((amenity) => (
            <Badge
              key={amenity}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => addAmenity(amenity)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {amenity}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Agregar otro amenity..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(newAmenity))}
          />
          <Button onClick={() => addAmenity(newAmenity)} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => removeAmenity(amenity)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="acc-description">Descripción (opcional)</Label>
        <Textarea
          id="acc-description"
          value={description || ''}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          placeholder="Descripción del alojamiento..."
          rows={3}
        />
      </div>
    </div>
  );
}
