'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Minus, Plus, Users, CreditCard } from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  priceValue: number;
  priceFormatted: string;
  maxCapacity: number;
  currentBookings: number;
}

export function BookingModal({
  open,
  onClose,
  tripId,
  tripTitle,
  priceValue,
  priceFormatted,
  maxCapacity,
  currentBookings,
}: BookingModalProps) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const remaining = Math.max(0, maxCapacity - currentBookings);
  const totalPassengers = adults + children;
  const totalPrice = priceValue * totalPassengers;
  const deposit = Math.round(totalPrice * 0.10 * 100) / 100;

  const canAddMore = totalPassengers < remaining;

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('Ingresa tu nombre');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          adults,
          children,
          customer_name: name.trim(),
          customer_email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al procesar la reserva');
        return;
      }

      // Redirect to Revolut checkout
      window.location.href = data.checkout_url;
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar {tripTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Passengers */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pasajeros
            </Label>

            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Adultos</p>
                <p className="text-xs text-gray-500">Mayores de 12 años</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-medium">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  disabled={!canAddMore}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Niños</p>
                <p className="text-xs text-gray-500">Menores de 12 años</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-medium">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  disabled={!canAddMore}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              {remaining} cupos disponibles
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="booking-name">Nombre completo</Label>
              <Input
                id="booking-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-email">Email</Label>
              <Input
                id="booking-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {priceFormatted} x {totalPassengers} pasajero{totalPassengers > 1 ? 's' : ''}
              </span>
              <span className="font-medium">
                USD ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Depósito (10%)
              </span>
              <span className="text-lg font-bold text-primary">
                USD ${deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              El saldo restante se coordina con nuestro equipo
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          {/* CTA */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Continuar al pago
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Serás redirigido a Revolut para completar el pago de forma segura
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
