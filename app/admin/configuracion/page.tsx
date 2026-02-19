'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Loader2, CreditCard, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [newsletterNotifyOnNewTrip, setNewsletterNotifyOnNewTrip] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingPayments, setSavingPayments] = useState(false);
  const [savingNewsletter, setSavingNewsletter] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setPaymentsEnabled(data.payments_enabled === true || data.payments_enabled === 'true');
        setNewsletterNotifyOnNewTrip(data.newsletter_notify_on_new_trip === true || data.newsletter_notify_on_new_trip === 'true');
      })
      .catch(() => toast.error('Error al cargar configuración'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    const newValue = !paymentsEnabled;
    setSavingPayments(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'payments_enabled', value: newValue }),
      });
      if (!res.ok) throw new Error();
      setPaymentsEnabled(newValue);
      toast.success(newValue ? 'Pagos online habilitados' : 'Pagos online deshabilitados');
    } catch {
      toast.error('Error al actualizar configuración');
    } finally {
      setSavingPayments(false);
    }
  };

  const handleNewsletterToggle = async () => {
    const newValue = !newsletterNotifyOnNewTrip;
    setSavingNewsletter(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'newsletter_notify_on_new_trip', value: newValue }),
      });
      if (!res.ok) throw new Error();
      setNewsletterNotifyOnNewTrip(newValue);
      toast.success(newValue ? 'Notificación al newsletter activada' : 'Notificación al newsletter desactivada');
    } catch {
      toast.error('Error al actualizar configuración');
    } finally {
      setSavingNewsletter(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Configuración</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
            {/* Payments toggle */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Pagos online</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Cuando está desactivado, los usuarios pueden reservar sin realizar el pago previo por Revolut. Se les redirige directamente al formulario de datos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={paymentsEnabled}
                onClick={handleToggle}
                disabled={savingPayments}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 ${
                  paymentsEnabled ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    paymentsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Newsletter notify on new trip */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Notificar al newsletter al crear un viaje</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Cuando está activado, al publicar un nuevo viaje se envía un email a todos los suscriptores del newsletter.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={newsletterNotifyOnNewTrip}
                onClick={handleNewsletterToggle}
                disabled={savingNewsletter}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 ${
                  newsletterNotifyOnNewTrip ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    newsletterNotifyOnNewTrip ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
