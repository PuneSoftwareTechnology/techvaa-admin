import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  placementSchema,
  PLACEMENT_DEFAULTS,
  type PlacementFormValues,
} from '../validations/placement.schema'

interface PlacementFormProps {
  formId: string
  defaultValues?: PlacementFormValues
  onSubmit: (values: PlacementFormValues) => void
}

export function PlacementForm({ formId, defaultValues, onSubmit }: PlacementFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlacementFormValues>({
    resolver: zodResolver(placementSchema),
    defaultValues: defaultValues ?? PLACEMENT_DEFAULTS,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student name" htmlFor="studentName" required error={errors.studentName?.message}>
          <Input id="studentName" {...register('studentName')} />
        </Field>
        <Field label="Company" htmlFor="company" required error={errors.company?.message}>
          <Input id="company" {...register('company')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Package" htmlFor="package" hint="e.g. 12 LPA" error={errors.package?.message}>
          <Input id="package" {...register('package')} />
        </Field>
        <Field label="Course" htmlFor="course" error={errors.course?.message}>
          <Input id="course" {...register('course')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Joining date" htmlFor="joiningDate" error={errors.joiningDate?.message}>
          <Input id="joiningDate" type="date" {...register('joiningDate')} />
        </Field>
        <Field label="LinkedIn URL" htmlFor="linkedinUrl" error={errors.linkedinUrl?.message}>
          <Input id="linkedinUrl" placeholder="https://linkedin.com/in/…" {...register('linkedinUrl')} />
        </Field>
      </div>

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
