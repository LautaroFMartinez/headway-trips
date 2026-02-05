'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Mail, Phone, Trash2, MoreHorizontal, CheckCircle, Circle, MessageSquare, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Expanded message
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(readFilter !== 'all' && { read: readFilter }),
      });

      const response = await fetch(`/api/admin/messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setTotalMessages(data.total);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, readFilter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleToggleRead = async (message: Message) => {
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !message.read }),
      });
      if (!res.ok) throw new Error();
      toast.success(message.read ? 'Marcado como no leído' : 'Marcado como leído');
      loadMessages();
    } catch {
      toast.error('Error al actualizar el mensaje');
    }
  };

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${messageToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Mensaje eliminado');
      loadMessages();
    } catch {
      toast.error('Error al eliminar el mensaje');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleExpandMessage = async (message: Message) => {
    if (expandedMessageId === message.id) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(message.id);
      // Mark as read when expanded
      if (!message.read) {
        await handleToggleRead(message);
      }
    }
  };

  const totalPages = Math.ceil(totalMessages / ITEMS_PER_PAGE);
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mensajes de contacto</h1>
          <p className="text-slate-500">
            {totalMessages} mensajes en total
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">
                {unreadCount} sin leer
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar por nombre, email o asunto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="false">Sin leer</SelectItem>
            <SelectItem value="true">Leídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4 rounded-full mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No se encontraron mensajes</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={cn('transition-all cursor-pointer hover:shadow-md', !message.read && 'border-l-4 border-l-indigo-500 bg-indigo-50/50')} onClick={() => handleExpandMessage(message)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(message);
                    }}
                    className="mt-1 text-slate-400 hover:text-indigo-600"
                    title={message.read ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    {message.read ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-medium truncate', !message.read && 'text-slate-900', message.read && 'text-slate-600')}>{message.name}</span>
                          {!message.read && <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full" />}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{message.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 whitespace-nowrap">{format(new Date(message.created_at), 'dd MMM HH:mm', { locale: es })}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${message.email}`);
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Responder por email
                            </DropdownMenuItem>
                            {message.phone && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://wa.me/${message.phone?.replace(/\D/g, '')}`);
                                }}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                WhatsApp
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleRead(message);
                              }}
                            >
                              {message.read ? 'Marcar como no leído' : 'Marcar como leído'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(message);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className={cn('mt-2 text-sm', !message.read && 'font-medium text-slate-800', message.read && 'text-slate-600')}>{message.subject}</p>

                    <p className={cn('mt-1 text-sm text-slate-500', expandedMessageId !== message.id && 'line-clamp-2')}>{message.message}</p>

                    {expandedMessageId === message.id && (
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`mailto:${message.email}?subject=Re: ${message.subject}`);
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                        {message.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/${message.phone?.replace(/\D/g, '')}`);
                            }}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalMessages)} de {totalMessages}
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

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este mensaje?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El mensaje de &ldquo;{messageToDelete?.name}&rdquo; será eliminado permanentemente.</AlertDialogDescription>
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
