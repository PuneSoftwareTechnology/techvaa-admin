import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Testimonial } from '@/types/domain'
import type { TestimonialFormValues } from '../validations/testimonial.schema.ts'

export const testimonialRepository = createCrudRepository<
  Testimonial,
  TestimonialFormValues,
  Partial<TestimonialFormValues>
>('testimonials', mockDb.testimonials)
