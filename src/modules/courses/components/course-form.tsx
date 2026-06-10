import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { slugify } from '@/lib/format'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/forms/multi-select'
import { BulletListInput } from '@/components/forms/bullet-list-input'
import { ImageUpload } from '@/components/forms/image-upload'
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
  onSubmit: (values: CourseFormValues) => void
}

export function CourseForm({
  formId,
  defaultValues,
  excludeId,
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
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <Field label="Description" htmlFor="description" required error={errors.description?.message}>
        <Textarea id="description" rows={5} {...register('description')} />
      </Field>

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

      <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
        <Input id="slug" {...register('slug', { onChange: () => (slugDirty.current = true) })} />
      </Field>

      <Field label="Course intro" hint="Add a bullet point at a time" error={errors.intro?.message}>
        <BulletListInput
          value={watch('intro')}
          onChange={(next) => setValue('intro', next, { shouldDirty: true })}
          placeholder="Enter a bullet point"
        />
      </Field>

      <Field label="Modules" hint="Add a bullet point at a time" error={errors.modules?.message}>
        <BulletListInput
          value={watch('modules')}
          onChange={(next) => setValue('modules', next, { shouldDirty: true })}
          placeholder="Enter a bullet point"
        />
      </Field>

      <Field label="Prerequisite" hint="Add a bullet point at a time" error={errors.prerequisites?.message}>
        <BulletListInput
          value={watch('prerequisites')}
          onChange={(next) => setValue('prerequisites', next, { shouldDirty: true })}
          placeholder="Enter a bullet point"
        />
      </Field>

      <Field label="Related course(s)" error={errors.relatedCourseIds?.message}>
        <MultiSelect
          options={relatedOptions}
          value={relatedIds}
          onChange={(next) =>
            setValue('relatedCourseIds', next, { shouldDirty: true })
          }
          placeholder="Select related course(s)…"
          emptyText="No other courses available."
        />
      </Field>

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

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="isPublished">Published</Label>
        <Switch
          id="isPublished"
          checked={watch('isPublished')}
          onCheckedChange={(v) => setValue('isPublished', v)}
        />
      </div>

      <EntitySeoSection
        register={register}
        errors={errors}
        robots={watch('seo.robots') ?? 'INDEX_FOLLOW'}
        onRobotsChange={(v) => setValue('seo.robots', v)}
        hideMetaDescription
      />
    </form>
  )
}
