'use client';

import { Users, CalendarCheck } from 'lucide-react';

interface SpotsIndicatorProps {
  maxCapacity: number;
  currentBookings: number;
  variant: 'badge' | 'card';
  price?: string;
}

export function SpotsIndicator({ maxCapacity, currentBookings, variant, price }: SpotsIndicatorProps) {
  const remaining = Math.max(0, maxCapacity - currentBookings);
  const percentage = maxCapacity > 0 ? (currentBookings / maxCapacity) * 100 : 0;

  const isLow = remaining > 0 && remaining <= 3;
  const isSoldOut = remaining === 0;

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium ${
          isSoldOut
            ? 'bg-red-100 text-red-700'
            : isLow
              ? 'bg-orange-100 text-orange-700'
              : 'bg-green-100 text-green-700'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        {isSoldOut
          ? 'Sin cupos'
          : isLow
            ? `¡Últimos ${remaining} cupos!`
            : `${remaining} cupos disponibles`}
      </span>
    );
  }

  // variant === 'card' — Bloque completo con reserva
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header con precio */}
      {price && (
        <div className="px-5 pt-5 pb-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Desde</p>
          <p className="text-2xl font-bold text-gray-900">{price}</p>
          <p className="text-xs text-gray-500">por persona</p>
        </div>
      )}

      {/* Cupos */}
      <div className={`px-5 ${price ? 'pb-4' : 'py-5'} space-y-3`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Disponibilidad
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isSoldOut
                ? 'bg-red-100 text-red-700'
                : isLow
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
            {isSoldOut ? 'Agotado' : isLow ? '¡Últimos cupos!' : 'Disponible'}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isSoldOut
                ? 'bg-red-500'
                : isLow
                  ? 'bg-orange-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {isSoldOut ? (
            'No quedan cupos disponibles'
          ) : (
            <>
              <span className="font-semibold text-gray-900">{remaining}</span> de{' '}
              <span className="font-semibold text-gray-900">{maxCapacity}</span> cupos disponibles
            </>
          )}
        </p>
      </div>

      {/* Botón Reservar */}
      <div className="px-5 pb-5">
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full bg-primary/40 text-white py-3 px-4 rounded-xl font-semibold cursor-not-allowed transition-colors"
          title="Reservas próximamente disponibles"
        >
          <CalendarCheck className="w-5 h-5" />
          Reservar ahora
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Reservas online próximamente
        </p>
      </div>
    </div>
  );
}
