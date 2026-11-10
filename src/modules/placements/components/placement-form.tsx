import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Field } from '@/components/forms/field'
import { ImageUpload } from '@/components/forms/image-upload'
import { MultiSelect } from '@/components/forms/multi-select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/format'
import { courseHooks } from '@/modules/courses/hooks/use-courses'
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
  const { data: courses } = courseHooks.useList({ pageSize: 100 })
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

  const showOnCoursePage = watch('showOnCoursePage')

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
        <Field label="Course" htmlFor="course" hint="Label shown on the card, e.g. SAP MM" error={errors.course?.message}>
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

      <Field
        label="Student photo"
        hint="Upload a square photo (JPG/PNG/WEBP, max 5 MB). Initials are shown when empty."
        error={errors.image?.message}
      >
        <ImageUpload
          value={watch('image')}
          folder="placements"
          slug={slugify(watch('studentName') || 'student')}
          onChange={(url) => setValue('image', url, { shouldDirty: true, shouldValidate: true })}
        />
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="isPublished">Published</Label>
        <Switch id="isPublished" checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
      </div>

      <div className="space-y-3 rounded-lg border border-input px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="showOnCoursePage" className="flex flex-col items-start gap-0.5">
            Show on course page
            <span className="text-xs font-normal text-muted-foreground">
              Adds this student to “Recently Placed Students” on the courses below.
            </span>
          </Label>
          <Switch
            id="showOnCoursePage"
            checked={showOnCoursePage}
            onCheckedChange={(v) => setValue('showOnCoursePage', v, { shouldDirty: true })}
          />
        </div>

        {showOnCoursePage && (
          <Field label="Course pages" error={errors.courseIds?.message}>
            <MultiSelect
              options={
                courses?.data.map((course) => ({
                  value: course.id,
                  label: course.title,
                })) ?? []
              }
              value={watch('courseIds')}
              onChange={(next) => setValue('courseIds', next, { shouldDirty: true })}
              placeholder="Select courses…"
              emptyText="No courses available."
            />
          </Field>
        )}
      </div>
    </form>
  )
}
