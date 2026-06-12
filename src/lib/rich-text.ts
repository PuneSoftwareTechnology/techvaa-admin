import { z } from 'zod'

/**
 * The rich text editor stores its content as HTML. These helpers let us reason
 * about the *visible* text inside that HTML so validation and "is it empty?"
 * checks behave like a plain textarea would.
 */

/** Strip tags/entities to get the plain visible text (rough, good enough for length checks). */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when the HTML has no visible text and no media (e.g. TipTap's empty `<p></p>`). */
export function isHtmlEmpty(html: string | undefined | null): boolean {
  if (!html) return true
  if (/<(img|hr|table|iframe)\b/i.test(html)) return false
  return htmlToText(html).length === 0
}

/**
 * Zod schema for a required rich-text field. Validates against the visible text
 * length rather than the raw HTML, so `<p></p>` counts as empty.
 */
export function requiredRichText(min: number, message: string) {
  return z
    .string()
    .refine((value) => htmlToText(value).length >= min, { message })
}

/** Zod schema for an optional rich-text field (empty string allowed). */
export function optionalRichText() {
  return z.string().optional().or(z.literal(''))
}
