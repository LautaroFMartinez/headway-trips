'use client';

import { TextBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { TipTapEditor } from '../rich-text/TipTapEditor';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TextBlockEditorProps {
  block: TextBlock;
}

export function TextBlockEditor({ block }: TextBlockEditorProps) {
  const { updateBlock } = useBlockEditor();

  const handleContentChange = (content: string) => {
    updateBlock(block.id, { content });
  };

  const handleAlignmentChange = (alignment: string) => {
    updateBlock(block.id, { alignment: alignment as TextBlock['data']['alignment'] });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Contenido</Label>
        <TipTapEditor
          content={block.data.content}
          onChange={handleContentChange}
          placeholder="Escribe tu texto aquí..."
          minHeight="200px"
        />
      </div>

      <div className="space-y-2">
        <Label>Alineación por defecto</Label>
        <Select
          value={block.data.alignment}
          onValueChange={handleAlignmentChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
            <SelectItem value="justify">Justificado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
