'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { FontSize } from './font-size-extension';
import { Indent, LineHeight } from './editor-extensions';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Unlink,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Image as ImageIcon,
  Loader2, UnderlineIcon, Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon, Minus, Highlighter, Link2,
  Indent as IndentIcon, Outdent as OutdentIcon, WrapText,
} from 'lucide-react';
import { useCallback, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  /** Si es true, muestra una altura mayor (ideal para páginas completas como Studio) */
  fullPage?: boolean;
}

const FONTS = [
  { name: 'Predeterminada', value: 'inherit' },
  { name: 'Sans Serif (Moderna)', value: 'var(--font-sans), sans-serif' },
  { name: 'Serif (Elegante)', value: 'var(--font-serif), serif' },
  { name: 'Monospace (Máquina)', value: 'monospace' },
  { name: 'Cursive (Firma)', value: 'cursive' },
];

const FONT_SIZES = [
  { name: 'Pred.', value: 'inherit' },
  { name: '10px', value: '10px' },
  { name: '12px', value: '12px' },
  { name: '14px', value: '14px' },
  { name: '16px', value: '16px' },
  { name: '18px', value: '18px' },
  { name: '20px', value: '20px' },
  { name: '24px', value: '24px' },
  { name: '30px', value: '30px' },
  { name: '36px', value: '36px' },
  { name: '48px', value: '48px' },
  { name: '64px', value: '64px' },
];

const LINE_HEIGHTS = [
  { name: 'Normal', value: 'normal' },
  { name: '0.5', value: '0.5' },
  { name: '0.8', value: '0.8' },
  { name: '0.9', value: '0.9' },
  { name: '1.0', value: '1' },
  { name: '1.15', value: '1.15' },
  { name: '1.5', value: '1.5' },
  { name: '2.0', value: '2' },
  { name: '2.5', value: '2.5' },
];

// Colores rápidos para el picker de texto (múltiplos de 8 para la grilla)
const QUICK_TEXT_COLORS = [
  '#000000', '#1F2937', '#4B5563', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#F9FAFB', '#FFFFFF', // Grises/Neutros
  '#7F1D1D', '#991B1B', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', // Rojos
  '#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', // Naranjas/Amarillos
  '#14532D', '#166534', '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', // Verdes
  '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', // Azules
  '#4C1D95', '#5B21B6', '#6D28D9', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', // Morados
  '#831843', '#9D174D', '#BE185D', '#DB2777', '#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8', // Rosas
];

// Colores rápidos para resaltado (múltiplos de 8 para la grilla)
const QUICK_HIGHLIGHT_COLORS = [
  'transparent', '#FEE2E2', '#FFEDD5', '#FEF9C3', '#DCFCE7', '#E0F2FE', '#F3E8FF', '#FCE7F3', // Muy Claros
  '#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#7DD3FC', '#D8B4FE', '#F9A8D4', '#D1D5DB', // Claros
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#0EA5E9', '#A855F7', '#EC4899', '#6B7280', // Normales
  '#B91C1C', '#C2410C', '#A16207', '#15803D', '#0369A1', '#7E22CE', '#BE185D', '#374151', // Oscuros
];

// Separador vertical de la toolbar
function Sep() {
  return <div className="w-px h-6 bg-border mx-0.5 flex-shrink-0" />;
}

// Botón de toolbar con tooltip
function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded-md text-sm transition-colors flex-shrink-0',
        'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary',
        active ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

// Popover de colores
function ColorPickerPopover({
  colors,
  currentColor,
  onColorSelect,
  allowCustom,
  trigger,
}: {
  colors: string[];
  currentColor?: string;
  onColorSelect: (color: string) => void;
  allowCustom?: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-md transition-colors flex-shrink-0',
          'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary',
          open ? 'bg-muted' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {trigger}
      </button>

      {open && (
        <div className="absolute top-9 left-0 z-50 p-2 bg-popover border rounded-lg shadow-xl w-64 max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-8 gap-1 mb-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                title={color === 'transparent' ? 'Sin color' : color}
                onClick={() => {
                  onColorSelect(color);
                  setOpen(false);
                }}
                className={cn(
                  'w-6 h-6 rounded-sm border border-border/50 transition-transform hover:scale-110',
                  color === currentColor && 'ring-2 ring-primary ring-offset-1',
                  color === 'transparent' && 'bg-transparent border-dashed',
                )}
                style={color !== 'transparent' ? { backgroundColor: color } : {}}
              />
            ))}
          </div>
          {allowCustom && (
            <div className="flex items-center gap-2 pt-1 border-t mt-2">
              <label className="text-xs text-muted-foreground">Personalizado:</label>
              <input
                type="color"
                defaultValue={currentColor && currentColor !== 'transparent' ? currentColor : '#000000'}
                onChange={(e) => onColorSelect(e.target.value)}
                className="w-12 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Modal para insertar imagen por URL
function ImageUrlModal({
  onInsert,
  onClose,
}: {
  onInsert: (src: string, alt?: string, width?: string) => void;
  onClose: () => void;
}) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('100%');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl border shadow-2xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Insertar imagen por URL</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">URL de la imagen *</label>
            <input
              autoFocus
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Texto alternativo (alt)</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Descripción de la imagen"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Ancho</label>
            <select
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="100%">100% (completo)</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
              <option value="25%">25%</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            type="button"
            size="sm"
            disabled={!src.trim()}
            onClick={() => {
              if (src.trim()) {
                onInsert(src.trim(), alt || undefined, width);
                onClose();
              }
            }}
          >
            Insertar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RichTextEditor({ content, onChange, placeholder, className, fullPage }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Indent,
      LineHeight,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto my-2',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'rich-content focus:outline-none p-4',
          fullPage ? 'min-h-[700px]' : 'min-h-[350px]',
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (content !== currentHtml && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    const toastId = toast.loading('Subiendo imagen...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await api.post<any>('/upload/image', formData);
      const urlId = data.url || data.cloudinaryId;

      const fullUrl = urlId.startsWith('http')
        ? urlId
        : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${urlId}`;

      editor.chain().focus().setImage({ src: fullUrl }).run();
      toast.success('Imagen insertada correctamente', { id: toastId });
    } catch (err) {
      console.error('Failed to upload image', err);
      toast.error('Error al subir la imagen. Por favor, intenta de nuevo.', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInsertImageUrl = (src: string, alt?: string, width?: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({
      src,
      alt: alt || '',
      // @ts-ignore - width is a custom attribute passed via HTMLAttributes
      width: width || '100%',
    }).run();
  };

  if (!editor) return null;

  const currentTextColor = editor.getAttributes('textStyle').color;
  const currentHighlight = editor.getAttributes('highlight').color;

  return (
    <>
      {showUrlModal && (
        <ImageUrlModal
          onInsert={handleInsertImageUrl}
          onClose={() => setShowUrlModal(false)}
        />
      )}

      <div className={cn('flex flex-col border rounded-lg bg-background', className)}>
        {/* ─── Toolbar ─── */}
        <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5 bg-muted/40 sticky top-0 z-10 rounded-t-[7px]">

          {/* Grupo: Formato básico */}
          <ToolBtn title="Negrita (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Cursiva (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Subrayado (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Tachado" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Superíndice" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            <SuperscriptIcon className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Subíndice" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            <SubscriptIcon className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Color de texto */}
          <ColorPickerPopover
            colors={QUICK_TEXT_COLORS}
            currentColor={currentTextColor}
            allowCustom
            onColorSelect={(color) => {
              editor.chain().focus().setColor(color).run();
            }}
            trigger={
              <span className="flex flex-col items-center justify-center w-full h-full gap-0.5">
                <span className="font-bold text-xs leading-none" style={{ color: currentTextColor || 'currentColor' }}>A</span>
                <span className="w-4 h-1 rounded-full" style={{ backgroundColor: currentTextColor || '#000' }} />
              </span>
            }
          />

          {/* Grupo: Color de resaltado */}
          <ColorPickerPopover
            colors={QUICK_HIGHLIGHT_COLORS}
            currentColor={currentHighlight}
            allowCustom
            onColorSelect={(color) => {
              if (color === 'transparent') {
                editor.chain().focus().unsetHighlight().run();
              } else {
                editor.chain().focus().setHighlight({ color }).run();
              }
            }}
            trigger={
              <span className="flex flex-col items-center justify-center w-full h-full gap-0.5">
                <Highlighter className="h-3.5 w-3.5" />
                <span
                  className="w-4 h-1 rounded-full border border-border/50"
                  style={{ backgroundColor: currentHighlight || '#FEF08A' }}
                />
              </span>
            }
          />

          <Sep />

          {/* Grupo: Fuente y tamaño */}
          <select
            id="fontFamily"
            name="fontFamily"
            title="Fuente"
            className="h-8 px-1.5 text-xs bg-transparent border border-input rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary max-w-[120px] flex-shrink-0"
            onChange={(e) => {
              if (e.target.value === 'inherit') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            value={editor.getAttributes('textStyle').fontFamily || 'inherit'}
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>

          <select
            id="fontSize"
            name="fontSize"
            title="Tamaño"
            className="h-8 px-1.5 text-xs bg-transparent border border-input rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary max-w-[70px] flex-shrink-0"
            onChange={(e) => {
              if (e.target.value === 'inherit') {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(e.target.value).run();
              }
            }}
            value={editor.getAttributes('textStyle').fontSize || 'inherit'}
          >
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>{size.name}</option>
            ))}
          </select>

          <select
            id="lineHeight"
            name="lineHeight"
            title="Espaciado (Interlineado)"
            className="h-8 px-1.5 text-xs bg-transparent border border-input rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary max-w-[80px] flex-shrink-0"
            onChange={(e) => {
              if (e.target.value === 'normal') {
                editor.chain().focus().unsetLineHeight().run();
              } else {
                editor.chain().focus().setLineHeight(e.target.value).run();
              }
            }}
            value={editor.getAttributes('textStyle').lineHeight || 'normal'}
          >
            {LINE_HEIGHTS.map((lh) => (
              <option key={lh.value} value={lh.value}>{lh.name}</option>
            ))}
          </select>

          <Sep />

          {/* Grupo: Sangría */}
          <ToolBtn title="Reducir sangría (Shift+Tab)" onClick={() => editor.chain().focus().outdent().run()}>
            <OutdentIcon className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Aumentar sangría (Tab)" onClick={() => editor.chain().focus().indent().run()}>
            <IndentIcon className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Alineación */}
          <ToolBtn title="Alinear izquierda" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Centrar" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Alinear derecha" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Justificar" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <AlignJustify className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Encabezados */}
          <ToolBtn title="Encabezado 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Encabezado 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Encabezado 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Listas y bloques */}
          <ToolBtn title="Lista de viñetas" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Separador horizontal" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Enlace */}
          <ToolBtn title="Insertar / editar enlace" active={editor.isActive('link')} onClick={setLink}>
            <LinkIcon className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Quitar enlace" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
            <Unlink className="h-4 w-4" />
          </ToolBtn>

          <Sep />

          {/* Grupo: Imágenes */}
          <ToolBtn
            title="Subir imagen desde archivo"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </ToolBtn>
          <ToolBtn
            title="Insertar imagen por URL"
            onClick={() => setShowUrlModal(true)}
          >
            <Link2 className="h-4 w-4" />
          </ToolBtn>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Spacer + Deshacer/Rehacer */}
          <div className="flex-1" />
          <ToolBtn title="Deshacer (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn title="Rehacer (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="h-4 w-4" />
          </ToolBtn>
        </div>

        {/* ─── Área de edición ─── */}
        <EditorContent
          editor={editor}
          className="cursor-text bg-background flex-1"
          onClick={() => editor.commands.focus()}
        />
      </div>
    </>
  );
}
