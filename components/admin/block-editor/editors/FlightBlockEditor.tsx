'use client';

import { FlightBlock, FlightSegment } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2, Plane, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FlightBlockEditorProps {
  block: FlightBlock;
}

const CLASS_OPTIONS = [
  { value: 'economy', label: 'Económica' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'Primera Clase' },
];

export function FlightBlockEditor({ block }: FlightBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { segments, included, price, notes } = block.data;

  const addSegment = () => {
    const newSegment: FlightSegment = {
      id: uuidv4(),
      airline: '',
      flightNumber: '',
      origin: '',
      originCode: '',
      destination: '',
      destinationCode: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      class: 'economy',
    };
    updateBlock(block.id, { segments: [...segments, newSegment] });
  };

  const updateSegment = (segmentId: string, updates: Partial<FlightSegment>) => {
    const newSegments = segments.map((seg) =>
      seg.id === segmentId ? { ...seg, ...updates } : seg
    );
    updateBlock(block.id, { segments: newSegments });
  };

  const removeSegment = (segmentId: string) => {
    const newSegments = segments.filter((seg) => seg.id !== segmentId);
    updateBlock(block.id, { segments: newSegments });
  };

  return (
    <div className="space-y-4">
      {/* Segments */}
      <div className="flex items-center justify-between">
        <Label>Segmentos de vuelo ({segments.length})</Label>
        <Button size="sm" onClick={addSegment}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar segmento
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <Accordion type="multiple" className="space-y-2 pr-4">
          {segments.map((segment, index) => (
            <AccordionItem key={segment.id} value={segment.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Plane className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {segment.originCode || '---'}
                    <ArrowRight className="h-3 w-3 inline mx-1" />
                    {segment.destinationCode || '---'}
                  </span>
                  {segment.airline && (
                    <span className="text-sm text-muted-foreground">
                      ({segment.airline})
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {/* Airline & Flight Number */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Aerolínea</Label>
                      <Input
                        value={segment.airline}
                        onChange={(e) => updateSegment(segment.id, { airline: e.target.value })}
                        placeholder="Aerolíneas Argentinas"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Número de vuelo</Label>
                      <Input
                        value={segment.flightNumber}
                        onChange={(e) => updateSegment(segment.id, { flightNumber: e.target.value })}
                        placeholder="AR1234"
                      />
                    </div>
                  </div>

                  {/* Origin */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Origen</Label>
                      <Input
                        value={segment.origin}
                        onChange={(e) => updateSegment(segment.id, { origin: e.target.value })}
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Código</Label>
                      <Input
                        value={segment.originCode}
                        onChange={(e) => updateSegment(segment.id, { originCode: e.target.value.toUpperCase() })}
                        placeholder="EZE"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Destino</Label>
                      <Input
                        value={segment.destination}
                        onChange={(e) => updateSegment(segment.id, { destination: e.target.value })}
                        placeholder="El Calafate"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Código</Label>
                      <Input
                        value={segment.destinationCode}
                        onChange={(e) => updateSegment(segment.id, { destinationCode: e.target.value.toUpperCase() })}
                        placeholder="FTE"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Fecha salida</Label>
                      <Input
                        type="date"
                        value={segment.departureDate}
                        onChange={(e) => updateSegment(segment.id, { departureDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Hora salida</Label>
                      <Input
                        type="time"
                        value={segment.departureTime}
                        onChange={(e) => updateSegment(segment.id, { departureTime: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Fecha llegada</Label>
                      <Input
                        type="date"
                        value={segment.arrivalDate}
                        onChange={(e) => updateSegment(segment.id, { arrivalDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Hora llegada</Label>
                      <Input
                        type="time"
                        value={segment.arrivalTime}
                        onChange={(e) => updateSegment(segment.id, { arrivalTime: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Class & Baggage */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Clase</Label>
                      <Select
                        value={segment.class}
                        onValueChange={(value) => updateSegment(segment.id, { class: value as FlightSegment['class'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CLASS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Equipaje</Label>
                      <Input
                        value={segment.baggage || ''}
                        onChange={(e) => updateSegment(segment.id, { baggage: e.target.value })}
                        placeholder="23kg + carry-on"
                      />
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSegment(segment.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar segmento
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      {segments.length === 0 && (
        <Card className="p-8 text-center">
          <Plane className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No hay segmentos de vuelo todavía.
          </p>
          <Button onClick={addSegment}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer segmento
          </Button>
        </Card>
      )}

      {/* Included & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label htmlFor="flight-included" className="cursor-pointer">
            Incluido en el viaje
          </Label>
          <Switch
            id="flight-included"
            checked={included}
            onCheckedChange={(checked) => updateBlock(block.id, { included: checked })}
          />
        </div>

        {!included && (
          <div className="space-y-2">
            <Label htmlFor="flight-price">Precio adicional</Label>
            <Input
              id="flight-price"
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
        <Label htmlFor="flight-notes">Notas adicionales</Label>
        <Textarea
          id="flight-notes"
          value={notes || ''}
          onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
          placeholder="Información adicional sobre los vuelos..."
          rows={2}
        />
      </div>
    </div>
  );
}
