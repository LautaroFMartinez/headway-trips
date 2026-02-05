'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Unlink,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCallback, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TipTapToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  children,
}: ToolbarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 w-8 p-0',
              isActive && 'bg-muted text-primary'
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TipTapToolbar({ editor }: TipTapToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1 bg-muted/30">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        tooltip="Deshacer"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        tooltip="Rehacer"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        tooltip="Negrita"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        tooltip="Cursiva"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        tooltip="Subrayado"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        tooltip="Tachado"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Lista con viñetas"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        tooltip="Cita"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        tooltip="Alinear izquierda"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        tooltip="Centrar"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        tooltip="Alinear derecha"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        tooltip="Justificar"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Link */}
      <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('link') && 'bg-muted text-primary'
            )}
          >
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <Label htmlFor="link-url">URL del enlace</Label>
            <Input
              id="link-url"
              placeholder="https://ejemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={setLink}>
                {editor.isActive('link') ? 'Actualizar' : 'Añadir'}
              </Button>
              {editor.isActive('link') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setLinkPopoverOpen(false);
                  }}
                >
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {editor.isActive('link') && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          tooltip="Quitar enlace"
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>
      )}
    </div>
  );
}
