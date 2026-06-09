import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: z.string().optional().or(z.literal('')),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const CATEGORY_DEFAULTS: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
}
