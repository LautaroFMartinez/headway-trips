'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Mail, Phone, Calendar, MapPin, Users, Filter, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';

interface Quote {
  id: string;
  trip_id: string;
  name: string;
  email: string;
  phone: string;
  travel_date: string;
  travelers: number;
  message?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  trips?: {
    title: string;
    destination: string;
    price: number;
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
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const totalPages = Math.ceil(totalQuotes / ITEMS_PER_PAGE);

  // Calculate stats
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
              <Badge variant="secondary" className="ml-2">
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
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40 mt-1" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
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
                  <TableRow key={quote.id}>
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
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetail(quote)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${quote.email}`)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar email
                          </DropdownMenuItem>
                          {quote.phone && (
                            <DropdownMenuItem onClick={() => window.open(`tel:${quote.phone}`)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Llamar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'contacted')} disabled={quote.status === 'contacted'}>
                            Marcar como contactado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'quoted')} disabled={quote.status === 'quoted'}>
                            Marcar como cotizado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'confirmed')} disabled={quote.status === 'confirmed'}>
                            Marcar como confirmado
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'cancelled')} className="text-red-600">
                            Cancelar cotización
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
              Página {currentPage} de {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Quote Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de cotización</DialogTitle>
            <DialogDescription>
              Recibida el{' '}
              {selectedQuote &&
                format(new Date(selectedQuote.created_at), "d 'de' MMMM 'a las' HH:mm", {
                  locale: es,
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Información del cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nombre</span>
                    <span className="font-medium">{selectedQuote.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <a href={`mailto:${selectedQuote.email}`} className="font-medium text-indigo-600 hover:underline">
                      {selectedQuote.email}
                    </a>
                  </div>
                  {selectedQuote.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Teléfono</span>
                      <a href={`tel:${selectedQuote.phone}`} className="font-medium text-indigo-600 hover:underline">
                        {selectedQuote.phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Detalles del viaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Viaje</span>
                    <span className="font-medium">{selectedQuote.trips?.title || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha de viaje</span>
                    <span className="font-medium">
                      {selectedQuote.travel_date
                        ? format(new Date(selectedQuote.travel_date), 'dd MMM yyyy', {
                            locale: es,
                          })
                        : 'No especificada'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Viajeros</span>
                    <span className="font-medium">{selectedQuote.travelers} personas</span>
                  </div>
                  {selectedQuote.trips?.price && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Precio por persona</span>
                      <span className="font-medium">${selectedQuote.trips.price.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedQuote.message && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Mensaje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedQuote.message}</p>
                  </CardContent>
                </Card>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => window.open(`mailto:${selectedQuote.email}`)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar email
                </Button>
                {selectedQuote.phone && (
                  <Button variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/${selectedQuote.phone.replace(/\D/g, '')}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
