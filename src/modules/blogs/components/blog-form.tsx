import { useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'

import { slugify } from '@/lib/format'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MultiSelect } from '@/components/forms/multi-select'
import { courseHooks } from '@/modules/courses/hooks/use-courses'
import { CourseSection as Section } from '@/modules/courses/components/course-form'
import { ImageUpload } from '@/components/forms/image-upload'
import { RichTextEditor } from '@/components/forms/rich-text-editor'
import {
  blogSchema,
  BLOG_DEFAULTS,
  type BlogFormValues,
} from '../validations/blog.schema'

interface BlogFormProps {
  formId: string
  defaultValues?: BlogFormValues
  onSubmit: (values: BlogFormValues) => void
}

/** The three identical content blocks share a key prefix in the schema. */
const CONTENT_BLOCKS = [
  { key: 'primary', label: 'Primary', accent: 'sky' },
  { key: 'secondary', label: 'Secondary', accent: 'emerald' },
  { key: 'tertiary', label: 'Tertiary', accent: 'amber' },
] as const

export function BlogForm({ formId, defaultValues, onSubmit }: BlogFormProps) {
  const slugDirty = useRef(!!defaultValues)
  const { data: courses } = courseHooks.useList({ pageSize: 100 })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultValues ?? BLOG_DEFAULTS,
  })

  const points = useFieldArray({ control, name: 'tertiaryPoints' as never })

  const slug = watch('slug')

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid items-start gap-5 lg:grid-cols-4"
    >
      {/* Column 1 — main details */}
      <Section title="Main details" accent="indigo">
        <Field label="Title" htmlFor="title" required error={errors.title?.message}>
          <Input
            id="title"
            {...register('title', {
              onChange: (e) => {
                if (!slugDirty.current) setValue('slug', slugify(e.target.value))
              },
            })}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
          <Input id="slug" {...register('slug', { onChange: () => (slugDirty.current = true) })} />
        </Field>

        <Field
          label="Meta Description"
          htmlFor="metaDescription"
          hint="Shown on cards and in search results"
          error={errors.metaDescription?.message}
        >
          <Textarea id="metaDescription" rows={2} {...register('metaDescription')} />
        </Field>

        <Field label="Featured Image" error={errors.featuredImage?.message}>
          <ImageUpload
            value={watch('featuredImage')}
            folder="blogs"
            slug={slug}
            onChange={(url) =>
              setValue('featuredImage', url, { shouldDirty: true, shouldValidate: true })
            }
          />
        </Field>

        <Field
          label="Introduction"
          htmlFor="introduction"
          required
          error={errors.introduction?.message}
        >
          <RichTextEditor
            id="introduction"
            value={watch('introduction')}
            onChange={(html) =>
              setValue('introduction', html, { shouldDirty: true, shouldValidate: true })
            }
            invalid={!!errors.introduction}
            placeholder="Write the introduction…"
          />
        </Field>
      </Section>

      {/* Right side — content sections, then conclusion + settings beneath them */}
      <div className="grid items-start gap-5 lg:col-span-3">
        {/* Templated content blocks */}
        <div className="grid items-start gap-5 lg:grid-cols-3">
          {CONTENT_BLOCKS.map(({ key, label, accent }) => (
            <Section key={key} title={`${label} section`} accent={accent}>
          <Field label="Title" error={errors[`${key}Title`]?.message}>
            <Input {...register(`${key}Title`)} />
          </Field>

          {/* Optional photo, between title and intro — primary & secondary only */}
          {key !== 'tertiary' && (
            <Field label="Photo" error={errors[`${key}Image`]?.message}>
              <ImageUpload
                value={watch(`${key}Image`)}
                folder="blogs"
                slug={slug ? `${slug}-${key}` : key}
                onChange={(url) =>
                  setValue(`${key}Image`, url, { shouldDirty: true, shouldValidate: true })
                }
              />
            </Field>
          )}

          <Field label="Intro" error={errors[`${key}Intro`]?.message}>
            <Textarea rows={2} {...register(`${key}Intro`)} />
          </Field>

          <Field label="Text" error={errors[`${key}Text`]?.message}>
            <RichTextEditor
              value={watch(`${key}Text`) ?? ''}
              onChange={(html) =>
                setValue(`${key}Text`, html, { shouldDirty: true, shouldValidate: true })
              }
              invalid={!!errors[`${key}Text`]}
              placeholder={`Write the ${label.toLowerCase()} content…`}
            />
          </Field>

          {/* Bullet points live only on the tertiary block */}
          {key === 'tertiary' && (
            <Field label="Points" error={errors.tertiaryPoints?.message as string}>
              <div className="space-y-2">
                {points.fields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Enter a bullet point"
                      {...register(`tertiaryPoints.${i}` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => points.remove(i)}
                      aria-label="Remove point"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => points.append('' as never)}
                >
                  <Plus className="mr-1 size-4" /> Add
                </Button>
              </div>
            </Field>
          )}
            </Section>
          ))}
        </div>

        {/* Conclusion + settings, side by side, filling the space below */}
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <Section title="Conclusion" accent="violet">
          <Field label="Conclusion" htmlFor="conclusion" error={errors.conclusion?.message}>
            <RichTextEditor
              id="conclusion"
              value={watch('conclusion') ?? ''}
              onChange={(html) =>
                setValue('conclusion', html, { shouldDirty: true, shouldValidate: true })
              }
              invalid={!!errors.conclusion}
              placeholder="Wrap up the article…"
            />
          </Field>
        </Section>

        <Section title="Settings" accent="emerald">
          <Field label="Related Course(s)" error={errors.relatedCourseIds?.message as string}>
            <MultiSelect
              options={(courses?.data ?? []).map((course) => ({
                value: course.id,
                label: course.title,
              }))}
              value={watch('relatedCourseIds')}
              onChange={(next) => setValue('relatedCourseIds', next, { shouldDirty: true })}
              placeholder="Select related course(s)…"
              emptyText="No courses available."
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2">
              <Label htmlFor="showOnHomepage">Show on HomePage</Label>
              <Switch
                id="showOnHomepage"
                checked={watch('showOnHomepage')}
                onCheckedChange={(v) => setValue('showOnHomepage', v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2">
              <div>
                <Label htmlFor="isPublished">Status</Label>
                <p className="text-xs text-muted-foreground">
                  {watch('isPublished') ? 'Published' : 'Draft'}
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={watch('isPublished')}
                onCheckedChange={(v) => setValue('isPublished', v)}
              />
            </div>
          </div>
        </Section>
      </div>
      </div>
    </form>
  )
}
