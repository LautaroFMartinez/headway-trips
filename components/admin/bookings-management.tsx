'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search, MoreHorizontal, ChevronLeft, ChevronRight, Mail, Phone, Calendar,
  Users, Filter, CheckCircle, Clock, XCircle, Plus, DollarSign, Trash2,
  CalendarCheck, Plane, CreditCard, StickyNote,
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
  trips?: {
    title: string;
    image: string | null;
  };
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
              <TableHead>Pasajeros</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
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
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {booking.adults} ad. {booking.children > 0 ? `+ ${booking.children} niños` : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-slate-900">
                        ${booking.total_price?.toLocaleString()} {booking.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusConf.color} border-0 text-xs`}>
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${paymentConf.color} border-0 text-xs`}>
                        {paymentConf.label}
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
        onPaymentChange={(status) => selectedBooking && updatePaymentStatus(selectedBooking.id, status)}
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
  if (!booking) return null;

  const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const paymentConf = PAYMENT_STATUS_CONFIG[booking.payment_status] || PAYMENT_STATUS_CONFIG.pending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
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

          {/* Cliente */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Cliente</p>
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

          {/* Estados */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label className="text-xs">Estado de pago</Label>
              <Select value={booking.payment_status} onValueChange={onPaymentChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          {/* Link de pago (placeholder para Wise) */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Link de pago</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              La integración con Wise estará disponible próximamente. Podrás generar links de pago directamente desde aquí.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
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
  const [form, setForm] = useState({
    trip_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
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

  // Auto-calcular precio al cambiar viaje o pasajeros
  useEffect(() => {
    if (selectedTrip) {
      const total = selectedTrip.price * (form.adults + form.children);
      setForm((prev) => ({ ...prev, total_price: total }));
    }
  }, [form.trip_id, form.adults, form.children, selectedTrip]);

  const handleSubmit = async () => {
    if (!form.trip_id || !form.customer_name || !form.customer_email || !form.travel_date) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Reserva creada exitosamente');
        setForm({
          trip_id: '',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          travel_date: '',
          adults: 1,
          children: 0,
          total_price: 0,
          currency: 'USD',
          special_requests: '',
          internal_notes: '',
        });
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
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
          <DialogDescription>Crear una reserva manualmente para un viaje</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          {/* Cliente */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-2">
              <Label>Nombre completo *</Label>
              <Input
                value={form.customer_name}
                onChange={(e) => updateForm('customer_name', e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.customer_email}
                onChange={(e) => updateForm('customer_email', e.target.value)}
                placeholder="juan@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={form.customer_phone}
                onChange={(e) => updateForm('customer_phone', e.target.value)}
                placeholder="+54 9 11..."
              />
            </div>
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
          <Button variant="outline" className="flex-1" onClick={() => onClose(false)} disabled={saving}>
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
