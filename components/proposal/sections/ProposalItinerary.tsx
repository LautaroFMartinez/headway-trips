'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Coffee, UtensilsCrossed, Moon } from 'lucide-react';
import type { ItineraryDay } from '@/types/blocks';

interface ProposalItineraryProps {
  days: ItineraryDay[];
  startDate?: string;
}

export function ProposalItinerary({ days, startDate }: ProposalItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);

  if (days.length === 0) return null;

  const currentDay = days[activeDay];

  // Calcular fecha de cada día si hay fecha de inicio
  const getDayDate = (dayIndex: number) => {
    if (!startDate) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  const formatDayDate = (dayIndex: number) => {
    const date = getDayDate(dayIndex);
    if (!date) return null;
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNum = date.getDate();
    return { dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1), dayNum };
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = document.getElementById('itinerary-tabs');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="itinerario" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Itinerario</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tabs de días */}
        <div className="relative border-b border-gray-100">
          <div className="flex items-center">
            {/* Botón scroll izquierda */}
            {days.length > 5 && (
              <button
                onClick={() => scrollTabs('left')}
                className="absolute left-0 z-10 h-full px-2 bg-gradient-to-r from-white to-transparent hover:from-gray-50"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
            )}

            {/* Tabs */}
            <div
              id="itinerary-tabs"
              className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {days.map((day, index) => {
                const dateInfo = formatDayDate(index);
                const isActive = activeDay === index;

                return (
                  <button
                    key={day.id}
                    onClick={() => setActiveDay(index)}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-lg transition-colors min-w-[70px] ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span className="text-xs opacity-70">Día {day.dayNumber}</span>
                    {dateInfo && (
                      <span className="font-semibold text-sm">
                        {dateInfo.dayName} {dateInfo.dayNum}
                      </span>
                    )}
                    {!dateInfo && (
                      <span className="font-semibold text-sm">{day.dayNumber}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botón scroll derecha */}
            {days.length > 5 && (
              <button
                onClick={() => scrollTabs('right')}
                className="absolute right-0 z-10 h-full px-2 bg-gradient-to-l from-white to-transparent hover:from-gray-50"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido del día */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentDay.title}</h3>

          {/* Descripción */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{currentDay.description}</p>

          {/* Comidas incluidas */}
          {(currentDay.meals.breakfast || currentDay.meals.lunch || currentDay.meals.dinner) && (
            <div className="flex flex-wrap gap-3 mb-4">
              {currentDay.meals.breakfast && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                  <Coffee className="w-3 h-3" />
                  Desayuno
                </span>
              )}
              {currentDay.meals.lunch && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                  <UtensilsCrossed className="w-3 h-3" />
                  Almuerzo
                </span>
              )}
              {currentDay.meals.dinner && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                  <Moon className="w-3 h-3" />
                  Cena
                </span>
              )}
            </div>
          )}

          {/* Actividades del día */}
          {currentDay.activities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Actividades del día</h4>
              <ul className="space-y-2">
                {currentDay.activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navegación entre días */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
            disabled={activeDay === 0}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Día anterior
          </button>
          <span className="text-sm text-gray-500">
            {activeDay + 1} de {days.length}
          </span>
          <button
            onClick={() => setActiveDay(Math.min(days.length - 1, activeDay + 1))}
            disabled={activeDay === days.length - 1}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Día siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
