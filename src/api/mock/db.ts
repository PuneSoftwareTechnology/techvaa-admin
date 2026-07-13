import type {
  Blog,
  Course,
  CourseBatch,
  CourseEnquiry,
  CurriculumItem,
  Faq,
  Lead,
  Placement,
  Review,
  Testimonial,
} from '@/types/domain'
import { MockCollection } from './collection'
import { SEED_USERS, type MockUser } from './seed-users'
import {
  BLOG_SEED,
  COURSE_BATCH_SEED,
  COURSE_ENQUIRY_SEED,
  COURSE_SEED,
  CURRICULUM_SEED,
  FAQ_SEED,
  LEAD_SEED,
  PLACEMENT_SEED,
  REVIEW_SEED,
  TESTIMONIAL_SEED,
} from './seeds'

/**
 * The in-memory mock database. A single shared instance per resource, seeded
 * once on first import. Mutations persist for the lifetime of the tab.
 */
/**
 * Attach each batch's parent course (id/title/slug), mirroring the API's
 * `include: { course }`. Lets the list resolve titles and search by course
 * name without a second lookup.
 */
const courseById = new Map(COURSE_SEED.map((c) => [c.id, c]))
const COURSE_BATCH_SEED_WITH_COURSE: CourseBatch[] = COURSE_BATCH_SEED.map(
  (batch) => {
    const course = courseById.get(batch.courseId)
    return course
      ? { ...batch, course: { id: course.id, title: course.title, slug: course.slug } }
      : batch
  },
)

export const mockDb = {
  courses: new MockCollection<Course>(COURSE_SEED, {
    idPrefix: 'crs',
    searchFields: ['title', 'slug'],
  }),
  curriculumItems: new MockCollection<CurriculumItem>(CURRICULUM_SEED, {
    idPrefix: 'cur',
    searchFields: ['heading', 'description'],
  }),
  courseBatches: new MockCollection<CourseBatch>(COURSE_BATCH_SEED_WITH_COURSE, {
    idPrefix: 'bat',
    searchFields: ['course.title', 'duration', 'timing', 'mode'],
  }),
  blogs: new MockCollection<Blog>(BLOG_SEED, {
    idPrefix: 'blg',
    searchFields: ['title', 'slug', 'metaDescription', 'introduction'],
  }),
  reviews: new MockCollection<Review>(REVIEW_SEED, {
    idPrefix: 'rev',
    searchFields: ['studentName', 'company', 'review'],
  }),
  testimonials: new MockCollection<Testimonial>(TESTIMONIAL_SEED, {
    idPrefix: 'tst',
    searchFields: ['name', 'company', 'role', 'message'],
  }),
  placements: new MockCollection<Placement>(PLACEMENT_SEED, {
    idPrefix: 'plc',
    searchFields: ['studentName', 'company', 'course'],
  }),
  faqs: new MockCollection<Faq>(FAQ_SEED, {
    idPrefix: 'faq',
    searchFields: ['question', 'answer'],
  }),
  leads: new MockCollection<Lead>(LEAD_SEED, {
    idPrefix: 'led',
    searchFields: ['name', 'email', 'phone'],
  }),
  courseEnquiries: new MockCollection<CourseEnquiry>(COURSE_ENQUIRY_SEED, {
    idPrefix: 'enq',
    searchFields: ['name', 'phone', 'course'],
  }),
  users: new MockCollection<MockUser>(SEED_USERS, {
    idPrefix: 'usr',
    searchFields: ['name', 'email', 'role'],
  }),
}
