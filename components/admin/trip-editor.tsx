'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ImageIcon, FileText, Trash2, GripVertical, Loader2, Save, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Trip {
  id: string;
  title: string;
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
  is_featured: boolean;
  is_active: boolean;
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

  // Form state
  const [formData, setFormData] = useState<Partial<Trip>>(() => getInitialFormData(trip));
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Files state
  const [mainImage, setMainImage] = useState<UploadedFile | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedFile[]>([]);
  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);

  // Reset form when trip or open changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(trip));
      setMainImage(trip?.image_url ? { id: '1', url: trip.image_url, name: 'Imagen principal', type: 'image' } : null);
      setGalleryImages(trip?.gallery?.map((url, i) => ({ id: `g-${i}`, url, name: `Galería ${i + 1}`, type: 'image' })) || []);
      setPdfFile(trip?.pdf_url ? { id: 'pdf', url: trip.pdf_url, name: 'Itinerario PDF', type: 'pdf' } : null);
      setErrors({});
    }
  }, [open, trip]);

  // Main image dropzone
  const onDropMainImage = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    await uploadFile(file, 'main');
  }, []);

  const mainImageDropzone = useDropzone({
    onDrop: onDropMainImage,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Gallery dropzone
  const onDropGallery = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file, 'gallery');
    }
  }, []);

  const galleryDropzone = useDropzone({
    onDrop: onDropGallery,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
  });

  // PDF dropzone
  const onDropPdf = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    await uploadFile(file, 'pdf');
  }, []);

  const pdfDropzone = useDropzone({
    onDrop: onDropPdf,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const uploadFile = async (file: File, type: 'main' | 'gallery' | 'pdf') => {
    const tempId = `temp-${Date.now()}`;
    const tempFile: UploadedFile = {
      id: tempId,
      url: URL.createObjectURL(file),
      name: file.name,
      type: type === 'pdf' ? 'pdf' : 'image',
      isUploading: true,
    };

    if (type === 'main') {
      setMainImage(tempFile);
    } else if (type === 'gallery') {
      setGalleryImages((prev) => [...prev, tempFile]);
    } else {
      setPdfFile(tempFile);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();

      const uploadedFile: UploadedFile = {
        id: tempId,
        url,
        name: file.name,
        type: type === 'pdf' ? 'pdf' : 'image',
        isUploading: false,
      };

      if (type === 'main') {
        setMainImage(uploadedFile);
      } else if (type === 'gallery') {
        setGalleryImages((prev) => prev.map((f) => (f.id === tempId ? uploadedFile : f)));
      } else {
        setPdfFile(uploadedFile);
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Remove on error
      if (type === 'main') {
        setMainImage(null);
      } else if (type === 'gallery') {
        setGalleryImages((prev) => prev.filter((f) => f.id !== tempId));
      } else {
        setPdfFile(null);
      }
    }
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((f) => f.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.destination?.trim()) {
      newErrors.destination = 'El destino es requerido';
    }
    if (!formData.region) {
      newErrors.region = 'La región es requerida';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (!formData.duration_days || formData.duration_days <= 0) {
      newErrors.duration_days = 'Los días son requeridos';
    }
    if (!mainImage) {
      newErrors.image = 'La imagen principal es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title || ''),
        image_url: mainImage?.url,
        gallery: galleryImages.map((img) => img.url),
        pdf_url: pdfFile?.url,
      };

      const url = isEditing ? `/api/admin/trips/${trip.id}` : '/api/admin/trips';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar');
      }

      onClose(true);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose(false)}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar viaje' : 'Nuevo viaje'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Modifica los detalles del viaje' : 'Completa la información para crear un nuevo viaje'}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="general" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Imágenes</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" name="title" value={formData.title || ''} onChange={handleTitleChange} placeholder="Ej: Aventura en Machu Picchu" className={errors.title ? 'border-red-500' : ''} />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL amigable</Label>
              <Input id="slug" name="slug" value={formData.slug || ''} onChange={handleInputChange} placeholder="aventura-machu-picchu" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destino *</Label>
                <Input id="destination" name="destination" value={formData.destination || ''} onChange={handleInputChange} placeholder="Cusco, Perú" className={errors.destination ? 'border-red-500' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <Select value={formData.region || ''} onValueChange={(v) => handleSelectChange('region', v)}>
                  <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar región" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Descripción corta</Label>
              <Input id="short_description" name="short_description" value={formData.short_description || ''} onChange={handleInputChange} placeholder="Resumen breve para tarjetas" maxLength={160} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción completa</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Descripción detallada del viaje..." rows={4} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (USD) *</Label>
                <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} placeholder="0" min={0} className={errors.price ? 'border-red-500' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Precio original (USD)</Label>
                <Input id="original_price" name="original_price" type="number" value={formData.original_price || ''} onChange={handleInputChange} placeholder="Para mostrar descuento" min={0} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_days">Días *</Label>
                <Input id="duration_days" name="duration_days" type="number" value={formData.duration_days || ''} onChange={handleInputChange} placeholder="5" min={1} className={errors.duration_days ? 'border-red-500' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_nights">Noches</Label>
                <Input id="duration_nights" name="duration_nights" type="number" value={formData.duration_nights || ''} onChange={handleInputChange} placeholder="4" min={0} />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Viaje activo</Label>
                <p className="text-sm text-slate-500">Los viajes inactivos no se muestran en el sitio</p>
              </div>
              <Switch checked={formData.is_active ?? true} onCheckedChange={(v) => handleSwitchChange('is_active', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Viaje destacado</Label>
                <p className="text-sm text-slate-500">Se mostrará en la sección de destacados</p>
              </div>
              <Switch checked={formData.is_featured ?? false} onCheckedChange={(v) => handleSwitchChange('is_featured', v)} />
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 mt-4">
            {/* Main Image */}
            <div className="space-y-2">
              <Label>Imagen principal *</Label>
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              <div {...mainImageDropzone.getRootProps()} className={cn('border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors', mainImageDropzone.isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400')}>
                <input {...mainImageDropzone.getInputProps()} />
                {mainImage ? (
                  <div className="relative">
                    <div className="relative h-48 rounded-lg overflow-hidden">
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
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImage(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG o WEBP hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <Label>Galería de imágenes</Label>
              <div {...galleryDropzone.getRootProps()} className={cn('border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors', galleryDropzone.isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400')}>
                <input {...galleryDropzone.getInputProps()} />
                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">Arrastra imágenes adicionales para la galería</p>
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-100">
                        <Image src={img.url} alt={img.name} fill className="object-cover" />
                        {img.isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeGalleryImage(img.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDF */}
            <div className="space-y-2">
              <Label>Itinerario PDF</Label>
              <div {...pdfDropzone.getRootProps()} className={cn('border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors', pdfDropzone.isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400')}>
                <input {...pdfDropzone.getInputProps()} />
                {pdfFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{pdfFile.name}</p>
                        <p className="text-xs text-slate-500">PDF cargado</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <FileText className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Arrastra un PDF con el itinerario detallado</p>
                    <p className="text-xs text-slate-400 mt-1">PDF hasta 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="itinerary">Itinerario</Label>
              <Textarea
                id="itinerary"
                name="itinerary"
                value={formData.itinerary || ''}
                onChange={handleInputChange}
                placeholder="Día 1: Llegada a destino...&#10;Día 2: Visita a..."
                rows={8}
              />
              <p className="text-xs text-slate-500">Describe el itinerario día por día</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="includes">¿Qué incluye?</Label>
              <Textarea
                id="includes"
                name="includes"
                value={Array.isArray(formData.includes) ? formData.includes.join('\n') : formData.includes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    includes: e.target.value.split('\n').filter((l) => l.trim()),
                  }))
                }
                placeholder="Transporte terrestre&#10;Alojamiento 4 estrellas&#10;Desayuno incluido"
                rows={5}
              />
              <p className="text-xs text-slate-500">Una línea por cada item incluido</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excludes">No incluye</Label>
              <Textarea
                id="excludes"
                name="excludes"
                value={Array.isArray(formData.excludes) ? formData.excludes.join('\n') : formData.excludes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    excludes: e.target.value.split('\n').filter((l) => l.trim()),
                  }))
                }
                placeholder="Vuelos internacionales&#10;Seguro de viaje&#10;Propinas"
                rows={4}
              />
              <p className="text-xs text-slate-500">Una línea por cada item no incluido</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
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
                {isEditing ? 'Guardar cambios' : 'Crear viaje'}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getInitialFormData(trip: Trip | null): Partial<Trip> {
  if (trip) return { ...trip };
  return {
    title: '',
    slug: '',
    description: '',
    short_description: '',
    destination: '',
    region: '',
    price: 0,
    original_price: undefined,
    duration_days: 1,
    duration_nights: 0,
    image_url: '',
    gallery: [],
    itinerary: '',
    includes: [],
    excludes: [],
    pdf_url: '',
    is_featured: false,
    is_active: true,
  };
}
