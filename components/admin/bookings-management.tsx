'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, MoreHorizontal, ChevronLeft, ChevronRight, Mail, Phone, Calendar,
  Users, Filter, CheckCircle, Clock, XCircle, Plus, DollarSign, Trash2,
  CalendarCheck, Plane, CreditCard, StickyNote, ExternalLink, Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';

interface Booking {
  id: string;
  trip_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  travel_date: string;
  adults: number;
  children: number;
  total_price: number;
  currency: string;
  status: string;
  payment_status: string;
  special_requests: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string | null;
  client_id?: string | null;
  trips?: {
    title: string;
    image: string | null;
  };
  total_paid?: number;
  clients?: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  reference: string | null;
  notes: string | null;
  payment_date: string;
  created_at: string;
}

interface Trip {
  id: string;
  title: string;
  price: number;
  image_url: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  paid: { label: 'Pagada', color: 'bg-green-100 text-green-800', icon: DollarSign },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800', icon: CalendarCheck },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  partial: { label: 'Parcial', color: 'bg-orange-100 text-orange-800' },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
  refunded: { label: 'Reembolsado', color: 'bg-red-100 text-red-800' },
};

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const limit = 15;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();

      if (res.ok) {
        setBookings(data.bookings);
        setTotal(data.total);
      }
    } catch {
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/trips?limit=100');
      const data = await res.json();
      if (res.ok) {
        setTrips(data.trips || []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success('Estado actualizado');
        fetchBookings();
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      }
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: paymentStatus }),
      });

      if (res.ok) {
        toast.success('Estado de pago actualizado');
        fetchBookings();
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, payment_status: paymentStatus });
        }
      }
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Reserva eliminada');
        setShowDelete(null);
        fetchBookings();
      }
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservas</h1>
          <p className="text-sm text-slate-500">{total} reserva{total !== 1 ? 's' : ''} en total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva reserva
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Viaje</TableHead>
              <TableHead>Fecha viaje</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Pagado</TableHead>
              <TableHead className="text-right">Restante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No hay reservas</p>
                  <p className="text-sm">Las reservas aparecerán aquí cuando se creen</p>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const paymentConf = PAYMENT_STATUS_CONFIG[booking.payment_status] || PAYMENT_STATUS_CONFIG.pending;
                return (
                  <TableRow
                    key={booking.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => { setSelectedBooking(booking); setShowDetail(true); }}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{booking.customer_name}</p>
                        <p className="text-xs text-slate-500">{booking.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700 max-w-[200px] truncate">
                        {booking.trips?.title || booking.trip_id}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {format(new Date(booking.travel_date), 'dd MMM yyyy', { locale: es })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ${booking.total_price?.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-green-700">
                        ${(booking.total_paid || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const remaining = Math.max(0, (booking.total_price || 0) - (booking.total_paid || 0));
                        return (
                          <span className={`text-sm font-medium ${remaining > 0 ? 'text-orange-600' : 'text-green-700'}`}>
                            ${remaining.toLocaleString()}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusConf.color} border-0 text-xs`}>
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'confirmed'); }}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updatePaymentStatus(booking.id, 'paid'); }}>
                            <DollarSign className="w-4 h-4 mr-2" /> Marcar como pagada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'cancelled'); }}>
                            <XCircle className="w-4 h-4 mr-2" /> Cancelar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => { e.stopPropagation(); setShowDelete(booking.id); }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando {(page - 1) * limit + 1}-{Math.min(page * limit, total)} de {total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onStatusChange={(status) => selectedBooking && updateBookingStatus(selectedBooking.id, status)}
        onPaymentChange={(status) => {
          if (status === '__refresh__') {
            fetchBookings();
          } else if (selectedBooking) {
            updatePaymentStatus(selectedBooking.id, status);
          }
        }}
      />

      {/* Modal crear reserva */}
      <CreateBookingDialog
        open={showCreate}
        trips={trips}
        onClose={(created) => {
          setShowCreate(false);
          if (created) fetchBookings();
        }}
      />

      {/* Confirmar eliminación */}
      <AlertDialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reserva será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => showDelete && deleteBooking(showDelete)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Sub-componentes ---

const PAYMENT_METHODS: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  wise: 'Wise',
  otro: 'Otro',
};

function BookingDetailDialog({
  booking,
  open,
  onClose,
  onStatusChange,
  onPaymentChange,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onPaymentChange: (status: string) => void;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'transferencia',
    payment_date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  const fetchPayments = useCallback(async () => {
    if (!booking) return;
    setLoadingPayments(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/payments`);
      const data = await res.json();
      if (res.ok) setPayments(data.payments || []);
    } catch {
      // silently fail
    } finally {
      setLoadingPayments(false);
    }
  }, [booking]);

  useEffect(() => {
    if (open && booking) {
      fetchPayments();
    } else {
      setPayments([]);
      setShowPaymentForm(false);
      resetPaymentForm();
    }
  }, [open, booking, fetchPayments]);

  const resetPaymentForm = () => {
    setPaymentForm({
      amount: '',
      payment_method: 'transferencia',
      payment_date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: '',
    });
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentForm.amount);
    if (!amount || amount <= 0) {
      toast.error('Ingresá un monto válido');
      return;
    }

    setSavingPayment(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking!.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          payment_method: paymentForm.payment_method,
          payment_date: paymentForm.payment_date,
          reference: paymentForm.reference || null,
          notes: paymentForm.notes || null,
        }),
      });

      if (res.ok) {
        toast.success('Pago registrado');
        resetPaymentForm();
        setShowPaymentForm(false);
        await fetchPayments();
        // Refrescar el booking para actualizar payment_status
        onPaymentChange('__refresh__');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al registrar pago');
      }
    } catch {
      toast.error('Error al registrar pago');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    setDeletingPaymentId(paymentId);
    try {
      const res = await fetch(`/api/admin/bookings/${booking!.id}/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Pago eliminado');
        await fetchPayments();
        onPaymentChange('__refresh__');
      } else {
        toast.error('Error al eliminar pago');
      }
    } catch {
      toast.error('Error al eliminar pago');
    } finally {
      setDeletingPaymentId(null);
    }
  };

  if (!booking) return null;

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = Math.max(0, (booking.total_price || 0) - totalPaid);
  const progressPercent = booking.total_price > 0 ? Math.min(100, (totalPaid / booking.total_price) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de reserva</DialogTitle>
          <DialogDescription>
            Creada el {format(new Date(booking.created_at), "dd 'de' MMMM yyyy", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Viaje */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Plane className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-slate-900">{booking.trips?.title || booking.trip_id}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(booking.travel_date), 'dd MMM yyyy', { locale: es })}
              </p>
            </div>
          </div>

          {/* Cliente (solo lectura) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Cliente</p>
              {booking.client_id && (
                <Link
                  href="/admin/clientes"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                  onClick={onClose}
                >
                  Ver ficha <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-900">{booking.customer_name}</p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {booking.customer_email}
              </p>
              {booking.customer_phone && (
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {booking.customer_phone}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Pasajeros</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {booking.adults} adultos{booking.children > 0 ? `, ${booking.children} niños` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Total</p>
              <p className="text-sm font-bold text-slate-900">
                ${booking.total_price?.toLocaleString()} {booking.currency}
              </p>
            </div>
          </div>

          <Separator />

          {/* Estado de reserva */}
          <div className="space-y-2">
            <Label className="text-xs">Estado de reserva</Label>
            <Select value={booking.status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Sección de Pagos */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Pagos
            </p>

            {/* Resumen */}
            <div className="p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pagado</span>
                <span className="font-semibold text-green-700">${totalPaid.toLocaleString()} {booking.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Restante</span>
                <span className={`font-semibold ${remaining > 0 ? 'text-orange-600' : 'text-green-700'}`}>
                  ${remaining.toLocaleString()} {booking.currency}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${progressPercent >= 100 ? 'bg-green-500' : progressPercent > 0 ? 'bg-orange-400' : 'bg-slate-200'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-right">{Math.round(progressPercent)}% pagado</p>
            </div>

            {/* Historial de pagos */}
            {loadingPayments ? (
              <div className="flex items-center justify-center py-4 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cargando pagos...
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 bg-white border rounded-lg text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">${Number(payment.amount).toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs border-0 bg-slate-100">
                          {PAYMENT_METHODS[payment.payment_method] || payment.payment_method}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{format(new Date(payment.payment_date + 'T12:00:00'), 'dd MMM yyyy', { locale: es })}</span>
                        {payment.reference && <span>· Ref: {payment.reference}</span>}
                      </div>
                      {payment.notes && <p className="text-xs text-slate-400 mt-0.5 truncate">{payment.notes}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-red-600 shrink-0"
                      onClick={() => handleDeletePayment(payment.id)}
                      disabled={deletingPaymentId === payment.id}
                    >
                      {deletingPaymentId === payment.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Formulario de nuevo pago */}
            {showPaymentForm ? (
              <div className="space-y-3 p-3 bg-slate-50 rounded-lg border">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Monto *</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Método</Label>
                    <Select value={paymentForm.payment_method} onValueChange={(v) => setPaymentForm({ ...paymentForm, payment_method: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Fecha</Label>
                    <Input
                      type="date"
                      value={paymentForm.payment_date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Referencia</Label>
                    <Input
                      placeholder="Nro. transferencia..."
                      value={paymentForm.reference}
                      onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notas</Label>
                  <Input
                    placeholder="Nota opcional..."
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setShowPaymentForm(false); resetPaymentForm(); }}
                    disabled={savingPayment}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleAddPayment}
                    disabled={savingPayment}
                  >
                    {savingPayment ? 'Guardando...' : 'Registrar pago'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1"
                onClick={() => setShowPaymentForm(true)}
              >
                <Plus className="w-3.5 h-3.5" /> Registrar pago
              </Button>
            )}
          </div>

          {/* Notas */}
          {booking.special_requests && (
            <div>
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <StickyNote className="w-3 h-3" /> Solicitudes especiales
              </p>
              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{booking.special_requests}</p>
            </div>
          )}
          {booking.internal_notes && (
            <div>
              <p className="text-xs text-slate-400 mb-1">Notas internas</p>
              <p className="text-sm text-slate-600 bg-yellow-50 p-2 rounded">{booking.internal_notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ClientOption {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

function CreateBookingDialog({
  open,
  trips,
  onClose,
}: {
  open: boolean;
  trips: Trip[];
  onClose: (created: boolean) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState<ClientOption[]>([]);
  const [searchingClients, setSearchingClients] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ full_name: '', email: '', phone: '' });
  const [creatingClient, setCreatingClient] = useState(false);

  const debouncedClientSearch = useDebounce(clientSearch, 300);

  const [form, setForm] = useState({
    trip_id: '',
    client_id: '',
    travel_date: '',
    adults: 1,
    children: 0,
    total_price: 0,
    currency: 'USD',
    special_requests: '',
    internal_notes: '',
  });

  const selectedTrip = trips.find((t) => t.id === form.trip_id);

  const updateForm = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Buscar clientes
  useEffect(() => {
    if (!debouncedClientSearch || debouncedClientSearch.length < 2) {
      setClientResults([]);
      return;
    }

    const searchClients = async () => {
      setSearchingClients(true);
      try {
        const res = await fetch(`/api/admin/clients?search=${encodeURIComponent(debouncedClientSearch)}&limit=10`);
        const data = await res.json();
        if (res.ok) {
          setClientResults(data.clients || []);
          setShowClientDropdown(true);
        }
      } catch {
        // silently fail
      } finally {
        setSearchingClients(false);
      }
    };

    searchClients();
  }, [debouncedClientSearch]);

  // Auto-calcular precio al cambiar viaje o pasajeros
  useEffect(() => {
    if (selectedTrip) {
      const total = selectedTrip.price * (form.adults + form.children);
      setForm((prev) => ({ ...prev, total_price: total }));
    }
  }, [form.trip_id, form.adults, form.children, selectedTrip]);

  const selectClient = (client: ClientOption) => {
    setSelectedClient(client);
    setForm((prev) => ({ ...prev, client_id: client.id }));
    setClientSearch('');
    setShowClientDropdown(false);
  };

  const clearClient = () => {
    setSelectedClient(null);
    setForm((prev) => ({ ...prev, client_id: '' }));
  };

  const handleCreateClient = async () => {
    if (!newClientForm.full_name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setCreatingClient(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClientForm),
      });

      if (res.ok) {
        const client = await res.json();
        selectClient(client);
        setShowNewClient(false);
        setNewClientForm({ full_name: '', email: '', phone: '' });
        toast.success('Cliente creado');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al crear cliente');
      }
    } catch {
      toast.error('Error al crear cliente');
    } finally {
      setCreatingClient(false);
    }
  };

  const resetAll = () => {
    setForm({
      trip_id: '', client_id: '', travel_date: '', adults: 1,
      children: 0, total_price: 0, currency: 'USD',
      special_requests: '', internal_notes: '',
    });
    setSelectedClient(null);
    setClientSearch('');
    setShowNewClient(false);
    setNewClientForm({ full_name: '', email: '', phone: '' });
  };

  const handleSubmit = async () => {
    if (!form.trip_id || !form.client_id || !form.travel_date) {
      toast.error('Seleccioná un cliente, viaje y fecha');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          customer_name: selectedClient?.full_name || '',
          customer_email: selectedClient?.email || '',
          customer_phone: selectedClient?.phone || '',
        }),
      });

      if (res.ok) {
        toast.success('Reserva creada exitosamente');
        resetAll();
        onClose(true);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al crear reserva');
      }
    } catch {
      toast.error('Error al crear reserva');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { resetAll(); onClose(false); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
          <DialogDescription>Seleccioná un cliente y un viaje para crear la reserva</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            {selectedClient ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div>
                  <p className="text-sm font-medium text-slate-900">{selectedClient.full_name}</p>
                  <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                    {selectedClient.email && (
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedClient.email}</span>
                    )}
                    {selectedClient.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedClient.phone}</span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearClient} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            ) : showNewClient ? (
              <div className="space-y-3 p-3 bg-slate-50 rounded-lg border">
                <p className="text-xs font-medium text-slate-500">Nuevo cliente</p>
                <Input
                  value={newClientForm.full_name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, full_name: e.target.value })}
                  placeholder="Nombre completo *"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    placeholder="Email"
                  />
                  <Input
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    placeholder="Teléfono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowNewClient(false)} disabled={creatingClient}>
                    Cancelar
                  </Button>
                  <Button size="sm" className="flex-1" onClick={handleCreateClient} disabled={creatingClient}>
                    {creatingClient ? 'Creando...' : 'Crear cliente'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar cliente por nombre o email..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  onFocus={() => clientResults.length > 0 && setShowClientDropdown(true)}
                  onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                  className="pl-10"
                />
                {searchingClients && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                  </div>
                )}

                {/* Dropdown de resultados */}
                {showClientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {clientResults.length > 0 ? (
                      clientResults.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b last:border-b-0"
                          onMouseDown={() => selectClient(client)}
                        >
                          <p className="text-sm font-medium text-slate-900">{client.full_name}</p>
                          <p className="text-xs text-slate-500">{client.email || 'Sin email'}</p>
                        </button>
                      ))
                    ) : debouncedClientSearch.length >= 2 ? (
                      <p className="px-3 py-2 text-sm text-slate-400">Sin resultados</p>
                    ) : null}
                  </div>
                )}

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs"
                  onClick={() => { setShowNewClient(true); setClientSearch(''); setShowClientDropdown(false); }}
                >
                  <Plus className="w-3 h-3 mr-1" /> Crear nuevo cliente
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Viaje */}
          <div className="space-y-2">
            <Label>Viaje *</Label>
            <Select value={form.trip_id} onValueChange={(v) => updateForm('trip_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar viaje" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.title} — ${trip.price?.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Detalles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Fecha de viaje *</Label>
              <Input
                type="date"
                value={form.travel_date}
                onChange={(e) => updateForm('travel_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Adultos</Label>
              <Input
                type="number"
                min={1}
                value={form.adults}
                onChange={(e) => updateForm('adults', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label>Niños</Label>
              <Input
                type="number"
                min={0}
                value={form.children}
                onChange={(e) => updateForm('children', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Precio total</Label>
              <Input
                type="number"
                min={0}
                value={form.total_price || ''}
                onChange={(e) => updateForm('total_price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select value={form.currency} onValueChange={(v) => updateForm('currency', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label>Solicitudes especiales</Label>
            <Textarea
              value={form.special_requests}
              onChange={(e) => updateForm('special_requests', e.target.value)}
              placeholder="Dieta vegetariana, necesita silla de ruedas..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Notas internas</Label>
            <Textarea
              value={form.internal_notes}
              onChange={(e) => updateForm('internal_notes', e.target.value)}
              placeholder="Notas para el equipo..."
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => { resetAll(); onClose(false); }} disabled={saving}>
            Cancelar
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creando...' : 'Crear reserva'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
