'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onOpenAiAssistant?: () => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  onOpenAiAssistant,
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[180px] p-4 text-slate-800 leading-relaxed font-sans',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content updates (e.g. from AI insertion)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="min-h-[220px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loading Academic Rich Text Editor...
      </div>
    );
  }

  const insertCallout = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        '<blockquote><strong>💡 Exam Note / High-Yield Rule:</strong> Be sure to memorize the boundary conditions and SI units!</blockquote><p></p>'
      )
      .run();
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs focus-within:border-brand-indigo/60 focus-within:ring-2 focus-within:ring-brand-indigo/10 transition-all',
        className
      )}
    >
      {/* Editorial Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50/90 border-b border-slate-200 text-slate-700">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('heading', { level: 1 }) && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('heading', { level: 2 }) && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('heading', { level: 3 }) && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Text Styling */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('bold') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('italic') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('strike') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('code') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Inline Formula / Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('bulletList') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('orderedList') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer',
              editor.isActive('blockquote') && 'bg-brand-indigo text-white hover:bg-brand-indigoHover'
            )}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={insertCallout}
            className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
            title="Insert Exam Tip Callout"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
            title="Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* AI & History Controls */}
        <div className="flex items-center gap-1">
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-brand-indigo text-xs font-bold border border-indigo-200/80 transition-colors cursor-pointer"
              title="Open Gemini AI Lesson Assistant"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
              <span>AI Co-Pilot</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Redo"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Content Surface */}
      <div className="bg-white min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
