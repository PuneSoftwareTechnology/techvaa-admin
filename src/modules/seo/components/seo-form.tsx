import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ROBOTS_DIRECTIVES } from '@/types/domain'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  seoSchema,
  SEO_DEFAULTS,
  type SeoFormValues,
} from '../validations/seo.schema'

interface SeoFormProps {
  formId: string
  defaultValues?: SeoFormValues
  onSubmit: (values: SeoFormValues) => void
}

export function SeoForm({ formId, defaultValues, onSubmit }: SeoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: defaultValues ?? SEO_DEFAULTS,
  })

  const titleLen = watch('metaTitle')?.length ?? 0
  const descLen = watch('metaDescription')?.length ?? 0

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Page" htmlFor="page" required error={errors.page?.message}>
          <Input id="page" {...register('page')} />
        </Field>
        <Field label="Path" htmlFor="path" required hint="e.g. /courses" error={errors.path?.message}>
          <Input id="path" {...register('path')} />
        </Field>
      </div>

      <Field
        label={`Meta title (${titleLen}/70)`}
        htmlFor="metaTitle"
        required
        error={errors.metaTitle?.message}
      >
        <Input id="metaTitle" {...register('metaTitle')} />
      </Field>

      <Field
        label={`Meta description (${descLen}/160)`}
        htmlFor="metaDescription"
        required
        error={errors.metaDescription?.message}
      >
        <Textarea id="metaDescription" rows={3} {...register('metaDescription')} />
      </Field>

      <Field
        label="Keywords"
        htmlFor="keywords"
        hint="Comma-separated"
        error={errors.keywords?.message}
      >
        <Input id="keywords" placeholder="SAP training, S/4HANA, …" {...register('keywords')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Canonical URL" htmlFor="canonicalUrl" error={errors.canonicalUrl?.message}>
          <Input id="canonicalUrl" {...register('canonicalUrl')} />
        </Field>
        <Field label="OG image URL" htmlFor="ogImage" error={errors.ogImage?.message}>
          <Input id="ogImage" {...register('ogImage')} />
        </Field>
      </div>

      <Field label="Robots" error={errors.robots?.message}>
        <Select value={watch('robots')} onValueChange={(v) => setValue('robots', v as SeoFormValues['robots'])}>
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
    </form>
  )
}
