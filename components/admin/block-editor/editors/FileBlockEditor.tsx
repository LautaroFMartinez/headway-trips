'use client';

import { FileBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, File } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface FileBlockEditorProps {
  block: FileBlock;
}

export function FileBlockEditor({ block }: FileBlockEditorProps) {
  const { updateBlock } = useBlockEditor();
  const { url, name, type, description, size } = block.data;
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();

      // Determine file type
      let fileType: FileBlock['data']['type'] = 'other';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        fileType = 'doc';
      }

      updateBlock(block.id, {
        url: data.url,
        name: name || file.name,
        type: fileType,
        size: file.size,
      });
      toast.success('Archivo subido correctamente');
    } catch (error) {
      toast.error('Error al subir el archivo');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* File Upload/Preview */}
      <div className="space-y-2">
        <Label>Archivo</Label>
        {url ? (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{name || 'Archivo'}</p>
              <p className="text-sm text-muted-foreground">
                {type.toUpperCase()}
                {size && ` • ${formatSize(size)}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Cambiar
            </Button>
          </div>
        ) : (
          <div
            className="p-8 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {uploading ? 'Subiendo...' : 'Haz clic para subir un archivo'}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* URL Manual */}
      <div className="space-y-2">
        <Label htmlFor="file-url">O ingresa una URL</Label>
        <Input
          id="file-url"
          value={url}
          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
          placeholder="https://ejemplo.com/archivo.pdf"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="file-name">Nombre del archivo</Label>
        <Input
          id="file-name"
          value={name}
          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
          placeholder="Itinerario detallado.pdf"
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Tipo de archivo</Label>
        <Select
          value={type}
          onValueChange={(value) => updateBlock(block.id, { type: value as FileBlock['data']['type'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="doc">Documento Word</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="file-description">Descripción (opcional)</Label>
        <Textarea
          id="file-description"
          value={description || ''}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          placeholder="Descripción del contenido del archivo..."
          rows={3}
        />
      </div>
    </div>
  );
}
