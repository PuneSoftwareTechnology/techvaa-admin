import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  testimonialSchema,
  TESTIMONIAL_DEFAULTS,
  type TestimonialFormValues,
} from '../validations/testimonial.schema'

interface TestimonialFormProps {
  formId: string
  defaultValues?: TestimonialFormValues
  onSubmit: (values: TestimonialFormValues) => void
}

export function TestimonialForm({ formId, defaultValues, onSubmit }: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: defaultValues ?? TESTIMONIAL_DEFAULTS,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" {...register('name')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role" htmlFor="role" error={errors.role?.message}>
          <Input id="role" {...register('role')} />
        </Field>
        <Field label="Company" htmlFor="company" error={errors.company?.message}>
          <Input id="company" {...register('company')} />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" required error={errors.message?.message}>
        <Textarea id="message" rows={4} {...register('message')} />
      </Field>

      <Field label="Image URL" htmlFor="image" error={errors.image?.message}>
        <Input id="image" placeholder="https://…" {...register('image')} />
      </Field>

      <Field
        label="Video URL"
        htmlFor="videoUrl"
        hint="Optional — link to a video testimonial."
        error={errors.videoUrl?.message}
      >
        <Input id="videoUrl" placeholder="https://…" {...register('videoUrl')} />
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="isPublished">Published</Label>
        <Switch
          id="isPublished"
          checked={watch('isPublished')}
          onCheckedChange={(v) => setValue('isPublished', v)}
        />
      </div>
    </form>
  )
}
