'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, User, FileText, Phone, Utensils, Users, Baby } from 'lucide-react';

interface PassengerForm {
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  birth_date: string;
  passport_number: string;
  passport_issuing_country: string;
  passport_expiry_date: string;
  instagram: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  dietary_notes: string;
  allergies: string;
  additional_notes: string;
  is_adult: boolean;
}

function createEmptyPassenger(isAdult: boolean): PassengerForm {
  return {
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    birth_date: '',
    passport_number: '',
    passport_issuing_country: '',
    passport_expiry_date: '',
    instagram: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    dietary_notes: '',
    allergies: '',
    additional_notes: '',
    is_adult: isAdult,
  };
}

interface ClientDetailsFormProps {
  token: string;
  customerName: string;
  customerEmail: string;
  tripTitle: string;
  adults: number;
  children: number;
  onSuccess: () => void;
}

export function ClientDetailsForm({
  token,
  customerName,
  customerEmail,
  tripTitle,
  adults,
  children,
  onSuccess,
}: ClientDetailsFormProps) {
  const totalPassengers = adults + children;

  const [passengers, setPassengers] = useState<PassengerForm[]>(() => {
    const list: PassengerForm[] = [];
    for (let i = 0; i < adults; i++) {
      const p = createEmptyPassenger(true);
      if (i === 0) {
        p.full_name = customerName || '';
        p.email = customerEmail || '';
      }
      list.push(p);
    }
    for (let i = 0; i < children; i++) {
      list.push(createEmptyPassenger(false));
    }
    return list;
  });

  const [activePassenger, setActivePassenger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (index: number, field: keyof PassengerForm, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getPassengerLabel = (index: number): string => {
    const p = passengers[index];
    if (p.is_adult) {
      const adultIndex = passengers.slice(0, index + 1).filter((x) => x.is_adult).length;
      return index === 0 ? 'Pasajero principal' : `Adulto ${adultIndex}`;
    }
    const childIndex = passengers.slice(0, index + 1).filter((x) => !x.is_adult).length;
    return `Niño ${childIndex}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.full_name.trim()) {
        setActivePassenger(i);
        setError(`El nombre completo es requerido para ${getPassengerLabel(i)}`);
        return;
      }
      if (i === 0) {
        if (!p.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
          setActivePassenger(i);
          setError('Ingresa un email válido para el pasajero principal');
          return;
        }
        if (!p.phone.trim()) {
          setActivePassenger(i);
          setError('El teléfono es requerido para el pasajero principal');
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, passengers }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al guardar los datos');
        return;
      }

      onSuccess();
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = passengers[activePassenger];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Passenger tabs */}
      {totalPassengers > 1 && (
        <div className="flex flex-wrap gap-2">
          {passengers.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActivePassenger(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePassenger === i
                  ? 'bg-primary text-white'
                  : p.full_name.trim()
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.is_adult ? <Users className="w-3.5 h-3.5" /> : <Baby className="w-3.5 h-3.5" />}
              {p.full_name.trim() || getPassengerLabel(i)}
              {p.full_name.trim() && activePassenger !== i && (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Current passenger header */}
      <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
        {current.is_adult ? <Users className="w-4 h-4 text-primary" /> : <Baby className="w-4 h-4 text-primary" />}
        <span className="text-sm font-medium text-gray-700">
          {getPassengerLabel(activePassenger)}
          {!current.is_adult && <span className="text-gray-400 ml-1">(menor de 12 años)</span>}
        </span>
        <span className="ml-auto text-xs text-gray-400">{activePassenger + 1} de {totalPassengers}</span>
      </div>

      {/* Personal info */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nombre completo *</Label>
            <Input
              value={current.full_name}
              onChange={(e) => updateField(activePassenger, 'full_name', e.target.value)}
              placeholder="Nombre y apellido"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email {activePassenger === 0 && '*'}</Label>
            <Input
              type="email"
              value={current.email}
              onChange={(e) => updateField(activePassenger, 'email', e.target.value)}
              placeholder="tu@email.com"
              required={activePassenger === 0}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono {activePassenger === 0 && '*'}</Label>
            <Input
              type="tel"
              value={current.phone}
              onChange={(e) => updateField(activePassenger, 'phone', e.target.value)}
              placeholder="+54 11 1234-5678"
              required={activePassenger === 0}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nacionalidad</Label>
            <Input
              value={current.nationality}
              onChange={(e) => updateField(activePassenger, 'nationality', e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={current.birth_date}
              onChange={(e) => updateField(activePassenger, 'birth_date', e.target.value)}
            />
          </div>
          {current.is_adult && (
            <div className="space-y-1.5">
              <Label>Instagram</Label>
              <Input
                value={current.instagram}
                onChange={(e) => updateField(activePassenger, 'instagram', e.target.value)}
                placeholder="@usuario"
              />
            </div>
          )}
        </div>
      </section>

      {/* Passport */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Pasaporte
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Número de pasaporte</Label>
            <Input
              value={current.passport_number}
              onChange={(e) => updateField(activePassenger, 'passport_number', e.target.value)}
              placeholder="AB1234567"
            />
          </div>
          <div className="space-y-1.5">
            <Label>País de emisión</Label>
            <Input
              value={current.passport_issuing_country}
              onChange={(e) => updateField(activePassenger, 'passport_issuing_country', e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de vencimiento</Label>
            <Input
              type="date"
              value={current.passport_expiry_date}
              onChange={(e) => updateField(activePassenger, 'passport_expiry_date', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Emergency contact */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          Contacto de emergencia
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input
              value={current.emergency_contact_name}
              onChange={(e) => updateField(activePassenger, 'emergency_contact_name', e.target.value)}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input
              type="tel"
              value={current.emergency_contact_phone}
              onChange={(e) => updateField(activePassenger, 'emergency_contact_phone', e.target.value)}
              placeholder="+54 11 1234-5678"
            />
          </div>
        </div>
      </section>

      {/* Additional info */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Información adicional
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Restricciones alimentarias</Label>
            <Input
              value={current.dietary_notes}
              onChange={(e) => updateField(activePassenger, 'dietary_notes', e.target.value)}
              placeholder="Vegetariano, vegano, etc."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Alergias</Label>
            <Input
              value={current.allergies}
              onChange={(e) => updateField(activePassenger, 'allergies', e.target.value)}
              placeholder="Alergias conocidas"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Notas adicionales</Label>
          <Textarea
            value={current.additional_notes}
            onChange={(e) => updateField(activePassenger, 'additional_notes', e.target.value)}
            placeholder="Cualquier información adicional que debamos saber..."
            rows={3}
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {/* Navigation + Submit */}
      <div className="flex gap-3">
        {activePassenger > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setActivePassenger(activePassenger - 1)}
            className="flex-1"
          >
            Anterior
          </Button>
        )}
        {activePassenger < totalPassengers - 1 ? (
          <Button
            type="button"
            onClick={() => {
              // Validate current before moving on
              if (!current.full_name.trim()) {
                setError(`El nombre completo es requerido para ${getPassengerLabel(activePassenger)}`);
                return;
              }
              if (activePassenger === 0) {
                if (!current.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) {
                  setError('Ingresa un email válido para el pasajero principal');
                  return;
                }
                if (!current.phone.trim()) {
                  setError('El teléfono es requerido para el pasajero principal');
                  return;
                }
              }
              setError('');
              setActivePassenger(activePassenger + 1);
            }}
            className="flex-1"
          >
            Siguiente pasajero
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2" size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirmar reserva ({totalPassengers} pasajero{totalPassengers > 1 ? 's' : ''})
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
