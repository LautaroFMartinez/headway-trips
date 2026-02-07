'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Eye, ChevronLeft, ChevronRight, ImageIcon, Calendar, Clock, Star, StarOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { BlogEditor } from '@/components/admin/blog-editor';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author_name: string;
  author_avatar?: string;
  published_at: string;
  reading_time: number;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

const CATEGORIES = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'destinos', label: 'Destinos' },
  { value: 'tips', label: 'Tips de Viaje' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'gastronomia', label: 'Gastronomía' },
];

function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BlogsManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { active: statusFilter }),
      });

      const response = await fetch(`/api/admin/blogs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalBlogs(data.total);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, categoryFilter, statusFilter]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setIsEditorOpen(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsEditorOpen(true);
  };

  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleEditorClose = (saved: boolean) => {
    setIsEditorOpen(false);
    setEditingBlog(null);
    if (saved) {
      loadBlogs();
    }
  };

  const handleToggleFeatured = async (blog: BlogPost) => {
    try {
      await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !blog.featured }),
      });
      loadBlogs();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleActive = async (blog: BlogPost) => {
    try {
      await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !blog.is_active }),
      });
      loadBlogs();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Blog</h1>
          <p className="text-slate-500">{totalBlogs} artículos en total</p>
        </div>
        <Button onClick={handleCreateBlog} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar artículos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
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
            <SelectItem value="false">Borradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha</TableHead>
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
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <ImageIcon className="h-8 w-8" />
                    <p>No se encontraron artículos</p>
                    <Button variant="outline" size="sm" onClick={handleCreateBlog}>
                      Crear primer artículo
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id} onClick={() => handleEditBlog(blog)} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <div className="relative h-12 w-16 rounded overflow-hidden bg-slate-100">
                      {blog.cover_image ? (
                        <Image src={blog.cover_image} alt={blog.title} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 line-clamp-1">{blog.title}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>{blog.author_name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.reading_time} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{getCategoryLabel(blog.category)}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(blog.published_at)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col gap-1">
                      <Badge variant={blog.is_active ? 'default' : 'secondary'} className="w-fit">
                        {blog.is_active ? 'Publicado' : 'Borrador'}
                      </Badge>
                      {blog.featured && (
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
                        <DropdownMenuItem onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver en sitio
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditBlog(blog)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(blog)}>
                          {blog.featured ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                          {blog.featured ? 'Quitar destacado' : 'Marcar destacado'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(blog)}>{blog.is_active ? 'Pasar a borrador' : 'Publicar'}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(blog)} className="text-red-600">
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
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalBlogs)} de {totalBlogs}
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

      {/* Blog Editor */}
      <BlogEditor blog={editingBlog} open={isEditorOpen} onClose={handleEditorClose} />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este artículo?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente &ldquo;{blogToDelete?.title}&rdquo; y todos sus datos asociados.</AlertDialogDescription>
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
