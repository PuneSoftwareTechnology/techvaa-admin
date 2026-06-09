import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
} from 'lucide-react'

import { env } from '@/config/env'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '../hooks/use-auth'
import { loginSchema, type LoginFormValues } from '../validations/login.schema'

export default function LoginPage() {
  const { loginAsync, isLoggingIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = handleSubmit(async (values) => {
    await loginAsync(values).catch(() => {
      /* errors surfaced via toast in the hook */
    })
  })

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand/40 via-transparent to-accent-orange/30"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent-orange text-lg font-bold text-white shadow-lg">
            T
          </span>
          <span className="font-heading text-lg font-semibold">Techvaa</span>
        </div>
        <div className="relative space-y-4">
          <h1 className="font-heading text-3xl leading-tight font-semibold text-balance">
            Run your SAP training institute from one place.
          </h1>
          <p className="max-w-md text-sidebar-foreground/70">
            Manage courses, leads, placements, content and SEO — built for
            content teams that move fast.
          </p>
        </div>
        <p className="relative text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} Techvaa. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your admin account to continue.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@techvaa.com"
                  className="pl-9"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(v) => setValue('rememberMe', v === true)}
                />
                Remember me
              </label>
              <span className="text-xs text-muted-foreground">
                Password trouble? Contact your admin.
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn && <Loader2Icon className="animate-spin" />}
              Sign in
            </Button>
          </form>

          {env.useMock && (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Demo mode</span> —
              sign in with{' '}
              <code className="rounded bg-background px-1 py-0.5 font-mono">
                admin@techvaa.com
              </code>{' '}
              /{' '}
              <code className="rounded bg-background px-1 py-0.5 font-mono">
                admin123
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
