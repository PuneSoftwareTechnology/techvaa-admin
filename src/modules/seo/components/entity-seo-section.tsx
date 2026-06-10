import type { UseFormRegister, FieldErrors } from 'react-hook-form'

import { ROBOTS_DIRECTIVES } from '@/types/domain'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EntitySeoValues } from '../validations/entity-seo.schema'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EntitySeoSectionProps {
  /** The parent form's register, bound to its values (fields live under `seo.`). */
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  robots: EntitySeoValues['robots']
  onRobotsChange: (value: EntitySeoValues['robots']) => void
  /** Hide the meta-description field when the parent form surfaces it elsewhere. */
  hideMetaDescription?: boolean
}

/**
 * Optional per-entity SEO override, embedded at the bottom of the course/blog
 * forms. Blank fields = the public page auto-derives meta from the content, so
 * the author only fills this in to override a specific page.
 */
export function EntitySeoSection({
  register,
  errors,
  robots,
  onRobotsChange,
  hideMetaDescription = false,
}: EntitySeoSectionProps) {
  const seoErrors = (errors.seo ?? {}) as Record<
    string,
    { message?: string } | undefined
  >

  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <h3 className="text-sm font-medium text-foreground">SEO (optional)</h3>
        <p className="text-xs text-muted-foreground">
          Leave blank to auto-generate meta tags from the title, description and
          image. Fill in to override.
        </p>
      </div>

      <Field label="Meta title" htmlFor="seo-metaTitle" error={seoErrors.metaTitle?.message}>
        <Input id="seo-metaTitle" {...register('seo.metaTitle')} />
      </Field>

      {!hideMetaDescription && (
        <Field
          label="Meta description"
          htmlFor="seo-metaDescription"
          error={seoErrors.metaDescription?.message}
        >
          <Textarea id="seo-metaDescription" rows={3} {...register('seo.metaDescription')} />
        </Field>
      )}

      <Field
        label="Keywords"
        htmlFor="seo-keywords"
        hint="Comma-separated"
        error={seoErrors.keywords?.message}
      >
        <Input id="seo-keywords" placeholder="SAP FICO, S/4HANA, …" {...register('seo.keywords')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Canonical URL" htmlFor="seo-canonicalUrl" error={seoErrors.canonicalUrl?.message}>
          <Input id="seo-canonicalUrl" {...register('seo.canonicalUrl')} />
        </Field>
        <Field label="OG image URL" htmlFor="seo-ogImage" error={seoErrors.ogImage?.message}>
          <Input id="seo-ogImage" {...register('seo.ogImage')} />
        </Field>
      </div>

      <Field label="Robots" error={seoErrors.robots?.message}>
        <Select value={robots} onValueChange={(v) => onRobotsChange(v as EntitySeoValues['robots'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROBOTS_DIRECTIVES.map((r) => (
              <SelectItem key={r} value={r}>
                {r.replace('_', ', ').toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
