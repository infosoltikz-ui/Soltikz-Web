import { useEffect } from 'react'
import { useThemeStore } from '@store/useThemeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * ThemeProvider
 * Subscribes to the theme store and keeps the DOM in sync.
 * Renders children immediately — no layout shift.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}
