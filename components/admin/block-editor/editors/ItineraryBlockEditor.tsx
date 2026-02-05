'use client';

import { ItineraryBlock, ItineraryDay } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical, Coffee, UtensilsCrossed, Moon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ItineraryBlockEditorProps {
  block: ItineraryBlock;
}

export function ItineraryBlockEditor({ block }: ItineraryBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { days } = block.data;

  const addDay = () => {
    const newDay: ItineraryDay = {
      id: uuidv4(),
      dayNumber: days.length + 1,
      title: `Día ${days.length + 1}`,
      description: '',
      meals: { breakfast: false, lunch: false, dinner: false },
      activities: [],
    };
    updateBlock(block.id, { days: [...days, newDay] });
  };

  const updateDay = (dayId: string, updates: Partial<ItineraryDay>) => {
    const newDays = days.map((day) =>
      day.id === dayId ? { ...day, ...updates } : day
    );
    updateBlock(block.id, { days: newDays });
  };

  const removeDay = (dayId: string) => {
    const newDays = days
      .filter((day) => day.id !== dayId)
      .map((day, index) => ({
        ...day,
        dayNumber: index + 1,
      }));
    updateBlock(block.id, { days: newDays });
  };

  const toggleMeal = (dayId: string, meal: 'breakfast' | 'lunch' | 'dinner') => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;
    updateDay(dayId, {
      meals: { ...day.meals, [meal]: !day.meals[meal] },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Días del itinerario ({days.length})</Label>
        <Button size="sm" onClick={addDay}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar día
        </Button>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <Accordion type="multiple" className="space-y-2">
          {days.map((day) => (
            <AccordionItem key={day.id} value={day.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {day.dayNumber}
                  </div>
                  <span className="font-medium">{day.title || `Día ${day.dayNumber}`}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título del día</Label>
                    <Input
                      value={day.title}
                      onChange={(e) => updateDay(day.id, { title: e.target.value })}
                      placeholder="Ej: Llegada a Buenos Aires"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateDay(day.id, { description: e.target.value })}
                      placeholder="Describe las actividades del día..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Comidas incluidas</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`breakfast-${day.id}`}
                          checked={day.meals.breakfast}
                          onCheckedChange={() => toggleMeal(day.id, 'breakfast')}
                        />
                        <label
                          htmlFor={`breakfast-${day.id}`}
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Coffee className="h-4 w-4" />
                          Desayuno
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`lunch-${day.id}`}
                          checked={day.meals.lunch}
                          onCheckedChange={() => toggleMeal(day.id, 'lunch')}
                        />
                        <label
                          htmlFor={`lunch-${day.id}`}
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <UtensilsCrossed className="h-4 w-4" />
                          Almuerzo
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`dinner-${day.id}`}
                          checked={day.meals.dinner}
                          onCheckedChange={() => toggleMeal(day.id, 'dinner')}
                        />
                        <label
                          htmlFor={`dinner-${day.id}`}
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Moon className="h-4 w-4" />
                          Cena
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDay(day.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar día
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      {days.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No hay días en el itinerario todavía.
          </p>
          <Button onClick={addDay}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer día
          </Button>
        </Card>
      )}
    </div>
  );
}
