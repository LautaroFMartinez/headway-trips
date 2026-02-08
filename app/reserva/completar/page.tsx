'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { ClientDetailsForm } from '@/components/booking/ClientDetailsForm';
import { Header } from '@/components/header';

interface BookingData {
  booking_id: string;
  token: string;
  customer_name: string;
  customer_email: string;
  adults: number;
  children: number;
  total_price: number;
  currency: string;
  details_completed: boolean;
  is_expired: boolean;
  token_expires_at: string;
  payment_completed: boolean;
  trip: {
    title: string;
    price: string;
    price_value: number;
    departure_date: string | null;
    duration: string;
  } | null;
}

type PageState = 'loading' | 'waiting_payment' | 'form' | 'success' | 'expired' | 'completed' | 'error';

function CompletarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const orderId = searchParams.get('order_id');

  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<BookingData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!token && !orderId) {
      setState('error');
      setErrorMsg('Enlace inválido. Verifica el link recibido por email.');
      return;
    }

    const validate = async () => {
      try {
        const params = new URLSearchParams();
        if (token) params.set('token', token);
        if (orderId) params.set('order_id', orderId);

        const res = await fetch(`/api/bookings/validate-token?${params}`);
        const result = await res.json();

        if (!res.ok) {
          setState('error');
          setErrorMsg(result.error || 'Error al validar la reserva');
          return;
        }

        setData(result);

        if (result.details_completed) {
          setState('completed');
        } else if (result.is_expired) {
          setState('expired');
        } else if (result.payment_completed) {
          setState('form');
        } else {
          setState('waiting_payment');
        }
      } catch {
        setState('error');
        setErrorMsg('Error de conexión');
      }
    };

    validate();
  }, [token, orderId, pollCount]);

  // Poll for payment status when waiting
  useEffect(() => {
    if (state !== 'waiting_payment') return;

    const interval = setInterval(() => {
      setPollCount((c) => c + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [state]);

  const handleSuccess = () => {
    setState('success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/icono.png"
            alt="Headway Trips"
            width={48}
            height={48}
            className="mx-auto mb-3"
          />
          {data?.trip && (
            <h1 className="text-2xl font-bold text-gray-900">{data.trip.title}</h1>
          )}
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Verificando tu reserva...</p>
          </div>
        )}

        {/* Waiting for payment */}
        {state === 'waiting_payment' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Esperando confirmación de pago
            </h2>
            <p className="text-gray-600 mb-4">
              Estamos verificando tu pago. Esto puede tomar unos momentos.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando...
            </div>
          </div>
        )}

        {/* Form */}
        {state === 'form' && data && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Pago recibido</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Completa tus datos
              </h2>
              <p className="text-gray-600 text-sm">
                Para confirmar tu reserva, necesitamos la siguiente información.
              </p>
            </div>

            <ClientDetailsForm
              token={data.token}
              customerName={data.customer_name}
              customerEmail={data.customer_email}
              tripTitle={data.trip?.title || ''}
              adults={data.adults}
              children={data.children}
              onSuccess={handleSuccess}
            />
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Reserva confirmada!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu reserva ha sido confirmada exitosamente. Recibirás un email de confirmación con todos los detalles.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* Already completed */}
        {state === 'completed' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Reserva ya completada
            </h2>
            <p className="text-gray-600 mb-6">
              Los datos de esta reserva ya fueron completados previamente.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* Expired */}
        {state === 'expired' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Enlace expirado
            </h2>
            <p className="text-gray-600 mb-6">
              El enlace para completar tus datos ha expirado. Contacta a nuestro equipo para obtener asistencia.
            </p>
            <a
              href="https://wa.me/525527118391"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error
            </h2>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompletarReservaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <CompletarContent />
    </Suspense>
  );
}
