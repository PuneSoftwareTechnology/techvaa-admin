import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CourseSelect } from '@/components/forms/course-select'
import {
  curriculumSchema,
  CURRICULUM_DEFAULTS,
  type CurriculumFormValues,
} from '../validations/curriculum.schema'

interface CurriculumFormProps {
  formId: string
  defaultValues?: CurriculumFormValues
  onSubmit: (values: CurriculumFormValues) => void
}

export function CurriculumForm({
  formId,
  defaultValues,
  onSubmit,
}: CurriculumFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: defaultValues ?? CURRICULUM_DEFAULTS,
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Course" htmlFor="courseId" required error={errors.courseId?.message}>
        <CourseSelect
          id="courseId"
          value={watch('courseId')}
          invalid={!!errors.courseId}
          onChange={(id) =>
            setValue('courseId', id, { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <Field label="Heading" htmlFor="heading" required error={errors.heading?.message}>
          <Input id="heading" {...register('heading')} />
        </Field>
        <Field
          label="Order"
          htmlFor="sortOrder"
          hint="Lower first"
          error={errors.sortOrder?.message}
        >
          <Input id="sortOrder" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
        </Field>
      </div>

      <Field label="Description" htmlFor="description" required error={errors.description?.message}>
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
    </form>
  )
}
