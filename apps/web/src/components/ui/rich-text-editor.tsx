'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  CheckSquare,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  Upload,
  Maximize2,
  Minimize2,
  Lightbulb,
  AlertTriangle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from './modal';

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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Image Upload Modal State
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageTab, setImageTab] = React.useState<'upload' | 'url'>('upload');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');

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
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-indigo underline font-medium hover:text-brand-indigoHover',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-sm sm:prose max-w-none focus:outline-none min-h-[260px] p-5 text-slate-800 leading-relaxed font-sans',
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
      <div className="min-h-[260px] rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loading Professional Academic Editor...
      </div>
    );
  }

  // Word count and reading time
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Handle Image Upload from Disk
  const handleLocalImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmInsertImage = () => {
    if (!imageUrl) {
      alert('Please select an image file or provide an image URL.');
      return;
    }
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt || 'Lecture Diagram' })
      .run();

    setImageModalOpen(false);
    setImageUrl('');
    setImageAlt('');
    setImagePreview(null);
  };

  // Handle Link Insert
  const handleConfirmInsertLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}` })
        .run();
    }
    setLinkModalOpen(false);
    setLinkUrl('');
  };

  // Callouts
  const insertTipCallout = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="callout-tip">
          <p><strong>💡 Key High-Yield Concept / Exam Rule:</strong></p>
          <p>Highlight the governing principles, conditions, and past-paper patterns here.</p>
        </div><p></p>`
      )
      .run();
  };

  const insertWarningCallout = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="callout-warning">
          <p><strong>⚠️ Common Exam Trap / Examiner Pitfall:</strong></p>
          <p>Watch out for negative signs, unit conversions (cm to m), and trigonometric angle conventions.</p>
        </div><p></p>`
      )
      .run();
  };

  const insertFormulaCallout = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="callout-formula">
          <p><strong>📝 High-Yield Formula Derivation:</strong></p>
          <p><code>Equation: R = (v^2 * sin(2θ)) / g</code></p>
          <p>Applies when launch height equals landing elevation in uniform gravitational fields.</p>
        </div><p></p>`
      )
      .run();
  };

  // Table Insert
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all',
        isFullscreen
          ? 'fixed inset-4 z-50 flex flex-col shadow-2xl border-indigo-300'
          : 'focus-within:border-brand-indigo/60 focus-within:ring-2 focus-within:ring-brand-indigo/10',
        className
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 text-xs">Academic Lecture Editor</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-mono text-slate-500">
            {wordCount} words • ~{readTimeMinutes} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-brand-indigo text-xs font-bold border border-indigo-200/80 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
              <span>Gemini AI Co-Pilot</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Distraction-Free'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/90 border-b border-slate-200 text-slate-700">
        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('paragraph') && 'bg-brand-indigo text-white'
            )}
            title="Normal Paragraph"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('heading', { level: 1 }) && 'bg-brand-indigo text-white'
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('heading', { level: 2 }) && 'bg-brand-indigo text-white'
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('heading', { level: 3 }) && 'bg-brand-indigo text-white'
            )}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
        </div>

        {/* Basic Text Styling */}
        <div className="flex items-center gap-0.5 px-1 border-r border-slate-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('bold') && 'bg-brand-indigo text-white'
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('italic') && 'bg-brand-indigo text-white'
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('underline') && 'bg-brand-indigo text-white'
            )}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('strike') && 'bg-brand-indigo text-white'
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('code') && 'bg-brand-indigo text-white'
            )}
            title="Inline Formula / Code"
          >
            <Code className="h-4 w-4" />
          </button>

          {/* Subscript & Superscript (Vital for Physics & Chemistry) */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('subscript') && 'bg-brand-indigo text-white'
            )}
            title="Subscript (e.g. H₂O)"
          >
            <SubscriptIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
              editor.isActive('superscript') && 'bg-brand-indigo text-white'
            )}
            title="Superscript (e.g. x², 10⁵)"
          >
            <SuperscriptIcon className="h-4 w-4" />
          </button>

          {/* High-Yield Highlight */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            className={cn(
              'p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer',
              editor.isActive('highlight') && 'bg-amber-200 text-amber-900'
            )}
            title="Highlight High-Yield Text"
          >
            <Highlighter className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-1 border-r border-slate-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive({ textAlign: 'left' }) && 'bg-brand-indigo text-white'
            )}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive({ textAlign: 'center' }) && 'bg-brand-indigo text-white'
            )}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive({ textAlign: 'right' }) && 'bg-brand-indigo text-white'
            )}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive({ textAlign: 'justify' }) && 'bg-brand-indigo text-white'
            )}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Lists & Tasks */}
        <div className="flex items-center gap-0.5 px-1 border-r border-slate-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('bulletList') && 'bg-brand-indigo text-white'
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('orderedList') && 'bg-brand-indigo text-white'
            )}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('taskList') && 'bg-brand-indigo text-white'
            )}
            title="Interactive Task List / Checklist"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('blockquote') && 'bg-brand-indigo text-white'
            )}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>

        {/* IMAGE UPLOAD & INSERT BUTTON (HIGHLIGHTED) */}
        <div className="flex items-center gap-1 px-1 border-r border-slate-200">
          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer shadow-xs"
            title="Upload or Insert Diagram / Image"
          >
            <ImageIcon className="h-4 w-4 text-emerald-700" />
            <span>+ Add Image</span>
          </button>

          {/* Table Inserter */}
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            title="Insert 3x3 Table"
          >
            <TableIcon className="h-4 w-4" />
          </button>

          {/* Link Inserter */}
          <button
            type="button"
            onClick={() => setLinkModalOpen(true)}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              editor.isActive('link') && 'bg-brand-indigo text-white'
            )}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Academic Callout Boxes */}
        <div className="flex items-center gap-1 px-1 border-r border-slate-200">
          <button
            type="button"
            onClick={insertTipCallout}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-[11px] font-bold transition-colors cursor-pointer"
            title="Insert Concept Tip Box"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Rule</span>
          </button>

          <button
            type="button"
            onClick={insertWarningCallout}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 text-[11px] font-bold transition-colors cursor-pointer"
            title="Insert Exam Trap / Pitfall Box"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Pitfall</span>
          </button>

          <button
            type="button"
            onClick={insertFormulaCallout}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
            title="Insert Formula Sheet Callout"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Formula</span>
          </button>
        </div>

        {/* History / Clear */}
        <div className="flex items-center gap-0.5 ml-auto">
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

      {/* Editor Content Canvas */}
      <div className={cn('bg-white overflow-y-auto', isFullscreen ? 'flex-1' : 'min-h-[280px]')}>
        <EditorContent editor={editor} />
      </div>

      {/* ================= MODAL: INSERT / UPLOAD IMAGE ================= */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setImagePreview(null);
        }}
        title="Insert Academic Diagram or Image"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Tabs: Upload from Device vs Image URL */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setImageTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                imageTab === 'upload'
                  ? 'bg-brand-indigo text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📁 Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setImageTab('url')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                imageTab === 'url'
                  ? 'bg-brand-indigo text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🔗 Web Image Link
            </button>
          </div>

          {/* Tab 1: Upload from Device */}
          {imageTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLocalImageSelect}
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-indigo bg-slate-50 hover:bg-indigo-50/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-50 text-brand-indigo flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to select diagram or lecture illustration
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PNG, JPG, WebP, GIF, SVG (Up to 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-video max-h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                  >
                    Choose Different Image
                  </button>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Image Caption / Alt Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1.2: Projectile trajectory curve at 45 degrees"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Web Image Link */}
          {imageTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Direct Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Image Caption / Alt Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solved Circuit Diagram with Kirchhoff Law"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setImageModalOpen(false);
                setImagePreview(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmInsertImage}
              className="px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Insert Image into Lecture
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL: INSERT LINK ================= */}
      <Modal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Insert Hyperlink"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Link URL</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmInsertLink}
              className="px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Apply Link
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
