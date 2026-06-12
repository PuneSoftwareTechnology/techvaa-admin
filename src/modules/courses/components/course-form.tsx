import { useRef, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { slugify } from '@/lib/format'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/forms/multi-select'
import { ImageUpload } from '@/components/forms/image-upload'
import { RichTextEditor } from '@/components/forms/rich-text-editor'
import { EntitySeoSection } from '@/modules/seo/components/entity-seo-section'
import { courseHooks } from '../hooks/use-courses'
import {
  courseSchema,
  COURSE_DEFAULTS,
  type CourseFormValues,
} from '../validations/course.schema'

interface CourseFormProps {
  formId: string
  defaultValues?: CourseFormValues
  /** The course being edited — excluded from the related-courses picker. */
  excludeId?: string
  /** Linked-content column (curriculum / batches / FAQs) shown alongside. */
  aside?: ReactNode
  onSubmit: (values: CourseFormValues) => void
}

export function CourseForm({
  formId,
  defaultValues,
  excludeId,
  aside,
  onSubmit,
}: CourseFormProps) {
  const slugDirty = useRef(!!defaultValues)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? COURSE_DEFAULTS,
  })

  const { data: courses } = courseHooks.useList({ pageSize: 100 })
  const relatedIds = watch('relatedCourseIds')

  const relatedOptions = (courses?.data ?? [])
    .filter((course) => course.id !== excludeId)
    .map((course) => ({ value: course.id, label: course.title }))

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid items-start gap-5 lg:grid-cols-3"
    >
      {/* Column 1 — main content + SEO */}
      <div className="space-y-5">
        <Section title="Content" accent="indigo">
          <Field label="Course name" htmlFor="title" required error={errors.title?.message}>
            <Input
              id="title"
              {...register('title', {
                onChange: (e) => {
                  if (!slugDirty.current) setValue('slug', slugify(e.target.value))
                },
              })}
            />
          </Field>

          <Field
            label="Short description"
            htmlFor="shortDescription"
            hint="Short blurb shown on course cards."
            error={errors.shortDescription?.message}
          >
            <RichTextEditor
              id="shortDescription"
              value={watch('shortDescription')}
              onChange={(html) =>
                setValue('shortDescription', html, { shouldDirty: true, shouldValidate: true })
              }
              invalid={!!errors.shortDescription}
              placeholder="Short blurb shown on course cards…"
            />
          </Field>

          <Field label="Description" htmlFor="description" required error={errors.description?.message}>
            <RichTextEditor
              id="description"
              value={watch('description')}
              onChange={(html) =>
                setValue('description', html, { shouldDirty: true, shouldValidate: true })
              }
              invalid={!!errors.description}
              placeholder="Describe the course…"
            />
          </Field>
        </Section>
      </div>

      {/* Column 2 — settings */}
      <div className="space-y-5">
        <Section title="Visibility" accent="emerald">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2">
              <Label htmlFor="isFeatured">Featured</Label>
              <Switch
                id="isFeatured"
                checked={watch('isFeatured')}
                onCheckedChange={(v) => setValue('isFeatured', v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2">
              <Label htmlFor="isPublished">Published</Label>
              <Switch
                id="isPublished"
                checked={watch('isPublished')}
                onCheckedChange={(v) => setValue('isPublished', v)}
              />
            </div>
          </div>
        </Section>

        <Section title="Details" accent="sky">
          <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
            <Input id="slug" {...register('slug', { onChange: () => (slugDirty.current = true) })} />
          </Field>
          <Field
            label="Duration"
            htmlFor="duration"
            hint='e.g. "6 weeks", "40 hours"'
            error={errors.duration?.message}
          >
            <Input id="duration" {...register('duration')} />
          </Field>
          <Field label="Related course(s)" error={errors.relatedCourseIds?.message}>
            <MultiSelect
              options={relatedOptions}
              value={relatedIds}
              onChange={(next) => setValue('relatedCourseIds', next, { shouldDirty: true })}
              placeholder="Select related course(s)…"
              emptyText="No other courses available."
            />
          </Field>
        </Section>

        <Section title="Media" accent="amber">
          <Field label="Featured image" error={errors.image?.message}>
            <ImageUpload
              value={watch('image')}
              folder="courses"
              slug={watch('slug')}
              onChange={(url) =>
                setValue('image', url, { shouldDirty: true, shouldValidate: true })
              }
            />
          </Field>
        </Section>
      </div>

      {/* Column 3 — linked content */}
      <div className="space-y-5">{aside}</div>

      {/* Full-width row — SEO */}
      <div className="lg:col-span-3">
        <Section title="SEO" accent="violet">
          <Field
            label="Meta description"
            htmlFor="seo-metaDescription"
            hint="Used for search engines. Leave blank to auto-generate."
            error={
              (errors.seo as { metaDescription?: { message?: string } } | undefined)
                ?.metaDescription?.message
            }
          >
            <Textarea id="seo-metaDescription" rows={2} {...register('seo.metaDescription')} />
          </Field>

          <EntitySeoSection
            register={register}
            errors={errors}
            robots={watch('seo.robots') ?? 'INDEX_FOLLOW'}
            onRobotsChange={(v) => setValue('seo.robots', v)}
            hideMetaDescription
          />
        </Section>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ Section */

const ACCENTS = {
  indigo: {
    card: 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/20',
    head: 'border-indigo-200 bg-indigo-100/70 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-900/30 dark:text-indigo-200',
  },
  sky: {
    card: 'border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20',
    head: 'border-sky-200 bg-sky-100/70 text-sky-900 dark:border-sky-900/60 dark:bg-sky-900/30 dark:text-sky-200',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20',
    head: 'border-amber-200 bg-amber-100/70 text-amber-900 dark:border-amber-900/60 dark:bg-amber-900/30 dark:text-amber-200',
  },
  emerald: {
    card: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20',
    head: 'border-emerald-200 bg-emerald-100/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-900/30 dark:text-emerald-200',
  },
  violet: {
    card: 'border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20',
    head: 'border-violet-200 bg-violet-100/70 text-violet-900 dark:border-violet-900/60 dark:bg-violet-900/30 dark:text-violet-200',
  },
} as const

function Section({
  title,
  accent,
  action,
  children,
}: {
  title: string
  accent: keyof typeof ACCENTS
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={cn('overflow-hidden rounded-xl border shadow-sm', ACCENTS[accent].card)}>
      <header
        className={cn(
          'flex items-center justify-between gap-2 border-b px-4 py-2.5 text-sm font-semibold',
          ACCENTS[accent].head,
        )}
      >
        <span>{title}</span>
        {action}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  )
}

export { Section as CourseSection }
