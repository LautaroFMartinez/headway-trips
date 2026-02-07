'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Mail, Phone, Calendar,
  MapPin, Users, Filter, CheckCircle, Clock, XCircle, MessageSquare, Globe,
  StickyNote, DollarSign, Trash2, ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';

interface Quote {
  id: string;
  trip_id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  travel_date: string;
  adults: number;
  children: number;
  travelers: number;
  message?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled';
  notes?: string;
  quoted_price?: number;
  assigned_agent?: string;
  created_at: string;
  updated_at?: string;
  trips?: {
    title: string;
    destination: string;
    price: number;
    image?: string;
  };
}

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  contacted: { label: 'Contactado', color: 'bg-blue-100 text-blue-700', icon: Phone },
  quoted: { label: 'Cotizado', color: 'bg-purple-100 text-purple-700', icon: MessageSquare },
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const ITEMS_PER_PAGE = 10;

export function QuotesManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/quotes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes);
        setTotalQuotes(data.total);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast.error('Error al cargar las cotizaciones');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    const statusLabel = STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus;
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Estado actualizado a "${statusLabel}"`);
      loadQuotes();
      // Update selected quote if open
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status: newStatus as Quote['status'] });
      }
    } catch {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNotes }),
      });
      if (!res.ok) throw new Error();
      toast.success('Notas guardadas');
      setSelectedQuote({ ...selectedQuote, notes: editNotes });
      loadQuotes();
    } catch {
      toast.error('Error al guardar las notas');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleViewDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditNotes(quote.notes || '');
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (quote: Quote) => {
    setQuoteToDelete(quote);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Cotización eliminada');
      loadQuotes();
      if (selectedQuote?.id === quoteToDelete.id) {
        setIsDetailOpen(false);
      }
    } catch {
      toast.error('Error al eliminar la cotización');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const getWhatsAppUrl = (quote: Quote) => {
    const phone = quote.phone?.replace(/\D/g, '') || '';
    const tripName = quote.trips?.title || 'tu viaje';
    const message = encodeURIComponent(
      `Hola ${quote.name}! Te escribimos desde Headway Trips respecto a tu consulta sobre "${tripName}". `
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const totalPages = Math.ceil(totalQuotes / ITEMS_PER_PAGE);
  const pendingCount = quotes.filter((q) => q.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cotizaciones</h1>
          <p className="text-slate-500">
            {totalQuotes} cotizaciones en total
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
                {pendingCount} pendientes
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar por nombre o email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Viaje</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha viaje</TableHead>
              <TableHead className="hidden sm:table-cell">Viajeros</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Recibido</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40 mt-1" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))
            ) : quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <MessageSquare className="h-8 w-8" />
                    <p>No se encontraron cotizaciones</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => {
                const StatusIcon = STATUS_CONFIG[quote.status]?.icon || Clock;
                return (
                  <TableRow key={quote.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleViewDetail(quote)}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{quote.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {quote.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="font-medium text-slate-900 line-clamp-1">{quote.trips?.title || 'Viaje eliminado'}</div>
                      {quote.trips?.destination && (
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {quote.trips.destination}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="h-3 w-3" />
                        {quote.travel_date ? format(new Date(quote.travel_date), 'dd MMM yyyy', { locale: es }) : 'Sin fecha'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="h-3 w-3" />
                        {quote.travelers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={STATUS_CONFIG[quote.status]?.color || ''}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {STATUS_CONFIG[quote.status]?.label || quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">{format(new Date(quote.created_at), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetail(quote); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`mailto:${quote.email}`); }}>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar email
                          </DropdownMenuItem>
                          {quote.phone && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppUrl(quote), '_blank'); }}>
                              <Phone className="h-4 w-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                            <DropdownMenuItem
                              key={value}
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(quote.id, value); }}
                              disabled={quote.status === value}
                              className={value === 'cancelled' ? 'text-red-600' : ''}
                            >
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(quote); }} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalQuotes)} de {totalQuotes}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-600">
              Pag. {currentPage} de {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Quote Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Detalle de cotización
              {selectedQuote && (
                <Badge variant="secondary" className={STATUS_CONFIG[selectedQuote.status]?.color || ''}>
                  {STATUS_CONFIG[selectedQuote.status]?.label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Recibida el{' '}
              {selectedQuote && format(new Date(selectedQuote.created_at), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-4">
              {/* Status change */}
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-slate-700 whitespace-nowrap">Cambiar estado:</Label>
                <Select
                  value={selectedQuote.status}
                  onValueChange={(value) => handleStatusChange(selectedQuote.id, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      Información del cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs">Nombre</span>
                      <span className="font-medium">{selectedQuote.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs">Email</span>
                      <a href={`mailto:${selectedQuote.email}`} className="font-medium text-indigo-600 hover:underline break-all">
                        {selectedQuote.email}
                      </a>
                    </div>
                    {selectedQuote.phone && (
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-xs">Teléfono</span>
                        <a href={`tel:${selectedQuote.phone}`} className="font-medium text-indigo-600 hover:underline">
                          {selectedQuote.phone}
                        </a>
                      </div>
                    )}
                    {selectedQuote.country && (
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-xs">País</span>
                        <span className="font-medium flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {selectedQuote.country}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trip info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      Detalles del viaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs">Viaje</span>
                      <span className="font-medium">{selectedQuote.trips?.title || 'N/A'}</span>
                    </div>
                    {selectedQuote.trips?.destination && (
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-xs">Región</span>
                        <span className="font-medium">{selectedQuote.trips.destination}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-xs">Fecha de viaje</span>
                        <span className="font-medium">
                          {selectedQuote.travel_date
                            ? format(new Date(selectedQuote.travel_date), 'dd MMM yyyy', { locale: es })
                            : 'No especificada'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-xs">Adultos</span>
                        <span className="font-medium">{selectedQuote.adults}</span>
                      </div>
                      {selectedQuote.children > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-500 text-xs">Menores</span>
                          <span className="font-medium">{selectedQuote.children}</span>
                        </div>
                      )}
                    </div>
                    {selectedQuote.trips?.price && (
                      <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
                        <span className="text-slate-500 text-xs">Precio base p/p</span>
                        <span className="font-semibold text-green-700 text-base">
                          USD ${selectedQuote.trips.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedQuote.trip_id && (
                      <a
                        href={`/viajes/${selectedQuote.trip_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver viaje en el sitio
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Customer message */}
              {selectedQuote.message && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      Mensaje del cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
                      {selectedQuote.message}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Internal notes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-slate-500" />
                    Notas internas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Agrega notas internas sobre esta cotización... (ej: cliente contactado por teléfono, prefiere hotel 5 estrellas)"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes || editNotes === (selectedQuote.notes || '')}
                  >
                    {isSavingNotes ? 'Guardando...' : 'Guardar notas'}
                  </Button>
                </CardContent>
              </Card>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => window.open(`mailto:${selectedQuote.email}?subject=Cotización Headway Trips - ${selectedQuote.trips?.title || ''}`)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                {selectedQuote.phone && (
                  <Button variant="outline" onClick={() => window.open(getWhatsAppUrl(selectedQuote), '_blank')} className="text-green-700 border-green-300 hover:bg-green-50">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
                {selectedQuote.phone && (
                  <Button variant="outline" onClick={() => window.open(`tel:${selectedQuote.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                )}
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 ml-auto" onClick={() => handleDeleteClick(selectedQuote)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cotización</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cotización de &ldquo;{quoteToDelete?.name}&rdquo;
              {quoteToDelete?.trips?.title && ` para "${quoteToDelete.trips.title}"`} será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
