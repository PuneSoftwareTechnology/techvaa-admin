import { z } from 'zod'

import { PERMISSIONS, USER_ROLES } from '@/types/domain'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password is too long')

/**
 * Schema for the credential form. In `edit` mode the email is immutable and
 * the password is managed separately (admin-driven reset), so both are dropped.
 */
export function buildUserSchema(mode: 'create' | 'edit') {
  return z.object({
    name: z.string().min(2, 'Name is required').max(80),
    email:
      mode === 'create'
        ? z.string().min(1, 'Email is required').email('Enter a valid email address')
        : z.string().optional(),
    password: mode === 'create' ? passwordSchema : z.string().optional(),
    role: z.enum(USER_ROLES),
    permissions: z.array(z.enum(PERMISSIONS)),
    isActive: z.boolean(),
  })
}

export const resetPasswordSchema = z.object({
  password: passwordSchema,
})

export type UserFormValues = z.infer<ReturnType<typeof buildUserSchema>>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
