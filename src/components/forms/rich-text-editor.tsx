'use client'

import { useEffect, useState } from 'react'
import {
  useEditor,
  useEditorState,
  EditorContent,
  type Editor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  BoldIcon,
  EyeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  Link2Icon,
  Link2OffIcon,
  ListIcon,
  ListOrderedIcon,
  Loader2Icon,
  PencilIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  /** Current HTML value. */
  value: string
  /** Called with the new HTML (empty string when the editor is visually blank). */
  onChange: (html: string) => void
  placeholder?: string
  /** Forwarded to the wrapper for aria-invalid styling. */
  invalid?: boolean
  id?: string
}

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
}: RichTextEditorProps) {
  const [preview, setPreview] = useState(false)

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
      onChange(editor.getText().trim() === '' ? '' : html)
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

  if (!editor) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-input text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
      </div>
    )
  }

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        invalid && 'border-destructive ring-3 ring-destructive/20',
      )}
    >
      <Toolbar
        editor={editor}
        preview={preview}
        onTogglePreview={() => setPreview((p) => !p)}
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
        <div className="flex-1 overflow-auto">
          <EditorContent editor={editor} id={id} />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-input px-3 py-1.5 text-xs text-muted-foreground">
        <span>{wordCount} word{wordCount === 1 ? '' : 's'}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Toolbar */

interface ToolbarProps {
  editor: Editor
  preview: boolean
  onTogglePreview: () => void
}

function Toolbar({ editor, preview, onTogglePreview }: ToolbarProps) {
  // Subscribe to just the active-state flags we render, so the toolbar re-renders on selection change.
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      paragraph: editor.isActive('paragraph'),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      blockquote: editor.isActive('blockquote'),
      link: editor.isActive('link'),
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
    const { from, to } = editor.state.selection
    if (from === to && !editor.isActive('link')) {
      // No text selected — insert the URL itself as the linked text, otherwise
      // TipTap only sets a stored mark and nothing visible appears.
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: url,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // One button that toggles: add a link when none is active, remove it when one is.
  function toggleLink() {
    if (state.link) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      setLink()
    }
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

      <Btn label="Heading 2" active={state.h2} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2Icon className="size-4" />
      </Btn>
      <Btn label="Heading 3" active={state.h3} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3Icon className="size-4" />
      </Btn>
      <Btn label="Paragraph" active={state.paragraph && !state.h2 && !state.h3} disabled={disabled} onClick={() => editor.chain().focus().setParagraph().run()}>
        <PilcrowIcon className="size-4" />
      </Btn>

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

      <Divider />

      <Btn label={state.link ? 'Remove link' : 'Insert link'} active={state.link} disabled={disabled} onClick={toggleLink}>
        {state.link ? <Link2OffIcon className="size-4" /> : <Link2Icon className="size-4" />}
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

      <Divider />

      <Btn label={preview ? 'Edit' : 'Preview'} active={preview} onClick={onTogglePreview}>
        {preview ? <PencilIcon className="size-4" /> : <EyeIcon className="size-4" />}
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
