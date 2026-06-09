import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { slugify } from '@/lib/format'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  categorySchema,
  CATEGORY_DEFAULTS,
  type CategoryFormValues,
} from '../validations/category.schema'

interface CategoryFormProps {
  formId: string
  defaultValues?: CategoryFormValues
  onSubmit: (values: CategoryFormValues) => void
}

export function CategoryForm({ formId, defaultValues, onSubmit }: CategoryFormProps) {
  const slugDirty = useRef(!!defaultValues)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? CATEGORY_DEFAULTS,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
        <Input
          id="name"
          {...register('name', {
            onChange: (e) => {
              if (!slugDirty.current) setValue('slug', slugify(e.target.value))
            },
          })}
        />
      </Field>

      <Field label="Slug" htmlFor="slug" required error={errors.slug?.message}>
        <Input
          id="slug"
          {...register('slug', { onChange: () => (slugDirty.current = true) })}
        />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
    </form>
  )
}
