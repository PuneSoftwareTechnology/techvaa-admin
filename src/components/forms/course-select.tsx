import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { courseHooks } from '@/modules/courses/hooks/use-courses'

interface CourseSelectProps {
  value: string
  onChange: (id: string) => void
  id?: string
  invalid?: boolean
}

/**
 * Single-course picker. Loads the full course list (no pagination concern at
 * this scale) and binds the chosen id. Shared by the curriculum and batch
 * forms, both of which attach a row to exactly one course.
 */
export function CourseSelect({ value, onChange, id, invalid }: CourseSelectProps) {
  const { data } = courseHooks.useList({ pageSize: 100 })
  const courses = data?.data ?? []

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={invalid}>
        <SelectValue placeholder="Select a course…" />
      </SelectTrigger>
      <SelectContent>
        {courses.map((course) => (
          <SelectItem key={course.id} value={course.id}>
            {course.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
