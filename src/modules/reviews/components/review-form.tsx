import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
import {
  reviewSchema,
  REVIEW_DEFAULTS,
  type ReviewFormValues,
} from '../validations/review.schema'

interface ReviewFormProps {
  formId: string
  defaultValues?: ReviewFormValues
  onSubmit: (values: ReviewFormValues) => void
}

export function ReviewForm({ formId, defaultValues, onSubmit }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: defaultValues ?? REVIEW_DEFAULTS,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student name" htmlFor="studentName" required error={errors.studentName?.message}>
          <Input id="studentName" {...register('studentName')} />
        </Field>
        <Field label="Rating" error={errors.rating?.message}>
          <Select value={String(watch('rating'))} onValueChange={(v) => setValue('rating', Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r} star{r > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" htmlFor="company" error={errors.company?.message}>
          <Input id="company" {...register('company')} />
        </Field>
        <Field label="Designation" htmlFor="designation" error={errors.designation?.message}>
          <Input id="designation" {...register('designation')} />
        </Field>
      </div>

      <Field label="Review" htmlFor="review" required error={errors.review?.message}>
        <Textarea id="review" rows={4} {...register('review')} />
      </Field>

      <Field label="Image URL" htmlFor="image" error={errors.image?.message}>
        <Input id="image" {...register('image')} />
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="isPublished">Published</Label>
        <Switch id="isPublished" checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
      </div>
    </form>
  )
}
