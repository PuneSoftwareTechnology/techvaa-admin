import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CourseSelect } from '@/components/forms/course-select'
import {
  courseBatchSchema,
  COURSE_BATCH_DEFAULTS,
  type CourseBatchFormValues,
} from '../validations/course-batch.schema'

interface CourseBatchFormProps {
  formId: string
  defaultValues?: CourseBatchFormValues
  onSubmit: (values: CourseBatchFormValues) => void
}

export function CourseBatchForm({
  formId,
  defaultValues,
  onSubmit,
}: CourseBatchFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseBatchFormValues>({
    resolver: zodResolver(courseBatchSchema),
    defaultValues: defaultValues ?? COURSE_BATCH_DEFAULTS,
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" htmlFor="startDate" required error={errors.startDate?.message}>
          <Input id="startDate" type="date" {...register('startDate')} />
        </Field>
        <Field
          label="Duration"
          htmlFor="duration"
          required
          hint="e.g. 12 weeks"
          error={errors.duration?.message}
        >
          <Input id="duration" {...register('duration')} />
        </Field>
      </div>

      <div
        className={cn(
          'flex items-center justify-between rounded-lg border px-3 py-2 transition-colors',
          watch('isOpen')
            ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40'
            : 'border-input bg-background',
        )}
      >
        <div>
          <Label htmlFor="isOpen">Enrollment open</Label>
          <p className="text-xs text-muted-foreground">
            Show this batch as accepting enrolments.
          </p>
        </div>
        <Switch
          id="isOpen"
          checked={watch('isOpen')}
          onCheckedChange={(v) => setValue('isOpen', v)}
        />
      </div>

      <div
        className={cn(
          'flex items-center justify-between rounded-lg border px-3 py-2 transition-colors',
          watch('showOnHomepage')
            ? 'border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40'
            : 'border-input bg-background',
        )}
      >
        <div>
          <Label htmlFor="showOnHomepage">Show on home page</Label>
          <p className="text-xs text-muted-foreground">
            Also list this batch in the home-page upcoming-batches table.
          </p>
        </div>
        <Switch
          id="showOnHomepage"
          checked={watch('showOnHomepage')}
          onCheckedChange={(v) => setValue('showOnHomepage', v)}
        />
      </div>
    </form>
  )
}
