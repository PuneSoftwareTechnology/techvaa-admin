import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Field } from '@/components/forms/field'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/forms/rich-text-editor'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { courseHooks } from '@/modules/courses/hooks/use-courses'
import {
  faqSchema,
  FAQ_DEFAULTS,
  type FaqFormValues,
} from '../validations/faq.schema'

interface FaqFormProps {
  formId: string
  defaultValues?: FaqFormValues
  onSubmit: (values: FaqFormValues) => void
}

export function FaqForm({ formId, defaultValues, onSubmit }: FaqFormProps) {
  const { data: courses } = courseHooks.useList({ pageSize: 100 })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: defaultValues ?? FAQ_DEFAULTS,
  })

  const courseIds = watch('courseIds')

  const toggleCourse = (id: string, checked: boolean) => {
    const next = checked
      ? [...courseIds, id]
      : courseIds.filter((c) => c !== id)
    setValue('courseIds', next, { shouldDirty: true })
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Question" htmlFor="question" required error={errors.question?.message}>
        <Input id="question" {...register('question')} />
      </Field>

      <Field label="Answer" htmlFor="answer" required error={errors.answer?.message}>
        <RichTextEditor
          id="answer"
          value={watch('answer')}
          onChange={(html) =>
            setValue('answer', html, { shouldDirty: true, shouldValidate: true })
          }
          invalid={!!errors.answer}
          placeholder="Write the answer…"
        />
      </Field>

      <div className="grid grid-cols-2 items-end gap-4">
        <Field
          label="Sort order"
          htmlFor="sortOrder"
          hint="Lower numbers appear first"
          error={errors.sortOrder?.message}
        >
          <Input id="sortOrder" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
        </Field>

        <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
          <Label htmlFor="isPublished">Published</Label>
          <Switch
            id="isPublished"
            checked={watch('isPublished')}
            onCheckedChange={(v) => setValue('isPublished', v)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <div>
          <Label htmlFor="showOnHomepage">Show on homepage</Label>
          <p className="text-xs text-muted-foreground">
            Display this FAQ in the homepage FAQ section.
          </p>
        </div>
        <Switch
          id="showOnHomepage"
          checked={watch('showOnHomepage')}
          onCheckedChange={(v) => setValue('showOnHomepage', v)}
        />
      </div>

      <Field
        label="Courses"
        hint="The FAQ appears on each selected course's page"
        error={errors.courseIds?.message}
      >
        <ScrollArea className="h-40 rounded-lg border border-input">
          <div className="space-y-1 p-2">
            {courses?.data.length ? (
              courses.data.map((course) => (
                <label
                  key={course.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <Checkbox
                    checked={courseIds.includes(course.id)}
                    onCheckedChange={(v) => toggleCourse(course.id, v === true)}
                  />
                  <span className="truncate">{course.title}</span>
                </label>
              ))
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No courses available.
              </p>
            )}
          </div>
        </ScrollArea>
      </Field>
    </form>
  )
}
