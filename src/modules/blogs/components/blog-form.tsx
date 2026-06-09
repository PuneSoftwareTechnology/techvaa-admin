import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { slugify } from '@/lib/format'
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
import { categoryHooks } from '@/modules/categories/hooks/use-categories'
import { ImageUpload } from '@/components/forms/image-upload'
import { EntitySeoSection } from '@/modules/seo/components/entity-seo-section'
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

export function BlogForm({ formId, defaultValues, onSubmit }: BlogFormProps) {
  const slugDirty = useRef(!!defaultValues)
  const { data: categories } = categoryHooks.useList({ pageSize: 100 })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultValues ?? BLOG_DEFAULTS,
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
        <Field label="Category" required error={errors.categoryId?.message}>
          <Select value={watch('categoryId')} onValueChange={(v) => setValue('categoryId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.data.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message}>
        <Textarea id="excerpt" rows={2} {...register('excerpt')} />
      </Field>

      <Field label="Content" htmlFor="content" required hint="HTML or markdown" error={errors.content?.message}>
        <Textarea id="content" rows={6} {...register('content')} />
      </Field>

      <Field label="Featured image" error={errors.featuredImage?.message}>
        <ImageUpload
          value={watch('featuredImage')}
          folder="blogs"
          slug={watch('slug')}
          onChange={(url) =>
            setValue('featuredImage', url, { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field>

      <Field label="Reading time (min)" htmlFor="readingTime" error={errors.readingTime?.message}>
        <Input
          id="readingTime"
          type="number"
          min={1}
          {...register('readingTime', {
            setValueAs: (v) => (v === '' || v == null ? undefined : Number(v)),
          })}
        />
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="isPublished">Published</Label>
        <Switch id="isPublished" checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
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
