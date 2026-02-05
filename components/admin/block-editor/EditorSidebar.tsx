'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockPalette } from './BlockPalette';
import { useBlockEditor } from './BlockEditorContext';
import { BLOCK_NAMES } from '@/types/blocks';
import { getBlockIcon } from './utils/blockIcons';
import { Layers, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function EditorSidebar() {
  const { state, selectBlock, setEditingBlock } = useBlockEditor();
  const { blocks, selectedBlockId } = state;

  return (
    <div className="h-full flex flex-col border-l bg-muted/30">
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b h-11 bg-transparent p-0">
          <TabsTrigger
            value="blocks"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Bloques
          </TabsTrigger>
          <TabsTrigger
            value="structure"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full"
          >
            <Layers className="h-4 w-4 mr-1.5" />
            Estructura
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="flex-1 m-0 overflow-hidden">
          <BlockPalette />
        </TabsContent>

        <TabsContent value="structure" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-1">
              {blocks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay bloques todavía.
                  <br />
                  Arrastra bloques desde la pestaña &quot;Bloques&quot;.
                </p>
              ) : (
                blocks.map((block) => {
                  const Icon = getBlockIcon(block.type);
                  return (
                    <button
                      key={block.id}
                      onClick={() => {
                        selectBlock(block.id);
                        setEditingBlock(block.id);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                        'hover:bg-accent transition-colors text-left',
                        selectedBlockId === block.id && 'bg-accent',
                        !block.isVisible && 'opacity-50'
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate flex-1">
                        {BLOCK_NAMES[block.type]}
                      </span>
                      {!block.isVisible && (
                        <span className="text-xs text-muted-foreground">
                          (oculto)
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
