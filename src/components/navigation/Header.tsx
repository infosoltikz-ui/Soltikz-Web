import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, FileText, ChevronDown } from 'lucide-react'
import { useThemeStore }  from '@store/useThemeStore'
import { useUIStore }     from '@store/useUIStore'
import { Button }         from '@components/ui/Button'
import { NAV_LINKS, ROUTES, APP } from '@constants'
import { cn }             from '@utils/cn'
import { mobileNav }      from '@utils/motion'

export function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [atHero,    setAtHero]    = useState(true)

  const { theme, toggleTheme } = useThemeStore()
  const { mobileNavOpen, setMobileNavOpen } = useUIStore()
  const isDark = theme === 'dark'
  const location = useLocation()

  /* Track scroll to switch header style */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      setAtHero(window.scrollY < 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile nav on route change */
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, setMobileNavOpen])

  const isHome = location.pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-[1020] transition-all duration-300',
          scrolled
            ? 'shadow-soft border-b'
            : isHome ? 'border-b border-transparent' : 'border-b',
          scrolled
            ? 'bg-surface-card/95 dark:bg-dark-card/95 backdrop-blur-md border-surface-border dark:border-dark-border'
            : isHome
            ? 'bg-transparent'
            : 'bg-surface-card dark:bg-dark-card border-surface-border dark:border-dark-border',
        )}
        style={{ height: 'var(--header-height)' }}
      >
        <div className="container-app h-full flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to={ROUTES.HOME}
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label={`${APP.name} home`}>
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center
                            shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <FileText className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight"
              style={{ color: 'var(--color-heading)' }}>
              {APP.name}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => cn(
                  'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary bg-primary-light/50 dark:bg-primary-900/20'
                    : 'text-body dark:text-dark-text hover:text-primary hover:bg-surface-muted dark:hover:bg-dark-muted',
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                'text-muted hover:text-heading',
                'hover:bg-surface-muted dark:hover:bg-dark-muted',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Auth buttons (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to={ROUTES.REGISTER} variant="primary" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center
                         text-muted hover:text-heading
                         hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileNavOpen ? 'close' : 'open'}
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile Nav Dropdown ── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              variants={mobileNav}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden absolute top-full inset-x-0 overflow-hidden
                         bg-surface-card/98 dark:bg-dark-card/98 backdrop-blur-md
                         border-b border-surface-border dark:border-dark-border shadow-soft"
            >
              <nav className="container-app py-4 flex flex-col gap-1"
                aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) => cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary-light/60 dark:bg-primary-900/20'
                        : 'text-body dark:text-dark-text hover:text-primary hover:bg-surface-muted dark:hover:bg-dark-muted',
                    )}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile auth */}
                <div className="mt-3 pt-3 border-t border-surface-border dark:border-dark-border
                                flex flex-col gap-2">
                  <Button as={Link} to={ROUTES.LOGIN} variant="outline" fullWidth>
                    Log in
                  </Button>
                  <Button as={Link} to={ROUTES.REGISTER} variant="primary" fullWidth>
                    Get Started Free
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Header spacer for non-hero pages */}
      {!isHome && <div style={{ height: 'var(--header-height)' }} />}
    </>
  )
}
