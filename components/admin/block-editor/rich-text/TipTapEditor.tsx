'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TipTapToolbar } from './TipTapToolbar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Escribe aquí...',
  className,
  editable = true,
  minHeight = '150px',
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We handle headings separately in HeadingBlock
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none p-3',
          'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2',
          '[&_ul]:list-disc [&_ul]:pl-4',
          '[&_ol]:list-decimal [&_ol]:pl-4',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic',
          '[&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child]:before:text-muted-foreground/50 [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:h-0'
        ),
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return (
    <div
      className={cn(
        'rounded-md border bg-background',
        className
      )}
    >
      {editable && <TipTapToolbar editor={editor} />}
      <div
        style={{ minHeight }}
        className="overflow-auto"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// Read-only version for public display
export function TipTapContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2',
        '[&_ul]:list-disc [&_ul]:pl-4',
        '[&_ol]:list-decimal [&_ol]:pl-4',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_a]:text-primary [&_a]:underline',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
