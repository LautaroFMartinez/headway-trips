'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Eye, ChevronLeft, ChevronRight, ImageIcon, MapPin, Calendar, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { TripEditor } from '@/components/admin/trip-editor';

interface Trip {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  short_description?: string;
  destination: string;
  region: string;
  price: number;
  original_price?: number;
  duration_days: number;
  duration_nights: number;
  image_url: string;
  gallery?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

export function TripsManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(regionFilter !== 'all' && { region: regionFilter }),
        ...(statusFilter !== 'all' && { active: statusFilter }),
      });

      const response = await fetch(`/api/admin/trips?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips);
        setTotalTrips(data.total);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, regionFilter, statusFilter]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleCreateTrip = () => {
    setEditingTrip(null);
    setIsEditorOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsEditorOpen(true);
  };

  const handleDeleteClick = (trip: Trip) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/trips/${tripToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadTrips();
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTripToDelete(null);
    }
  };

  const handleEditorClose = (saved: boolean) => {
    setIsEditorOpen(false);
    setEditingTrip(null);
    if (saved) {
      loadTrips();
    }
  };

  const handleToggleFeatured = async (trip: Trip) => {
    try {
      await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !trip.is_featured }),
      });
      loadTrips();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleActive = async (trip: Trip) => {
    try {
      await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !trip.is_active }),
      });
      loadTrips();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const totalPages = Math.ceil(totalTrips / ITEMS_PER_PAGE);

  const regions = [
    { value: 'all', label: 'Todas las regiones' },
    { value: 'sudamerica', label: 'Sudamérica' },
    { value: 'europa', label: 'Europa' },
    { value: 'asia', label: 'Asia' },
    { value: 'norteamerica', label: 'Norteamérica' },
    { value: 'centroamerica', label: 'Centroamérica' },
    { value: 'oceania', label: 'Oceanía' },
    { value: 'africa', label: 'África' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Viajes</h1>
          <p className="text-slate-500">{totalTrips} viajes en total</p>
        </div>
        <Button onClick={handleCreateTrip} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo viaje
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar viajes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Región" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Viaje</TableHead>
              <TableHead className="hidden md:table-cell">Destino</TableHead>
              <TableHead className="hidden lg:table-cell">Duración</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="hidden sm:table-cell">Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-16 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <ImageIcon className="h-8 w-8" />
                    <p>No se encontraron viajes</p>
                    <Button variant="outline" size="sm" onClick={handleCreateTrip}>
                      Crear primer viaje
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} onClick={() => handleEditTrip(trip)} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <div className="relative h-12 w-16 rounded overflow-hidden bg-slate-100">
                      {trip.image_url ? (
                        <Image src={trip.image_url} alt={trip.title} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 line-clamp-1">{trip.title}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {trip.region}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-slate-600">{trip.destination}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="h-3 w-3" />
                      {trip.duration_days}D / {trip.duration_nights}N
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">${trip.price.toLocaleString()}</div>
                    {trip.original_price && trip.original_price > trip.price && <div className="text-xs text-slate-400 line-through">${trip.original_price.toLocaleString()}</div>}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col gap-1">
                      <Badge variant={trip.is_active ? 'default' : 'secondary'} className="w-fit">
                        {trip.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {trip.is_featured && (
                        <Badge variant="outline" className="w-fit text-amber-600 border-amber-300">
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/viaje/${trip.id}`, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver en sitio
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTrip(trip)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(trip)}>{trip.is_featured ? 'Quitar destacado' : 'Marcar destacado'}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(trip)}>{trip.is_active ? 'Desactivar' : 'Activar'}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(trip)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalTrips)} de {totalTrips}
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

      {/* Trip Editor */}
      <TripEditor trip={editingTrip} open={isEditorOpen} onClose={handleEditorClose} />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este viaje?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente &ldquo;{tripToDelete?.title}&rdquo; y todos sus datos asociados.</AlertDialogDescription>
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
