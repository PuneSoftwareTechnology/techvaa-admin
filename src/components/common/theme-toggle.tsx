import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui.store'

export function ThemeToggle() {
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const theme = useUIStore((s) => s.theme)

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </span>
    </Button>
  )
}
