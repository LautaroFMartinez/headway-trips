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
import { Plus, Trash2, X, GripVertical, Coffee, UtensilsCrossed, Moon } from 'lucide-react';
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

  const addActivity = (dayId: string) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;
    updateDay(dayId, { activities: [...(day.activities || []), ''] });
  };

  const updateActivity = (dayId: string, index: number, value: string) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;
    const newActivities = [...(day.activities || [])];
    newActivities[index] = value;
    updateDay(dayId, { activities: newActivities });
  };

  const removeActivity = (dayId: string, index: number) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;
    const newActivities = (day.activities || []).filter((_, i) => i !== index);
    updateDay(dayId, { activities: newActivities });
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

                  {/* Actividades del día */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Actividades</Label>
                      <Button size="sm" variant="outline" onClick={() => addActivity(day.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    {(day.activities || []).map((activity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                          {index + 1}
                        </span>
                        <Input
                          value={activity}
                          onChange={(e) => updateActivity(day.id, index, e.target.value)}
                          placeholder="Ej: Visita al centro histórico"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => removeActivity(day.id, index)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
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
