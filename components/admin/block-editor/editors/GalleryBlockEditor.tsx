'use client';

import { GalleryBlock, GalleryImage } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Images, Trash2, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { uploadToStorage } from '@/lib/upload';

interface GalleryBlockEditorProps {
  block: GalleryBlock;
}

export function GalleryBlockEditor({ block }: GalleryBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { images, layout, columns } = block.data;
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: GalleryImage[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        const { url: uploadedUrl } = await uploadToStorage(file, 'gallery');
        newImages.push({
          id: uuidv4(),
          url: uploadedUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
      }

      if (newImages.length > 0) {
        updateBlock(block.id, { images: [...images, ...newImages] });
        toast.success(`${newImages.length} imagen(es) subida(s)`);
      }
    } catch (error) {
      toast.error('Error al subir las imágenes');
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const updateImage = (imageId: string, updates: Partial<GalleryImage>) => {
    const newImages = images.map((img) =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    updateBlock(block.id, { images: newImages });
  };

  const removeImage = (imageId: string) => {
    const newImages = images.filter((img) => img.id !== imageId);
    updateBlock(block.id, { images: newImages });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="space-y-2">
        <Label>Imágenes de la galería ({images.length})</Label>
        <div
          className="p-6 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {uploading ? 'Subiendo...' : 'Haz clic o arrastra imágenes aquí'}
          </p>
          <p className="text-xs text-muted-foreground">
            Puedes seleccionar múltiples imágenes
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
      </div>

      {/* Layout Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Diseño</Label>
          <Select
            value={layout}
            onValueChange={(value) => updateBlock(block.id, { layout: value as GalleryBlock['data']['layout'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Cuadrícula</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="carousel">Carrusel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Columnas</Label>
          <Select
            value={columns.toString()}
            onValueChange={(value) => updateBlock(block.id, { columns: parseInt(value) as GalleryBlock['data']['columns'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 columnas</SelectItem>
              <SelectItem value="3">3 columnas</SelectItem>
              <SelectItem value="4">4 columnas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Images List */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-3 pr-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 mt-2 cursor-grab" />
              <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                <Image
                  src={image.url}
                  alt={image.alt || 'Imagen'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Texto alternativo"
                  value={image.alt}
                  onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                />
                <Input
                  placeholder="Leyenda (opcional)"
                  value={image.caption || ''}
                  onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeImage(image.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Images className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay imágenes en la galería
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
