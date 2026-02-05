'use client';

import { HeadingBlock } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeadingBlockEditorProps {
  block: HeadingBlock;
}

export function HeadingBlockEditor({ block }: HeadingBlockEditorProps) {
  const { updateBlock } = useBlockEditor();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBlock(block.id, { text: e.target.value });
  };

  const handleLevelChange = (value: string) => {
    updateBlock(block.id, { level: parseInt(value) as HeadingBlock['data']['level'] });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="heading-text">Texto del encabezado</Label>
        <Input
          id="heading-text"
          value={block.data.text}
          onChange={handleTextChange}
          placeholder="Escribe el encabezado..."
        />
      </div>

      <div className="space-y-2">
        <Label>Nivel del encabezado</Label>
        <Select
          value={block.data.level.toString()}
          onValueChange={handleLevelChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 - Título principal</SelectItem>
            <SelectItem value="2">H2 - Sección</SelectItem>
            <SelectItem value="3">H3 - Subsección</SelectItem>
            <SelectItem value="4">H4 - Subtítulo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
        {block.data.text ? (
          <div
            className={
              block.data.level === 1
                ? 'text-3xl font-bold'
                : block.data.level === 2
                ? 'text-2xl font-semibold'
                : block.data.level === 3
                ? 'text-xl font-semibold'
                : 'text-lg font-medium'
            }
          >
            {block.data.text}
          </div>
        ) : (
          <p className="text-muted-foreground italic">Sin texto</p>
        )}
      </div>
    </div>
  );
}
