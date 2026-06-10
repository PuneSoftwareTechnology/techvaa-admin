import type {
  Blog,
  BlogCategory,
  Course,
  CourseEnquiry,
  Faq,
  Lead,
  Media,
  Placement,
  Review,
} from '@/types/domain'
import { MockCollection } from './collection'
import { SEED_USERS, type MockUser } from './seed-users'
import {
  BLOG_SEED,
  CATEGORY_SEED,
  COURSE_ENQUIRY_SEED,
  COURSE_SEED,
  FAQ_SEED,
  LEAD_SEED,
  MEDIA_SEED,
  PLACEMENT_SEED,
  REVIEW_SEED,
} from './seeds'

/**
 * The in-memory mock database. A single shared instance per resource, seeded
 * once on first import. Mutations persist for the lifetime of the tab.
 */
export const mockDb = {
  courses: new MockCollection<Course>(COURSE_SEED, {
    idPrefix: 'crs',
    searchFields: ['title', 'slug'],
  }),
  blogs: new MockCollection<Blog>(BLOG_SEED, {
    idPrefix: 'blg',
    searchFields: ['title', 'slug', 'metaDescription', 'introduction'],
  }),
  categories: new MockCollection<BlogCategory>(CATEGORY_SEED, {
    idPrefix: 'cat',
    searchFields: ['name', 'slug', 'description'],
  }),
  reviews: new MockCollection<Review>(REVIEW_SEED, {
    idPrefix: 'rev',
    searchFields: ['studentName', 'company', 'review'],
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
  media: new MockCollection<Media>(MEDIA_SEED, {
    idPrefix: 'med',
    searchFields: ['originalName', 'fileName', 'fileType'],
  }),
  users: new MockCollection<MockUser>(SEED_USERS, {
    idPrefix: 'usr',
    searchFields: ['name', 'email', 'role'],
  }),
}
