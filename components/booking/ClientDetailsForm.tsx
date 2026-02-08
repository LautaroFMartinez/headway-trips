'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, User, FileText, Phone, Utensils } from 'lucide-react';

interface ClientDetailsFormProps {
  token: string;
  customerName: string;
  customerEmail: string;
  tripTitle: string;
  onSuccess: () => void;
}

export function ClientDetailsForm({
  token,
  customerName,
  customerEmail,
  tripTitle,
  onSuccess,
}: ClientDetailsFormProps) {
  const [form, setForm] = useState({
    full_name: customerName || '',
    email: customerEmail || '',
    phone: '',
    nationality: '',
    birth_date: '',
    passport_number: '',
    passport_expiry_date: '',
    instagram: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    dietary_notes: '',
    allergies: '',
    additional_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.full_name.trim()) {
      setError('El nombre completo es requerido');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Ingresa un email válido');
      return;
    }
    if (!form.phone.trim()) {
      setError('El teléfono es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal info */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Nombre completo *</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              placeholder="Nombre y apellido"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+54 11 1234-5678"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nationality">Nacionalidad</Label>
            <Input
              id="nationality"
              value={form.nationality}
              onChange={(e) => updateField('nationality', e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => updateField('birth_date', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={form.instagram}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="@usuario"
            />
          </div>
        </div>
      </section>

      {/* Passport */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Pasaporte
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="passport_number">Número de pasaporte</Label>
            <Input
              id="passport_number"
              value={form.passport_number}
              onChange={(e) => updateField('passport_number', e.target.value)}
              placeholder="AB1234567"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="passport_expiry_date">Fecha de vencimiento</Label>
            <Input
              id="passport_expiry_date"
              type="date"
              value={form.passport_expiry_date}
              onChange={(e) => updateField('passport_expiry_date', e.target.value)}
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
            <Label htmlFor="emergency_contact_name">Nombre</Label>
            <Input
              id="emergency_contact_name"
              value={form.emergency_contact_name}
              onChange={(e) => updateField('emergency_contact_name', e.target.value)}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emergency_contact_phone">Teléfono</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={form.emergency_contact_phone}
              onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
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
            <Label htmlFor="dietary_notes">Restricciones alimentarias</Label>
            <Input
              id="dietary_notes"
              value={form.dietary_notes}
              onChange={(e) => updateField('dietary_notes', e.target.value)}
              placeholder="Vegetariano, vegano, etc."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="allergies">Alergias</Label>
            <Input
              id="allergies"
              value={form.allergies}
              onChange={(e) => updateField('allergies', e.target.value)}
              placeholder="Alergias conocidas"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="additional_notes">Notas adicionales</Label>
          <Textarea
            id="additional_notes"
            value={form.additional_notes}
            onChange={(e) => updateField('additional_notes', e.target.value)}
            placeholder="Cualquier información adicional que debamos saber..."
            rows={3}
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full gap-2" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Confirmar reserva
          </>
        )}
      </Button>
    </form>
  );
}
