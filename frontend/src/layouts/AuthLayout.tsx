import { Link, Outlet } from 'react-router-dom'
import { motion }        from 'framer-motion'
import { FileText }      from 'lucide-react'
import { useThemeStore } from '@store/useThemeStore'
import { Sun, Moon }     from 'lucide-react'
import { APP, ROUTES }   from '@constants'
import { ToastContainer } from '@components/ui/Overlay'

/**
 * AuthLayout — centered card layout for Login / Register pages
 */
export function AuthLayout() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-dvh flex flex-col mesh-bg" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between p-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group" aria-label="Home">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--color-heading)' }}>
            {APP.name}
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted
                     hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted
                     transition-colors"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted pb-6">
        © {new Date().getFullYear()} {APP.name} — 
        <Link to="/privacy" className="hover:text-primary ml-1 transition-colors">Privacy</Link>
        {' · '}
        <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
      </p>

      <ToastContainer />
    </div>
  )
}
