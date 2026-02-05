'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { ContentBlock, BlockType } from '@/types/blocks';
import { createBlock, duplicateBlock, reorderBlocks } from './utils/blockFactory';

// State
interface BlockEditorState {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
  isDirty: boolean;
}

// Actions
type BlockEditorAction =
  | { type: 'SET_BLOCKS'; payload: ContentBlock[] }
  | { type: 'ADD_BLOCK'; payload: { blockType: BlockType; afterId?: string } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; data: Partial<ContentBlock['data']> } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'DUPLICATE_BLOCK'; payload: string }
  | { type: 'MOVE_BLOCK'; payload: { activeId: string; overId: string } }
  | { type: 'TOGGLE_VISIBILITY'; payload: string }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'SET_EDITING_BLOCK'; payload: string | null }
  | { type: 'MARK_CLEAN' };

// Reducer
function blockEditorReducer(
  state: BlockEditorState,
  action: BlockEditorAction
): BlockEditorState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return {
        ...state,
        blocks: action.payload,
        isDirty: false,
      };

    case 'ADD_BLOCK': {
      const { blockType, afterId } = action.payload;
      let insertIndex = state.blocks.length;

      if (afterId) {
        const afterIndex = state.blocks.findIndex((b) => b.id === afterId);
        if (afterIndex !== -1) {
          insertIndex = afterIndex + 1;
        }
      }

      const newBlock = createBlock(blockType, insertIndex);
      const newBlocks = [
        ...state.blocks.slice(0, insertIndex),
        newBlock,
        ...state.blocks.slice(insertIndex),
      ];

      return {
        ...state,
        blocks: reorderBlocks(newBlocks),
        selectedBlockId: newBlock.id,
        editingBlockId: newBlock.id,
        isDirty: true,
      };
    }

    case 'UPDATE_BLOCK': {
      const { id, data } = action.payload;
      const newBlocks = state.blocks.map((block) =>
        block.id === id
          ? { ...block, data: { ...block.data, ...data } } as ContentBlock
          : block
      );

      return {
        ...state,
        blocks: newBlocks,
        isDirty: true,
      };
    }

    case 'DELETE_BLOCK': {
      const id = action.payload;
      const newBlocks = state.blocks.filter((block) => block.id !== id);

      return {
        ...state,
        blocks: reorderBlocks(newBlocks),
        selectedBlockId:
          state.selectedBlockId === id ? null : state.selectedBlockId,
        editingBlockId:
          state.editingBlockId === id ? null : state.editingBlockId,
        isDirty: true,
      };
    }

    case 'DUPLICATE_BLOCK': {
      const id = action.payload;
      const blockIndex = state.blocks.findIndex((b) => b.id === id);
      if (blockIndex === -1) return state;

      const originalBlock = state.blocks[blockIndex];
      const duplicated = duplicateBlock(originalBlock, blockIndex + 1);

      const newBlocks = [
        ...state.blocks.slice(0, blockIndex + 1),
        duplicated,
        ...state.blocks.slice(blockIndex + 1),
      ];

      return {
        ...state,
        blocks: reorderBlocks(newBlocks),
        selectedBlockId: duplicated.id,
        isDirty: true,
      };
    }

    case 'MOVE_BLOCK': {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return state;

      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return {
        ...state,
        blocks: reorderBlocks(newBlocks),
        isDirty: true,
      };
    }

    case 'TOGGLE_VISIBILITY': {
      const id = action.payload;
      const newBlocks = state.blocks.map((block) =>
        block.id === id ? { ...block, isVisible: !block.isVisible } : block
      );

      return {
        ...state,
        blocks: newBlocks,
        isDirty: true,
      };
    }

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload,
      };

    case 'SET_EDITING_BLOCK':
      return {
        ...state,
        editingBlockId: action.payload,
        selectedBlockId: action.payload,
      };

    case 'MARK_CLEAN':
      return {
        ...state,
        isDirty: false,
      };

    default:
      return state;
  }
}

// Context
interface BlockEditorContextValue {
  state: BlockEditorState;
  setBlocks: (blocks: ContentBlock[]) => void;
  addBlock: (blockType: BlockType, afterId?: string) => void;
  updateBlock: (id: string, data: Partial<ContentBlock['data']>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (activeId: string, overId: string) => void;
  toggleVisibility: (id: string) => void;
  selectBlock: (id: string | null) => void;
  setEditingBlock: (id: string | null) => void;
  markClean: () => void;
  getBlockById: (id: string) => ContentBlock | undefined;
}

const BlockEditorContext = createContext<BlockEditorContextValue | null>(null);

// Provider
interface BlockEditorProviderProps {
  children: ReactNode;
  initialBlocks?: ContentBlock[];
}

export function BlockEditorProvider({
  children,
  initialBlocks = [],
}: BlockEditorProviderProps) {
  const [state, dispatch] = useReducer(blockEditorReducer, {
    blocks: initialBlocks,
    selectedBlockId: null,
    editingBlockId: null,
    isDirty: false,
  });

  const setBlocks = useCallback((blocks: ContentBlock[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: blocks });
  }, []);

  const addBlock = useCallback((blockType: BlockType, afterId?: string) => {
    dispatch({ type: 'ADD_BLOCK', payload: { blockType, afterId } });
  }, []);

  const updateBlock = useCallback(
    (id: string, data: Partial<ContentBlock['data']>) => {
      dispatch({ type: 'UPDATE_BLOCK', payload: { id, data } });
    },
    []
  );

  const deleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  }, []);

  const duplicateBlockAction = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_BLOCK', payload: id });
  }, []);

  const moveBlock = useCallback((activeId: string, overId: string) => {
    dispatch({ type: 'MOVE_BLOCK', payload: { activeId, overId } });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_VISIBILITY', payload: id });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id });
  }, []);

  const setEditingBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SET_EDITING_BLOCK', payload: id });
  }, []);

  const markClean = useCallback(() => {
    dispatch({ type: 'MARK_CLEAN' });
  }, []);

  const getBlockById = useCallback(
    (id: string) => state.blocks.find((b) => b.id === id),
    [state.blocks]
  );

  const value = useMemo(
    () => ({
      state,
      setBlocks,
      addBlock,
      updateBlock,
      deleteBlock,
      duplicateBlock: duplicateBlockAction,
      moveBlock,
      toggleVisibility,
      selectBlock,
      setEditingBlock,
      markClean,
      getBlockById,
    }),
    [
      state,
      setBlocks,
      addBlock,
      updateBlock,
      deleteBlock,
      duplicateBlockAction,
      moveBlock,
      toggleVisibility,
      selectBlock,
      setEditingBlock,
      markClean,
      getBlockById,
    ]
  );

  return (
    <BlockEditorContext.Provider value={value}>
      {children}
    </BlockEditorContext.Provider>
  );
}

// Hook
export function useBlockEditor() {
  const context = useContext(BlockEditorContext);
  if (!context) {
    throw new Error('useBlockEditor must be used within a BlockEditorProvider');
  }
  return context;
}
