'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { Header } from '@/components/header';
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
} from 'lucide-react';

interface BookingTrip {
  id: string;
  title: string;
  cover_image: string | null;
  departure_date: string | null;
  duration: string | null;
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

function BookingsList() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings/my-bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // silently fail
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
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Sin reservas
          </h2>
          <p className="text-gray-600 mb-6">
            No encontramos reservas asociadas a este email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar viajes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isExpanded = expandedBooking === booking.id;
            const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
            const remaining = Number(booking.total_price) - booking.total_paid;
            const canComplete = !booking.details_completed &&
              booking.completion_token &&
              booking.token_expires_at &&
              new Date(booking.token_expires_at) > new Date();

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Main card */}
                <div
                  className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                >
                  <div className="flex gap-4">
                    {booking.trips?.cover_image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                        <img
                          src={booking.trips.cover_image}
                          alt={booking.trips?.title || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {booking.trips?.title || booking.trip_id}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(booking.travel_date)}
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
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
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
                            <dt className="text-gray-500">Fecha de viaje</dt>
                            <dd className="text-gray-900">{formatDate(booking.travel_date)}</dd>
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
                              {booking.adults + booking.children} ({booking.adults}A
                              {booking.children > 0 ? ` + ${booking.children}N` : ''})
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Datos completados</dt>
                            <dd className="text-gray-900">
                              {booking.details_completed ? 'Sí' : 'No'}
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
                                <div
                                  key={payment.id}
                                  className="flex items-center justify-between text-xs bg-white rounded border border-gray-100 px-3 py-2"
                                >
                                  <div className="text-gray-600">
                                    {formatDate(payment.payment_date)} - {payment.payment_method}
                                  </div>
                                  <div className="font-medium text-gray-900">
                                    {formatCurrency(payment.amount, payment.currency)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      {canComplete && (
                        <Link
                          href={`/reserva/completar?token=${booking.completion_token}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Completar datos
                        </Link>
                      )}
                      {booking.trips && (
                        <Link
                          href={`/viaje/${booking.trips.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
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
    </div>
  );
}

export default function MisReservasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/icono.png"
            alt="Headway Trips"
            width={48}
            height={48}
            className="mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
        </div>

        {/* Not signed in - show Clerk SignIn */}
        <SignedOut>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <Plane className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-gray-600 text-sm">
                Ingresa con el email con el que realizaste tus reservas
              </p>
            </div>
            <div className="flex justify-center">
              <SignIn
                routing="hash"
                afterSignInUrl="/mis-reservas"
              />
            </div>
          </div>
        </SignedOut>

        {/* Signed in - show bookings */}
        <SignedIn>
          <BookingsList />
        </SignedIn>
      </div>
    </div>
  );
}
