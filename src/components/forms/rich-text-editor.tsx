'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  useEditor,
  useEditorState,
  EditorContent,
  type Editor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color, FontSize } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  EraserIcon,
  EyeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  Link2OffIcon,
  ListIcon,
  ListOrderedIcon,
  Loader2Icon,
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  PaletteIcon,
  PencilIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  TableIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useImageUpload } from '@/hooks/use-image-upload'
import type { UploadFolder } from '@/lib/upload-folders'

interface RichTextEditorProps {
  /** Current HTML value. */
  value: string
  /** Called with the new HTML (empty string when the editor is visually blank). */
  onChange: (html: string) => void
  placeholder?: string
  /** Forwarded to the wrapper for aria-invalid styling. */
  invalid?: boolean
  id?: string
  /** When set, the image button uploads to S3 under this folder; otherwise it prompts for a URL. */
  uploadFolder?: UploadFolder
  /** Slug used to group S3 uploads (paired with `uploadFolder`). */
  uploadSlug?: string
}

const TEXT_COLORS = [
  '#0f172a', '#dc2626', '#ea580c', '#ca8a04',
  '#16a34a', '#0891b2', '#2563eb', '#7c3aed',
]
const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8',
  '#fed7aa', '#e9d5ff', '#fecaca', '#d1d5db',
]
const FONT_SIZES = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '' },
  { label: 'Large', value: '1.25rem' },
  { label: 'Huge', value: '1.875rem' },
]

/**
 * Reusable WYSIWYG rich text editor (TipTap). Outputs sanitised-on-render HTML
 * that the public website displays inside a `prose` container. Shared across the
 * course / blog / FAQ forms — see `RichTextContent` on the website for the
 * matching renderer.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  invalid,
  id,
  uploadFolder,
  uploadSlug,
}: RichTextEditorProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const [preview, setPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const upload = useImageUpload()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-lg' } }),
      TableKit.configure({ table: { resizable: true } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write something…' }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none min-h-40 px-3 py-2 focus:outline-none',
          'prose-headings:font-semibold prose-a:text-primary',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(editor.getText().trim() === '' && !/<(img|hr|table)\b/i.test(html) ? '' : html)
    },
  })

  // Sync when the form loads async defaults (edit mode) after the editor mounts.
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || '<p></p>'
    if (next !== current && !editor.isFocused) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  // Lock body scroll while in fullscreen.
  useEffect(() => {
    if (!fullscreen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [fullscreen])

  if (!editor) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-input text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
      </div>
    )
  }

  function insertImage(url: string) {
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  function handleImageButton() {
    if (uploadFolder) {
      fileInputRef.current?.click()
    } else {
      const url = window.prompt('Image URL')
      if (url) insertImage(url)
    }
  }

  function handleFile(file: File | undefined) {
    if (!file || !uploadFolder) return
    upload.mutate(
      { file, folder: uploadFolder, slug: uploadSlug || 'misc' },
      { onSuccess: (url) => insertImage(url) },
    )
  }

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        invalid && 'border-destructive ring-3 ring-destructive/20',
        fullscreen && 'fixed inset-0 z-50 rounded-none bg-background',
      )}
    >
      <Toolbar
        editor={editor}
        onImage={handleImageButton}
        imageUploading={upload.isPending}
        preview={preview}
        onTogglePreview={() => setPreview((p) => !p)}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((f) => !f)}
      />

      {preview ? (
        <div className="flex-1 overflow-auto">
          <div
            className="prose prose-sm max-w-none px-3 py-2"
            // Preview only — the website sanitises before render.
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        </div>
      ) : (
        <div className={cn('flex-1 overflow-auto', fullscreen && 'h-full')}>
          <EditorContent editor={editor} id={id} />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-input px-3 py-1.5 text-xs text-muted-foreground">
        <span>{wordCount} word{wordCount === 1 ? '' : 's'}</span>
        {fullscreen && <span>Press the collapse icon to exit full screen</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ Toolbar */

interface ToolbarProps {
  editor: Editor
  onImage: () => void
  imageUploading: boolean
  preview: boolean
  onTogglePreview: () => void
  fullscreen: boolean
  onToggleFullscreen: () => void
}

function Toolbar({
  editor,
  onImage,
  imageUploading,
  preview,
  onTogglePreview,
  fullscreen,
  onToggleFullscreen,
}: ToolbarProps) {
  // Subscribe to just the active-state flags we render, so the toolbar re-renders on selection change.
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      h1: editor.isActive('heading', { level: 1 }),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      paragraph: editor.isActive('paragraph'),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      blockquote: editor.isActive('blockquote'),
      link: editor.isActive('link'),
      left: editor.isActive({ textAlign: 'left' }),
      center: editor.isActive({ textAlign: 'center' }),
      right: editor.isActive({ textAlign: 'right' }),
      justify: editor.isActive({ textAlign: 'justify' }),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const disabled = preview

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/40 p-1">
      <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo || disabled}>
        <UndoIcon className="size-4" />
      </Btn>
      <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo || disabled}>
        <RedoIcon className="size-4" />
      </Btn>

      <Divider />

      <Btn label="Heading 1" active={state.h1} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1Icon className="size-4" />
      </Btn>
      <Btn label="Heading 2" active={state.h2} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2Icon className="size-4" />
      </Btn>
      <Btn label="Heading 3" active={state.h3} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3Icon className="size-4" />
      </Btn>
      <Btn label="Paragraph" active={state.paragraph && !state.h1 && !state.h2 && !state.h3} disabled={disabled} onClick={() => editor.chain().focus().setParagraph().run()}>
        <PilcrowIcon className="size-4" />
      </Btn>

      <FontSizeSelect editor={editor} disabled={disabled} />

      <Divider />

      <Btn label="Bold" active={state.bold} disabled={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon className="size-4" />
      </Btn>
      <Btn label="Italic" active={state.italic} disabled={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon className="size-4" />
      </Btn>
      <Btn label="Underline" active={state.underline} disabled={disabled} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="size-4" />
      </Btn>
      <Btn label="Strikethrough" active={state.strike} disabled={disabled} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughIcon className="size-4" />
      </Btn>

      <ColorPopover
        label="Text color"
        icon={<PaletteIcon className="size-4" />}
        colors={TEXT_COLORS}
        disabled={disabled}
        onPick={(c) => editor.chain().focus().setColor(c).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />
      <ColorPopover
        label="Highlight"
        icon={<HighlighterIcon className="size-4" />}
        colors={HIGHLIGHT_COLORS}
        disabled={disabled}
        onPick={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
        onClear={() => editor.chain().focus().unsetHighlight().run()}
      />

      <Divider />

      <Btn label={state.link ? 'Edit link' : 'Insert link'} active={state.link} disabled={disabled} onClick={setLink}>
        <Link2Icon className="size-4" />
      </Btn>
      <Btn label="Remove link" disabled={!state.link || disabled} onClick={() => editor.chain().focus().unsetLink().run()}>
        <Link2OffIcon className="size-4" />
      </Btn>
      <Btn label="Insert image" disabled={disabled || imageUploading} onClick={onImage}>
        {imageUploading ? <Loader2Icon className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
      </Btn>
      <Btn label="Insert table" disabled={disabled} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <TableIcon className="size-4" />
      </Btn>

      <Divider />

      <Btn label="Bullet list" active={state.bulletList} disabled={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <ListIcon className="size-4" />
      </Btn>
      <Btn label="Numbered list" active={state.orderedList} disabled={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrderedIcon className="size-4" />
      </Btn>
      <Btn label="Quote" active={state.blockquote} disabled={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <QuoteIcon className="size-4" />
      </Btn>
      <Btn label="Code block" active={state.code} disabled={disabled} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <CodeIcon className="size-4" />
      </Btn>
      <Btn label="Horizontal line" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <MinusIcon className="size-4" />
      </Btn>

      <Divider />

      <Btn label="Align left" active={state.left} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeftIcon className="size-4" />
      </Btn>
      <Btn label="Align center" active={state.center} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenterIcon className="size-4" />
      </Btn>
      <Btn label="Align right" active={state.right} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRightIcon className="size-4" />
      </Btn>
      <Btn label="Justify" active={state.justify} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <AlignJustifyIcon className="size-4" />
      </Btn>

      <Divider />

      <Btn label="Clear formatting" disabled={disabled} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <EraserIcon className="size-4" />
      </Btn>
      <Btn label={preview ? 'Edit' : 'Preview'} active={preview} onClick={onTogglePreview}>
        {preview ? <PencilIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Btn>
      <Btn label={fullscreen ? 'Exit full screen' : 'Full screen'} active={fullscreen} onClick={onToggleFullscreen}>
        {fullscreen ? <MinimizeIcon className="size-4" /> : <MaximizeIcon className="size-4" />}
      </Btn>
    </div>
  )
}

/* -------------------------------------------------------------- Primitives */

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden="true" />
}

function ColorPopover({
  label,
  icon,
  colors,
  disabled,
  onPick,
  onClear,
}: {
  label: string
  icon: React.ReactNode
  colors: string[]
  disabled?: boolean
  onPick: (color: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Btn label={label} disabled={disabled} active={open} onClick={() => setOpen((o) => !o)}>
        {icon}
      </Btn>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-9 z-20 w-40 rounded-lg border border-input bg-popover p-2 shadow-md">
            <div className="grid grid-cols-4 gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => {
                    onPick(c)
                    setOpen(false)
                  }}
                  className="size-6 rounded-md border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                onClear()
                setOpen(false)
              }}
              className="mt-2 w-full rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function FontSizeSelect({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const selectId = useId()
  const current = (editor.getAttributes('textStyle').fontSize as string) ?? ''
  return (
    <select
      id={selectId}
      title="Font size"
      aria-label="Font size"
      disabled={disabled}
      value={current}
      onChange={(e) => {
        const v = e.target.value
        if (v) editor.chain().focus().setFontSize(v).run()
        else editor.chain().focus().unsetFontSize().run()
      }}
      className="ml-1 h-8 rounded-md border border-input bg-transparent px-1.5 text-xs outline-none focus-visible:border-ring disabled:opacity-40"
    >
      {FONT_SIZES.map((f) => (
        <option key={f.label} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  )
}
