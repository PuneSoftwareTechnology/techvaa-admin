import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { slugify, humanizeEnum } from '@/lib/format'
import { COURSE_LEVELS } from '@/types/domain'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EntitySeoSection } from '@/modules/seo/components/entity-seo-section'
import {
  courseSchema,
  COURSE_DEFAULTS,
  type CourseFormValues,
} from '../validations/course.schema'
import { ImageUpload } from '@/components/forms/image-upload'

interface CourseFormProps {
  formId: string
  defaultValues?: CourseFormValues
  onSubmit: (values: CourseFormValues) => void
}

export function CourseForm({ formId, defaultValues, onSubmit }: CourseFormProps) {
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

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
          <Input id="slug" {...register('slug', { onChange: () => (slugDirty.current = true) })} />
        </Field>
        <Field label="Duration" htmlFor="duration" hint="e.g. 8 weeks" error={errors.duration?.message}>
          <Input id="duration" {...register('duration')} />
        </Field>
      </div>

      <Field label="Short description" htmlFor="shortDescription" error={errors.shortDescription?.message}>
        <Textarea id="shortDescription" rows={2} {...register('shortDescription')} />
      </Field>

      <Field label="Description" htmlFor="description" required error={errors.description?.message}>
        <Textarea id="description" rows={5} {...register('description')} />
      </Field>

      <Field label="Level" error={errors.level?.message}>
        <Select value={watch('level')} onValueChange={(v) => setValue('level', v as CourseFormValues['level'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COURSE_LEVELS.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {humanizeEnum(lvl)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Course image" error={errors.image?.message}>
        <ImageUpload
          value={watch('image')}
          folder="courses"
          slug={watch('slug')}
          onChange={(url) =>
            setValue('image', url, { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
          <Label htmlFor="isFeatured">Featured</Label>
          <Switch id="isFeatured" checked={watch('isFeatured')} onCheckedChange={(v) => setValue('isFeatured', v)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
          <Label htmlFor="isPublished">Published</Label>
          <Switch id="isPublished" checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
        </div>
      </div>

      <EntitySeoSection
        register={register}
        errors={errors}
        robots={watch('seo.robots') ?? 'INDEX_FOLLOW'}
        onRobotsChange={(v) => setValue('seo.robots', v)}
      />
    </form>
  )
}
