'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ImageIcon, FileText, Trash2, Loader2, Save, Eye, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/types/blocks';
import { BlockEditor } from './block-editor';

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
  itinerary?: string;
  includes?: string[];
  excludes?: string[];
  pdf_url?: string;
  content_blocks?: ContentBlock[];
  is_featured: boolean;
  is_active: boolean;
  max_capacity?: number;
}

interface TripEditorProps {
  trip: Trip | null;
  open: boolean;
  onClose: (saved: boolean) => void;
}

interface UploadedFile {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'pdf';
  isUploading?: boolean;
}

const REGIONS = [
  { value: 'sudamerica', label: 'Sudamérica' },
  { value: 'europa', label: 'Europa' },
  { value: 'asia', label: 'Asia' },
  { value: 'norteamerica', label: 'Norteamérica' },
  { value: 'centroamerica', label: 'Centroamérica' },
  { value: 'oceania', label: 'Oceanía' },
  { value: 'africa', label: 'África' },
];

export function TripEditor({ trip, open, onClose }: TripEditorProps) {
  const isEditing = !!trip;

  // Form state - solo campos esenciales
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState<number>(20);

  // Files state
  const [mainImage, setMainImage] = useState<UploadedFile | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedFile[]>([]);
  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);

  // Content blocks state
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'info' | 'content'>('content');

  // Reset form when trip or open changes
  useEffect(() => {
    if (open) {
      if (trip) {
        setTitle(trip.title || '');
        setSubtitle(trip.subtitle || '');
        setDescription(trip.description || '');
        setDestination(trip.destination || '');
        setRegion(trip.region || '');
        setPrice(trip.price || 0);
        setDurationDays(trip.duration_days || 1);
        setIsActive(trip.is_active ?? true);
        setIsFeatured(trip.is_featured ?? false);
        setMaxCapacity(trip.max_capacity ?? 20);
        setMainImage(trip.image_url ? { id: '1', url: trip.image_url, name: 'Imagen principal', type: 'image' } : null);
        setGalleryImages(trip.gallery?.map((url, i) => ({ id: `g-${i}`, url, name: `Galería ${i + 1}`, type: 'image' })) || []);
        setPdfFile(trip.pdf_url ? { id: 'pdf', url: trip.pdf_url, name: 'Itinerario PDF', type: 'pdf' } : null);
        setContentBlocks(trip.content_blocks || []);
      } else {
        // Reset para nuevo viaje
        setTitle('');
        setSubtitle('');
        setDescription('');
        setDestination('');
        setRegion('');
        setPrice(0);
        setDurationDays(1);
        setIsActive(true);
        setIsFeatured(false);
        setMaxCapacity(20);
        setMainImage(null);
        setGalleryImages([]);
        setPdfFile(null);
        setContentBlocks([]);
      }
      setErrors({});
      setActiveSection('content');
    }
  }, [open, trip]);

  // File upload handlers
  const uploadFile = async (file: File, type: 'main' | 'gallery' | 'pdf') => {
    const tempId = `temp-${Date.now()}`;
    const tempFile: UploadedFile = {
      id: tempId,
      url: URL.createObjectURL(file),
      name: file.name,
      type: type === 'pdf' ? 'pdf' : 'image',
      isUploading: true,
    };

    if (type === 'main') setMainImage(tempFile);
    else if (type === 'gallery') setGalleryImages((prev) => [...prev, tempFile]);
    else setPdfFile(tempFile);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      const uploadedFile: UploadedFile = { id: tempId, url, name: file.name, type: type === 'pdf' ? 'pdf' : 'image', isUploading: false };

      if (type === 'main') setMainImage(uploadedFile);
      else if (type === 'gallery') setGalleryImages((prev) => prev.map((f) => (f.id === tempId ? uploadedFile : f)));
      else setPdfFile(uploadedFile);
    } catch (error) {
      console.error('Upload error:', error);
      if (type === 'main') setMainImage(null);
      else if (type === 'gallery') setGalleryImages((prev) => prev.filter((f) => f.id !== tempId));
      else setPdfFile(null);
    }
  };

  const onDropMainImage = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) await uploadFile(acceptedFiles[0], 'main');
  }, []);

  const onDropGallery = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) await uploadFile(file, 'gallery');
  }, []);

  const onDropPdf = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) await uploadFile(acceptedFiles[0], 'pdf');
  }, []);

  const mainImageDropzone = useDropzone({ onDrop: onDropMainImage, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024 });
  const galleryDropzone = useDropzone({ onDrop: onDropGallery, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxSize: 5 * 1024 * 1024 });
  const pdfDropzone = useDropzone({ onDrop: onDropPdf, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024 });

  const generateSlug = (title: string): string => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!destination.trim()) newErrors.destination = 'El destino es requerido';
    if (!region) newErrors.region = 'La región es requerida';
    if (!price || price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!durationDays || durationDays <= 0) newErrors.duration_days = 'Los días son requeridos';
    if (!mainImage) newErrors.image = 'La imagen principal es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setActiveSection('info');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        slug: generateSlug(title),
        description,
        short_description: subtitle || description.slice(0, 160),
        destination,
        region,
        price,
        duration_days: durationDays,
        duration_nights: Math.max(0, durationDays - 1),
        image_url: mainImage?.url,
        gallery: galleryImages.map((img) => img.url),
        pdf_url: pdfFile?.url,
        content_blocks: contentBlocks,
        is_featured: isFeatured,
        is_active: isActive,
        max_capacity: maxCapacity,
      };

      const url = isEditing ? `/api/admin/trips/${trip.id}` : '/api/admin/trips';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Error al guardar');

      onClose(true);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose(false)}>
      <SheetContent className="w-full sm:max-w-4xl overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div>
            <SheetTitle className="text-lg">{isEditing ? 'Editar viaje' : 'Nuevo viaje'}</SheetTitle>
            <SheetDescription className="text-sm">{isEditing ? title : 'Crea un nuevo viaje con bloques de contenido'}</SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && trip && (
              <a
                href={`/viaje/${trip.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b bg-slate-50 px-6">
          <button
            onClick={() => setActiveSection('content')}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeSection === 'content' ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            Editor de Bloques
          </button>
          <button
            onClick={() => setActiveSection('info')}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeSection === 'info' ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            Información Básica
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'content' ? (
            /* Block Editor */
            <div className="h-full">
              <BlockEditor initialBlocks={contentBlocks} onChange={setContentBlocks} />
            </div>
          ) : (
            /* Info Form */
            <div className="p-6 space-y-6">
              {/* Título y Destino */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del viaje *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Maldivas en Grupo"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino *</Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej: Islas Maldivas"
                    className={errors.destination ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Subtítulo */}
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ej: 8 días de aventura tropical con todo incluido"
                />
              </div>

              {/* Región, Precio, Duración, Cupos */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Región *</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price || ''}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    placeholder="1500"
                    min={0}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (días) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={durationDays || ''}
                    onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                    placeholder="8"
                    min={1}
                    className={errors.duration_days ? 'border-red-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_capacity">Cupos (max)</Label>
                  <Input
                    id="max_capacity"
                    type="number"
                    value={maxCapacity || ''}
                    onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 20)}
                    placeholder="20"
                    min={1}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del viaje</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe brevemente el viaje..."
                  rows={3}
                />
              </div>

              <Separator />

              {/* Imagen Principal */}
              <div className="space-y-2">
                <Label>Imagen principal *</Label>
                {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                <div
                  {...mainImageDropzone.getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
                    mainImageDropzone.isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'
                  )}
                >
                  <input {...mainImageDropzone.getInputProps()} />
                  {mainImage ? (
                    <div className="relative">
                      <div className="relative h-40 rounded-lg overflow-hidden">
                        <Image src={mainImage.url} alt="Imagen principal" fill className="object-cover" />
                        {mainImage.isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); setMainImage(null); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <ImageIcon className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">Arrastra o haz clic para subir</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Galería */}
              <div className="space-y-2">
                <Label>Galería de imágenes</Label>
                <div
                  {...galleryDropzone.getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors',
                    galleryDropzone.isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'
                  )}
                >
                  <input {...galleryDropzone.getInputProps()} />
                  <Upload className="h-6 w-6 mx-auto text-slate-400 mb-1" />
                  <p className="text-sm text-slate-600">Agregar más imágenes</p>
                </div>
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <div className="relative h-20 rounded-lg overflow-hidden bg-slate-100">
                          <Image src={img.url} alt={img.name} fill className="object-cover" />
                          {img.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-4 w-4 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setGalleryImages((prev) => prev.filter((f) => f.id !== img.id))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PDF */}
              <div className="space-y-2">
                <Label>PDF del itinerario (opcional)</Label>
                <div
                  {...pdfDropzone.getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors',
                    pdfDropzone.isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'
                  )}
                >
                  <input {...pdfDropzone.getInputProps()} />
                  {pdfFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-sm font-medium">{pdfFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <FileText className="h-6 w-6 mx-auto text-slate-400 mb-1" />
                      <p className="text-sm text-slate-600">Subir PDF</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Switches */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Viaje activo</Label>
                  <p className="text-xs text-slate-500">Se muestra en el sitio público</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Viaje destacado</Label>
                  <p className="text-xs text-slate-500">Aparece en la sección de destacados</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 px-6 py-4 border-t bg-white">
          <Button variant="outline" className="flex-1" onClick={() => onClose(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Guardar' : 'Crear viaje'}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
