'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search, MoreHorizontal, ChevronLeft, ChevronRight, Mail, Phone,
  Plus, Trash2, Users, Eye, Pencil, Calendar, Globe, FileText,
  Shield, StickyNote,
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

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  birth_date: string | null;
  passport_number: string | null;
  passport_issuing_country: string | null;
  passport_expiry_date: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  booking_count?: number;
}

interface ClientBooking {
  id: string;
  trip_id: string;
  travel_date: string;
  status: string;
  payment_status: string;
  total_price: number;
  currency: string;
  created_at: string;
  trips?: {
    title: string;
    image: string | null;
  };
}

interface ClientWithBookings extends Client {
  bookings: ClientBooking[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pagada', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
};

const RELATIONSHIP_TYPES = ['Padre/Madre', 'Hermano/a', 'Pareja', 'Hijo/a', 'Amigo/a', 'Otro'];

export function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const limit = 20;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const res = await fetch(`/api/admin/clients?${params}`);
      const data = await res.json();

      if (res.ok) {
        setClients(data.clients);
        setTotal(data.total);
      }
    } catch {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const deleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Cliente eliminado');
        setShowDelete(null);
        fetchClients();
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
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500">{total} cliente{total !== 1 ? 's' : ''} en total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, email o documento..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Pasaporte</TableHead>
              <TableHead>Nacionalidad</TableHead>
              <TableHead>Reservas</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No hay clientes</p>
                  <p className="text-sm">Los clientes aparecerán aquí cuando se creen</p>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => { setSelectedClientId(client.id); setShowDetail(true); }}
                >
                  <TableCell>
                    <p className="font-medium text-slate-900 text-sm">{client.full_name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600">{client.email || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600">{client.phone || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600">{client.passport_number || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600">{client.nationality || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {client.booking_count || 0}
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
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedClientId(client.id); setShowDetail(true); }}>
                          <Eye className="w-4 h-4 mr-2" /> Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => { e.stopPropagation(); setShowDelete(client.id); }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Modal detalle/edición */}
      <ClientDetailDialog
        clientId={selectedClientId}
        open={showDetail}
        onClose={() => { setShowDetail(false); setSelectedClientId(null); }}
        onUpdated={fetchClients}
      />

      {/* Modal crear cliente */}
      <CreateClientDialog
        open={showCreate}
        onClose={(created) => {
          setShowCreate(false);
          if (created) fetchClients();
        }}
      />

      {/* Confirmar eliminación */}
      <AlertDialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
              Las reservas asociadas no se eliminarán, pero perderán la referencia al cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => showDelete && deleteClient(showDelete)}
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

function ClientDetailDialog({
  clientId,
  open,
  onClose,
  onUpdated,
}: {
  clientId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [client, setClient] = useState<ClientWithBookings | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clientId && open) {
      setLoading(true);
      setEditing(false);
      fetch(`/api/admin/clients/${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          setClient(data);
          setForm({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            nationality: data.nationality || '',
            birth_date: data.birth_date || '',
            passport_number: data.passport_number || '',
            passport_issuing_country: data.passport_issuing_country || '',
            passport_expiry_date: data.passport_expiry_date || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
            emergency_contact_relationship: data.emergency_contact_relationship || '',
            notes: data.notes || '',
          });
        })
        .catch(() => toast.error('Error al cargar cliente'))
        .finally(() => setLoading(false));
    }
  }, [clientId, open]);

  const handleSave = async () => {
    if (!clientId || !form.full_name) {
      toast.error('El nombre completo es requerido');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setClient((prev) => prev ? { ...prev, ...updated } : prev);
        setEditing(false);
        onUpdated();
        toast.success('Cliente actualizado');
      } else {
        toast.error('Error al guardar');
      }
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!clientId) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {client?.full_name || 'Cliente'}
            {!editing && client && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {client ? `Cliente desde ${format(new Date(client.created_at), "dd 'de' MMMM yyyy", { locale: es })}` : 'Cargando...'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : client ? (
          <div className="space-y-5">
            {/* Información Personal */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Información Personal</p>
              {editing ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-2">
                    <Label>Nombre completo *</Label>
                    <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Número de pasaporte</Label>
                    <Input value={form.passport_number} onChange={(e) => setForm({ ...form, passport_number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>País de emisión</Label>
                    <Input value={form.passport_issuing_country} onChange={(e) => setForm({ ...form, passport_issuing_country: e.target.value })} placeholder="Argentina" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vencimiento pasaporte</Label>
                    <Input type="date" value={form.passport_expiry_date} onChange={(e) => setForm({ ...form, passport_expiry_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de nacimiento</Label>
                    <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidad</Label>
                    <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contacto de emergencia</Label>
                    <Input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} placeholder="Nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tel. emergencia</Label>
                    <Input value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} placeholder="Teléfono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Relación</Label>
                    <Select value={form.emergency_contact_relationship} onValueChange={(v) => setForm({ ...form, emergency_contact_relationship: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Notas internas</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
                  </div>
                  <div className="col-span-2 flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1" onClick={() => setEditing(false)} disabled={saving}>
                      Cancelar
                    </Button>
                    <Button className="flex-1" onClick={handleSave} disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoField icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={client.email} />
                    <InfoField icon={<Phone className="w-3.5 h-3.5" />} label="Teléfono" value={client.phone} />
                    <InfoField icon={<FileText className="w-3.5 h-3.5" />} label="Pasaporte" value={client.passport_number} />
                    <InfoField icon={<Globe className="w-3.5 h-3.5" />} label="País emisión" value={client.passport_issuing_country} />
                    <InfoField icon={<Calendar className="w-3.5 h-3.5" />} label="Vencimiento pasaporte" value={
                      client.passport_expiry_date ? format(new Date(client.passport_expiry_date + 'T12:00:00'), 'dd/MM/yyyy') : null
                    } />
                    <InfoField icon={<Calendar className="w-3.5 h-3.5" />} label="Fecha de nacimiento" value={
                      client.birth_date ? format(new Date(client.birth_date), 'dd/MM/yyyy') : null
                    } />
                    <InfoField icon={<Globe className="w-3.5 h-3.5" />} label="Nacionalidad" value={client.nationality} />
                    <InfoField icon={<Shield className="w-3.5 h-3.5" />} label="Contacto emergencia" value={
                      client.emergency_contact_name
                        ? `${client.emergency_contact_name}${client.emergency_contact_relationship ? ` (${client.emergency_contact_relationship})` : ''}${client.emergency_contact_phone ? ` — ${client.emergency_contact_phone}` : ''}`
                        : null
                    } />
                  </div>
                  {client.notes && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <StickyNote className="w-3 h-3" /> Notas internas
                      </p>
                      <p className="text-sm text-slate-600 bg-yellow-50 p-2 rounded">{client.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Historial de Reservas */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">
                Historial de Reservas ({client.bookings?.length || 0})
              </p>
              {client.bookings && client.bookings.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Viaje</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.bookings.map((booking) => {
                        const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="text-sm font-medium">
                              {booking.trips?.title || booking.trip_id}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {format(new Date(booking.travel_date), 'dd MMM yyyy', { locale: es })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${statusConf.color} border-0 text-xs`}>
                                {statusConf.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-semibold">
                              ${booking.total_price?.toLocaleString()} {booking.currency}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-4 text-center">Sin reservas asociadas</p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 flex items-center gap-1.5">
        {icon} {value || '—'}
      </p>
    </div>
  );
}

function CreateClientDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (created: boolean) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    birth_date: '',
    passport_number: '',
    passport_issuing_country: '',
    passport_expiry_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    notes: '',
  });

  const resetForm = () => {
    setForm({
      full_name: '', email: '', phone: '', nationality: '', birth_date: '',
      passport_number: '', passport_issuing_country: '', passport_expiry_date: '',
      emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '',
      notes: '',
    });
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim()) {
      toast.error('El nombre completo es requerido');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Cliente creado exitosamente');
        resetForm();
        onClose(true);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al crear cliente');
      }
    } catch {
      toast.error('Error al crear cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { resetForm(); onClose(false); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>Registrar un nuevo cliente con sus datos personales</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-2">
              <Label>Nombre completo *</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="juan@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+54..."
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Número de pasaporte</Label>
              <Input
                value={form.passport_number}
                onChange={(e) => setForm({ ...form, passport_number: e.target.value })}
                placeholder="AAB123456"
              />
            </div>
            <div className="space-y-2">
              <Label>País de emisión</Label>
              <Input
                value={form.passport_issuing_country}
                onChange={(e) => setForm({ ...form, passport_issuing_country: e.target.value })}
                placeholder="Argentina"
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimiento pasaporte</Label>
              <Input
                type="date"
                value={form.passport_expiry_date}
                onChange={(e) => setForm({ ...form, passport_expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <Input
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                placeholder="Argentina"
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                value={form.birth_date}
                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Contacto de emergencia</Label>
              <Input
                value={form.emergency_contact_name}
                onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                placeholder="Nombre del contacto"
              />
            </div>
            <div className="space-y-2">
              <Label>Tel. emergencia</Label>
              <Input
                value={form.emergency_contact_phone}
                onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                placeholder="+54..."
              />
            </div>
            <div className="space-y-2">
              <Label>Relación</Label>
              <Select value={form.emergency_contact_relationship} onValueChange={(v) => setForm({ ...form, emergency_contact_relationship: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notas internas</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notas sobre el cliente..."
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => { resetForm(); onClose(false); }} disabled={saving}>
            Cancelar
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creando...' : 'Crear cliente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
