import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, FileText } from 'lucide-react'
import { useUIStore }     from '@store/useUIStore'
import { Button }         from '@components/ui/Button'
import { ROUTES, NAV_LINKS } from '@constants'
import { cn }             from '@utils/cn'

export function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const { mobileNavOpen, setMobileNavOpen } = useUIStore()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
            ? 'shadow-sm border-b bg-white/95 backdrop-blur-md border-slate-200'
            : isHome
            ? 'bg-white border-transparent'
            : 'bg-white border-slate-200',
        )}
        style={{ height: '72px' }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4 max-w-7xl">

          {/* Logo */}
          <Link to={ROUTES.HOME}
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="ATS Resume Builder home">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              ATS
              <span className="block text-[11px] font-semibold text-slate-600 tracking-normal mt-0.5">Resume Builder</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link to={ROUTES.LOGIN} className="hidden sm:block text-sm font-bold text-slate-700 hover:text-primary transition-colors">
              Log In
            </Link>
            <Button as={Link} to={ROUTES.REGISTER} className="font-bold rounded-lg shadow-sm hover:shadow-md transition-all px-6">
              Get Started Free
            </Button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -mr-2 text-slate-700"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[1010] bg-white pt-24 px-4 pb-6 overflow-y-auto"
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-lg font-bold text-slate-800 p-4 rounded-xl bg-slate-50 active:bg-slate-100"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-4 border-slate-100" />
              <Link
                to={ROUTES.LOGIN}
                className="text-lg font-bold text-slate-800 p-4 rounded-xl bg-slate-50 text-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Log In
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
