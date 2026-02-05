'use client';

import { ContentBlock, BLOCK_NAMES } from '@/types/blocks';
import { useBlockEditor } from '../BlockEditorContext';
import { getBlockIcon } from '../utils/blockIcons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Edit,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import block renderers
import { TextBlockRenderer } from './TextBlockRenderer';
import { HeadingBlockRenderer } from './HeadingBlockRenderer';
import { ItineraryBlockRenderer } from './ItineraryBlockRenderer';
import { ServicesBlockRenderer } from './ServicesBlockRenderer';
import { PriceBlockRenderer } from './PriceBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';
import { GalleryBlockRenderer } from './GalleryBlockRenderer';
import { FileBlockRenderer } from './FileBlockRenderer';
import { AccommodationBlockRenderer } from './AccommodationBlockRenderer';
import { ActivityBlockRenderer } from './ActivityBlockRenderer';
import { TransportBlockRenderer } from './TransportBlockRenderer';
import { FlightBlockRenderer } from './FlightBlockRenderer';
import { FoodBlockRenderer } from './FoodBlockRenderer';

interface BlockWrapperProps {
  block: ContentBlock;
  onClick?: () => void;
  isDragOverlay?: boolean;
}

export function BlockWrapper({ block, onClick, isDragOverlay }: BlockWrapperProps) {
  const { deleteBlock, duplicateBlock, toggleVisibility, setEditingBlock } =
    useBlockEditor();

  const Icon = getBlockIcon(block.type);

  const handleEdit = () => {
    setEditingBlock(block.id);
    onClick?.();
  };

  const handleDuplicate = () => {
    duplicateBlock(block.id);
  };

  const handleDelete = () => {
    deleteBlock(block.id);
  };

  const handleToggleVisibility = () => {
    toggleVisibility(block.id);
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block} />;
      case 'heading':
        return <HeadingBlockRenderer block={block} />;
      case 'itinerary':
        return <ItineraryBlockRenderer block={block} />;
      case 'services':
        return <ServicesBlockRenderer block={block} />;
      case 'price':
        return <PriceBlockRenderer block={block} />;
      case 'image':
        return <ImageBlockRenderer block={block} />;
      case 'gallery':
        return <GalleryBlockRenderer block={block} />;
      case 'file':
        return <FileBlockRenderer block={block} />;
      case 'accommodation':
        return <AccommodationBlockRenderer block={block} />;
      case 'activity':
        return <ActivityBlockRenderer block={block} />;
      case 'transport':
        return <TransportBlockRenderer block={block} />;
      case 'flight':
        return <FlightBlockRenderer block={block} />;
      case 'food':
        return <FoodBlockRenderer block={block} />;
      default:
        return <div>Bloque desconocido</div>;
    }
  };

  return (
    <Card
      className={cn(
        'group relative transition-all',
        !block.isVisible && 'opacity-50',
        isDragOverlay && 'shadow-lg ring-2 ring-primary'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{BLOCK_NAMES[block.type]}</span>
          {!block.isVisible && (
            <span className="text-xs text-muted-foreground">(oculto)</span>
          )}
        </div>

        {!isDragOverlay && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleEdit}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleToggleVisibility}
                  >
                    {block.isVisible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {block.isVisible ? 'Ocultar' : 'Mostrar'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisibility}>
                  {block.isVisible ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Mostrar
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminar bloque</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que quieres eliminar este bloque? Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Block content */}
      <div
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleEdit}
      >
        {renderBlockContent()}
      </div>
    </Card>
  );
}
