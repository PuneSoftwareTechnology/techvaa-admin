import { useState, type KeyboardEvent } from 'react'
import { PlusIcon, XIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BulletListInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

/**
 * Edit an ordered list of short strings (bullet points). Type a line and press
 * Enter or "Add"; each entry renders as a removable chip. Used for a course's
 * intro / modules / prerequisites.
 */
export function BulletListInput({
  value,
  onChange,
  placeholder,
}: BulletListInputProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const text = draft.trim()
    if (!text) return
    onChange([...value, text])
    setDraft('')
  }

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Enter a bullet point'}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={add}
          disabled={!draft.trim()}
        >
          <PlusIcon />
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <ul className="space-y-1">
          {value.map((item, i) => (
            <li
              key={`${i}-${item}`}
              className="flex items-center justify-between gap-2 rounded-md border border-input bg-muted/30 px-3 py-1.5 text-sm"
            >
              <span className="min-w-0 break-words">{item}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remove "${item}"`}
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
