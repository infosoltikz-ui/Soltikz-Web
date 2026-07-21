import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { THEME_STORAGE_KEY } from '@constants'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme:       Theme
  isDark:      boolean
  setTheme:    (t: Theme) => void
  toggleTheme: () => void
}

/** Apply or remove the `dark` class from <html> immediately */
function applyThemeToDom(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme:  'light',
      isDark: false,

      setTheme: (theme) => {
        applyThemeToDom(theme)
        set({ theme, isDark: theme === 'dark' })
      },

      toggleTheme: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light'
        applyThemeToDom(next)
        set({ theme: next, isDark: next === 'dark' })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      /** Re-apply theme on hydration so it's instant — no flash */
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDom(state.theme)
      },
    },
  ),
)
