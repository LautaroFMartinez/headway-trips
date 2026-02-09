'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useSignIn,
  useSignUp,
} from '@clerk/nextjs';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Mail,
  Plane,
  Calendar,
  Users,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
  X,
} from 'lucide-react';

interface BookingTrip {
  id: string;
  title: string;
  image: string | null;
  departure_date: string | null;
  duration: string | null;
  duration_days: number | null;
}

interface BookingPayment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_date: string;
  revolut_status: string | null;
}

interface Booking {
  id: string;
  trip_id: string;
  customer_name: string;
  customer_email: string;
  adults: number;
  children: number;
  total_price: number;
  currency: string;
  status: string;
  payment_status: string;
  travel_date: string;
  details_completed: boolean;
  completion_token: string | null;
  token_expires_at: string | null;
  created_at: string;
  trips: BookingTrip | null;
  booking_payments: BookingPayment[];
  total_paid: number;
  payments_count: number;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pendiente', class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmada', class: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pagada', class: 'bg-green-100 text-green-800' },
  completed: { label: 'Completada', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsada', class: 'bg-gray-100 text-gray-800' },
};

type LoginStep = 'email' | 'code' | 'loading';

function LoginFlow() {
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  if (!signInLoaded || !signUpLoaded) return null;

  const handleEmailSubmit = async () => {
    setError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    try {
      // First ensure the user exists in Clerk (creates if not)
      const ensureRes = await fetch('/api/auth/ensure-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const ensureData = await ensureRes.json();
      if (!ensureRes.ok) {
        setError(ensureData.error || 'Error al verificar email');
        setIsSubmitting(false);
        return;
      }

      // Try sign-in first (existing Clerk user)
      try {
        const result = await signIn.create({ identifier: email.trim() });

        // Find email_code factor
        const emailFactor = result.supportedFirstFactors?.find(
          (f) => f.strategy === 'email_code'
        );

        if (emailFactor && 'emailAddressId' in emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          setIsNewUser(false);
          setStep('code');
        } else {
          setError('No se pudo enviar el código de verificación');
        }
      } catch (signInErr: unknown) {
        // If sign-in fails (user just created), try sign-up flow
        const clerkErr = signInErr as { errors?: Array<{ code?: string }> };
        if (clerkErr?.errors?.[0]?.code === 'form_identifier_not_found') {
          try {
            await signUp.create({ emailAddress: email.trim() });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setIsNewUser(true);
            setStep('code');
          } catch (signUpErr: unknown) {
            const sErr = signUpErr as { errors?: Array<{ message?: string }> };
            setError(sErr?.errors?.[0]?.message || 'Error al crear cuenta');
          }
        } else {
          const sErr = clerkErr as { errors?: Array<{ message?: string }> };
          setError(sErr?.errors?.[0]?.message || 'Error al iniciar sesión');
        }
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async () => {
    setError('');
    if (!code.trim() || code.length < 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewUser) {
        // Complete sign-up verification
        const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (result.status === 'complete' && result.createdSessionId) {
          await setSignUpActive({ session: result.createdSessionId });
        } else {
          setError('Error al verificar. Intenta de nuevo.');
        }
      } else {
        // Complete sign-in verification
        const result = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: code.trim(),
        });
        if (result.status === 'complete' && result.createdSessionId) {
          await setSignInActive({ session: result.createdSessionId });
        } else {
          setError('Error al verificar. Intenta de nuevo.');
        }
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(clerkErr?.errors?.[0]?.longMessage || clerkErr?.errors?.[0]?.message || 'Código inválido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/mis-reservas',
      redirectUrlComplete: '/mis-reservas',
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {step === 'email' && (
          <>
            <div className="text-center mb-6">
              <Plane className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Accede a tus reservas
              </h2>
              <p className="text-gray-600 text-sm">
                Ingresa el email con el que realizaste tus reservas
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />
              </div>
              <Button
                onClick={handleEmailSubmit}
                disabled={isSubmitting}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Enviar código de acceso
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">o</span>
              </div>
            </div>

            {/* Google */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full gap-2"
              size="lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </Button>
          </>
        )}

        {step === 'code' && (
          <>
            <div className="text-center mb-6">
              <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Ingresa el código
              </h2>
              <p className="text-gray-600 text-sm">
                Enviamos un código de verificación a:
              </p>
              <p className="font-medium text-gray-900 mt-1">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="verify-code">Código de verificación</Label>
                <Input
                  id="verify-code"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                  autoFocus
                />
              </div>
              <Button
                onClick={handleCodeSubmit}
                disabled={isSubmitting}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
              <button
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                }}
                className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Usar otro email
              </button>
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function PaymentModal({
  booking,
  remaining,
  formatCurrency,
  onClose,
}: {
  booking: Booking;
  remaining: number;
  formatCurrency: (amount: number, currency?: string) => string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(remaining.toFixed(2));
  const [mode, setMode] = useState<'full' | 'half' | 'custom'>('full');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleModeChange = (newMode: 'full' | 'half' | 'custom') => {
    setMode(newMode);
    setError('');
    if (newMode === 'full') setAmount(remaining.toFixed(2));
    else if (newMode === 'half') setAmount((remaining / 2).toFixed(2));
  };

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }
    if (numAmount > remaining) {
      setError('El monto no puede superar el saldo restante');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al generar link de pago');
        return;
      }
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <CreditCard className="w-10 h-10 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Realizar pago</h3>
          <p className="text-sm text-gray-500 mt-1">
            {booking.trips?.title || booking.trip_id}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Saldo restante</span>
            <span className="font-semibold text-amber-600">
              {formatCurrency(remaining, booking.currency)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleModeChange('full')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'full'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagar todo
          </button>
          <button
            onClick={() => handleModeChange('half')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'half'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            50%
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'custom'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Personalizado
          </button>
        </div>

        <div className="mb-5">
          <Label htmlFor="pay-amount">Monto ({booking.currency})</Label>
          <Input
            id="pay-amount"
            type="number"
            min="0.01"
            max={remaining}
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setMode('custom');
              setError('');
            }}
            className="mt-1.5 text-lg"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generando link...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Generar link de pago
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function BookingsList() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress
    || user?.emailAddresses?.[0]?.emailAddress || '';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [payingBooking, setPayingBooking] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setFetchError('');
    try {
      const res = await fetch('/api/bookings/my-bookings');
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        console.error('my-bookings error:', data);
        setFetchError(data.error || 'Error al cargar reservas');
      }
    } catch (err) {
      console.error('fetch error:', err);
      setFetchError('Error de conexión al cargar reservas');
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTravelDateRange = (booking: Booking) => {
    const startStr = booking.travel_date;
    const days = booking.trips?.duration_days;
    if (!startStr) return '';
    const start = formatDate(startStr);
    if (!days || days <= 1) return start;
    const endD = new Date(startStr + (startStr.includes('T') ? '' : 'T12:00:00'));
    endD.setDate(endD.getDate() + days - 1);
    const end = endD.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${start} → ${end}`;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${currency} $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div>
      {/* User bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{userEmail}</span>
        </div>
        <UserButton afterSignOutUrl="/mis-reservas" />
      </div>

      {loadingBookings ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-gray-600">Cargando reservas...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <Button onClick={fetchBookings} variant="outline">Reintentar</Button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sin reservas</h2>
          <p className="text-gray-600 mb-6">No encontramos reservas asociadas a este email.</p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Explorar viajes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isExpanded = expandedBooking === booking.id;
            const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
            const remaining = Number(booking.total_price) - booking.total_paid;
            const canComplete = !booking.details_completed && booking.completion_token;

            return (
              <div key={booking.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                >
                  <div className="flex gap-4">
                    {booking.trips?.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                        <img src={booking.trips.image} alt={booking.trips?.title || ''} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{booking.trips?.title || booking.trip_id}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatTravelDateRange(booking)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {booking.adults} adulto{booking.adults > 1 ? 's' : ''}
                          {booking.children > 0 && `, ${booking.children} niño${booking.children > 1 ? 's' : ''}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          {formatCurrency(booking.total_paid)} / {formatCurrency(booking.total_price, booking.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 self-center">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50/30">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Detalles</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Reserva</dt>
                            <dd className="text-gray-900 font-mono text-xs">{booking.id.slice(0, 8)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Fecha del viaje</dt>
                            <dd className="text-gray-900 capitalize">{formatTravelDateRange(booking)}</dd>
                          </div>
                          {booking.trips?.duration && (
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Duración</dt>
                              <dd className="text-gray-900">{booking.trips.duration}</dd>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Pasajeros</dt>
                            <dd className="text-gray-900">
                              {booking.adults + booking.children} ({booking.adults}A{booking.children > 0 ? ` + ${booking.children}N` : ''})
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Datos completados</dt>
                            <dd className={booking.details_completed ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                              {booking.details_completed ? 'Sí' : 'Pendiente'}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Reserva creada</dt>
                            <dd className="text-gray-900">{formatDate(booking.created_at)}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Pagos</h4>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Total</span>
                              <span className="font-semibold">{formatCurrency(booking.total_price, booking.currency)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Pagado</span>
                              <span className="font-medium text-green-600">{formatCurrency(booking.total_paid)}</span>
                            </div>
                            {remaining > 0 && (
                              <div className="flex justify-between text-sm border-t border-gray-100 pt-1 mt-1">
                                <span className="text-gray-500">Restante</span>
                                <span className="font-medium text-amber-600">{formatCurrency(remaining)}</span>
                              </div>
                            )}
                          </div>
                          {Array.isArray(booking.booking_payments) && booking.booking_payments.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 font-medium">Historial</p>
                              {booking.booking_payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between text-xs bg-white rounded border border-gray-100 px-3 py-2">
                                  <div className="text-gray-600">{formatDate(payment.payment_date)} - {payment.payment_method}</div>
                                  <div className="font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      {remaining > 0 && booking.status !== 'cancelled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPayingBooking(booking.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Realizar pago
                        </button>
                      )}
                      {canComplete && (
                        <Link href={`/reserva/completar?token=${booking.completion_token}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Completar datos
                        </Link>
                      )}
                      {booking.trips && (
                        <Link href={`/viaje/${booking.trips.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          <Plane className="w-3.5 h-3.5" />
                          Ver viaje
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {payingBooking && (() => {
        const booking = bookings.find((b) => b.id === payingBooking);
        if (!booking) return null;
        const rem = Number(booking.total_price) - booking.total_paid;
        return (
          <PaymentModal
            booking={booking}
            remaining={rem}
            formatCurrency={formatCurrency}
            onClose={() => setPayingBooking(null)}
          />
        );
      })()}
    </div>
  );
}

export default function MisReservasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Image src="/icono.png" alt="Headway Trips" width={48} height={48} className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
        </div>

        <SignedOut>
          <LoginFlow />
        </SignedOut>

        <SignedIn>
          <BookingsList />
        </SignedIn>
      </div>
    </div>
  );
}
