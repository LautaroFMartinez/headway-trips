'use client';

import { TransportBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

interface TransportBlockEditorProps {
  block: TransportBlock;
}

const TRANSPORT_TYPES = [
  { value: 'bus', label: 'Bus' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Auto' },
  { value: 'train', label: 'Tren' },
  { value: 'boat', label: 'Barco' },
  { value: 'other', label: 'Otro' },
];

export function TransportBlockEditor({ block }: TransportBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { type, origin, destination, duration, company, class: serviceClass, departureTime, arrivalTime, included, price, notes } = block.data;

  return (
    <div className="space-y-4">
      {/* Type */}
      <div className="space-y-2">
        <Label>Tipo de transporte</Label>
        <Select
          value={type}
          onValueChange={(value) => updateBlock(block.id, { type: value as TransportBlock['data']['type'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSPORT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Origin & Destination */}
      <div className="space-y-2">
        <Label>Ruta</Label>
        <div className="flex items-center gap-2">
          <Input
            value={origin}
            onChange={(e) => updateBlock(block.id, { origin: e.target.value })}
            placeholder="Origen"
            className="flex-1"
          />
          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={destination}
            onChange={(e) => updateBlock(block.id, { destination: e.target.value })}
            placeholder="Destino"
            className="flex-1"
          />
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trans-departure">Hora de salida</Label>
          <Input
            id="trans-departure"
            type="time"
            value={departureTime || ''}
            onChange={(e) => updateBlock(block.id, { departureTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trans-arrival">Hora de llegada</Label>
          <Input
            id="trans-arrival"
            type="time"
            value={arrivalTime || ''}
            onChange={(e) => updateBlock(block.id, { arrivalTime: e.target.value })}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="trans-duration">Duración estimada</Label>
        <Input
          id="trans-duration"
          value={duration || ''}
          onChange={(e) => updateBlock(block.id, { duration: e.target.value })}
          placeholder="2 horas 30 minutos"
        />
      </div>

      {/* Company & Class */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trans-company">Compañía (opcional)</Label>
          <Input
            id="trans-company"
            value={company || ''}
            onChange={(e) => updateBlock(block.id, { company: e.target.value })}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trans-class">Clase (opcional)</Label>
          <Input
            id="trans-class"
            value={serviceClass || ''}
            onChange={(e) => updateBlock(block.id, { class: e.target.value })}
            placeholder="Semi-cama, Ejecutivo..."
          />
        </div>
      </div>

      {/* Included & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label htmlFor="trans-included" className="cursor-pointer">
            Incluido en el viaje
          </Label>
          <Switch
            id="trans-included"
            checked={included}
            onCheckedChange={(checked) => updateBlock(block.id, { included: checked })}
          />
        </div>

        {!included && (
          <div className="space-y-2">
            <Label htmlFor="trans-price">Precio adicional</Label>
            <Input
              id="trans-price"
              type="number"
              min="0"
              value={price || ''}
              onChange={(e) => updateBlock(block.id, { price: parseFloat(e.target.value) || undefined })}
              placeholder="0"
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="trans-notes">Notas adicionales</Label>
        <Textarea
          id="trans-notes"
          value={notes || ''}
          onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
          placeholder="Información adicional..."
          rows={2}
        />
      </div>
    </div>
  );
}
