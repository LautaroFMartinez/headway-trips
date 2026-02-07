'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ImageIcon, Loader2, Save, Eye, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BlogRichEditor } from '@/components/admin/blog-rich-editor';
import { cn } from '@/lib/utils';

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
}

interface BlogEditorProps {
  blog: BlogPost | null;
  open: boolean;
  onClose: (saved: boolean) => void;
}

const CATEGORIES = [
  { value: 'destinos', label: 'Destinos' },
  { value: 'tips', label: 'Tips de Viaje' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'gastronomia', label: 'Gastronomía' },
];

export function BlogEditor({ blog, open, onClose }: BlogEditorProps) {
  const isEditing = !!blog;

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('destinos');
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when blog changes
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setExcerpt(blog.excerpt);
      setContent(blog.content);
      setCoverImage(blog.cover_image);
      setCategory(blog.category);
      setAuthorName(blog.author_name);
      setAuthorAvatar(blog.author_avatar || '');
      setPublishedAt(blog.published_at);
      setReadingTime(blog.reading_time);
      setFeatured(blog.featured);
      setIsActive(blog.is_active);
    } else {
      // Defaults for new blog
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setCategory('destinos');
      setAuthorName('');
      setAuthorAvatar('');
      setPublishedAt(new Date().toISOString().split('T')[0]);
      setReadingTime(5);
      setFeatured(false);
      setIsActive(true);
    }
    setErrors({});
  }, [blog, open]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  // Auto-calculate reading time from content
  useEffect(() => {
    if (content) {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // ~200 words per minute
      setReadingTime(Math.max(1, minutes));
    }
  }, [content]);

  // File upload handler
  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCoverImage(data.url);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        uploadFile(acceptedFiles[0]);
      }
    },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!excerpt.trim()) newErrors.excerpt = 'El extracto es requerido';
    if (!content.trim()) newErrors.content = 'El contenido es requerido';
    if (!coverImage) newErrors.cover_image = 'La imagen de portada es requerida';
    if (!authorName.trim()) newErrors.author_name = 'El nombre del autor es requerido';
    if (!publishedAt) newErrors.published_at = 'La fecha de publicación es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const blogData = {
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        category,
        author_name: authorName,
        author_avatar: authorAvatar || null,
        published_at: publishedAt,
        reading_time: readingTime,
        featured,
        is_active: isActive,
      };

      const url = isEditing ? `/api/admin/blogs/${blog.id}` : '/api/admin/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        onClose(true);
      } else {
        const data = await response.json();
        console.error('Save failed:', data.error);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose(false)}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-6">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar artículo' : 'Nuevo artículo'}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="content" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="media">Imagen</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del artículo" className={errors.title ? 'border-red-500' : ''} />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="titulo-del-articulo" />
              <p className="text-xs text-slate-500">/blog/{slug || 'titulo-del-articulo'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto *</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Breve descripción del artículo..." rows={3} className={errors.excerpt ? 'border-red-500' : ''} />
              {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
            </div>

            <div className="space-y-2">
              <Label>Contenido *</Label>
              <BlogRichEditor
                content={content}
                onChange={setContent}
                placeholder="Escribe el contenido del artículo..."
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              <p className="text-xs text-slate-500">Tiempo de lectura estimado: {readingTime} min</p>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Imagen de portada *</Label>
              {coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                  <Image src={coverImage} alt="Cover" fill className="object-cover" />
                  <button onClick={() => setCoverImage('')} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn('border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors', isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300', errors.cover_image ? 'border-red-500' : '')}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-sm text-slate-500">Subiendo imagen...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-slate-100 rounded-full">
                        <Upload className="h-6 w-6 text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-600">Arrastrá una imagen o hacé click para seleccionar</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP hasta 5MB</p>
                    </div>
                  )}
                </div>
              )}
              {errors.cover_image && <p className="text-sm text-red-500">{errors.cover_image}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_url">O ingresá una URL</Label>
              <Input id="cover_url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="published_at">Fecha de publicación *</Label>
                <Input id="published_at" type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={errors.published_at ? 'border-red-500' : ''} />
                {errors.published_at && <p className="text-sm text-red-500">{errors.published_at}</p>}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="author_name">Nombre del autor *</Label>
              <Input id="author_name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="María González" className={errors.author_name ? 'border-red-500' : ''} />
              {errors.author_name && <p className="text-sm text-red-500">{errors.author_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_avatar">Avatar del autor (URL)</Label>
              <Input id="author_avatar" value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reading_time">Tiempo de lectura (min)</Label>
              <Input id="reading_time" type="number" min={1} value={readingTime} onChange={(e) => setReadingTime(parseInt(e.target.value) || 1)} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Artículo destacado</Label>
                <p className="text-sm text-slate-500">Mostrar en sección destacada</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Publicar</Label>
                <p className="text-sm text-slate-500">{isActive ? 'Visible en el sitio' : 'Guardado como borrador'}</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={() => onClose(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button variant="outline" onClick={() => window.open(`/blog/${slug}`, '_blank')} disabled={isSaving}>
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
