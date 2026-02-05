'use client';

import { ImageBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface ImageBlockEditorProps {
  block: ImageBlock;
}

export function ImageBlockEditor({ block }: ImageBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { url, alt, caption, size, alignment } = block.data;
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      updateBlock(block.id, {
        url: data.url,
        alt: alt || file.name.replace(/\.[^/.]+$/, ''),
      });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Preview/Upload */}
      <div className="space-y-2">
        <Label>Imagen</Label>
        {url ? (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={url}
              alt={alt || 'Imagen'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar imagen
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {uploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* URL Manual */}
      <div className="space-y-2">
        <Label htmlFor="image-url">O ingresa una URL</Label>
        <Input
          id="image-url"
          value={url}
          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      {/* Alt text */}
      <div className="space-y-2">
        <Label htmlFor="image-alt">Texto alternativo (SEO)</Label>
        <Input
          id="image-alt"
          value={alt}
          onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
          placeholder="Descripción de la imagen"
        />
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <Label htmlFor="image-caption">Leyenda (opcional)</Label>
        <Input
          id="image-caption"
          value={caption || ''}
          onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
          placeholder="Texto debajo de la imagen"
        />
      </div>

      {/* Size & Alignment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tamaño</Label>
          <Select
            value={size}
            onValueChange={(value) => updateBlock(block.id, { size: value as ImageBlock['data']['size'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeño</SelectItem>
              <SelectItem value="medium">Mediano</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="full">Ancho completo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Alineación</Label>
          <Select
            value={alignment}
            onValueChange={(value) => updateBlock(block.id, { alignment: value as ImageBlock['data']['alignment'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Izquierda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Derecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
