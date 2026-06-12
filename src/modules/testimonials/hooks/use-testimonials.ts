import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Testimonial } from '@/types/domain'
import { testimonialService } from '../services/testimonial.service'
import type { TestimonialFormValues } from '../validations/testimonial.schema.ts'

export const testimonialHooks = createCrudHooks<
  Testimonial,
  TestimonialFormValues,
  Partial<TestimonialFormValues>
>({
  name: 'Testimonial',
  keys: queryKeys.testimonials,
  repository: testimonialService,
})
