import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  FileText, LayoutDashboard, Files, Target, PenLine,
  User, CreditCard, Settings, ChevronLeft, ChevronRight,
  Bell, Search, Sun, Moon, LogOut, Menu,
} from 'lucide-react'
import { useThemeStore }  from '@store/useThemeStore'
import { useUIStore }     from '@store/useUIStore'
import { useAuthStore }   from '../store/useAuthStore'
import api from '../utils/axios'
import { APP, ROUTES }    from '@constants'
import { cn }             from '@utils/cn'
import { ToastContainer } from '@components/ui/Overlay'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: ROUTES.DASHBOARD },
  { icon: Files,           label: 'My Resumes',   href: '/dashboard/resumes' },
  { icon: Target,          label: 'ATS Checker',  href: '/dashboard/ats' },
  { icon: PenLine,         label: 'Cover Letters', href: '/dashboard/cover-letters' },
  { icon: User,            label: 'Profile',       href: '/dashboard/profile' },
  { icon: CreditCard,      label: 'Billing',       href: '/dashboard/billing' },
  { icon: Settings,        label: 'Settings',      href: '/dashboard/settings' },
]

export function DashboardLayout() {
  const { theme, toggleTheme } = useThemeStore()
  const { sidebarOpen, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  const isDark = theme === 'dark'
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.error(e)
    } finally {
      logout()
      navigate(ROUTES.LOGIN)
    }
  }

  const userInitials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  return (
    <div className="flex min-h-dvh" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── Sidebar (desktop) ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col border-r border-surface-border dark:border-dark-border
                   bg-surface-card dark:bg-dark-card shrink-0 overflow-hidden"
        aria-label="Dashboard sidebar"
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-2.5 px-4 shrink-0',
          'border-b border-surface-border dark:border-dark-border',
        )}
          style={{ height: 'var(--header-height)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-glow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-base whitespace-nowrap"
                style={{ color: 'var(--color-heading)' }}
              >
                {APP.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href
            return (
              <NavLink
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-150 group relative',
                  isActive
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-body dark:text-muted hover:bg-surface-muted dark:hover:bg-dark-muted hover:text-primary',
                )}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && !sidebarOpen && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-surface-border dark:border-dark-border flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium flex-1',
              'text-muted hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors',
            )}
          >
            {sidebarOpen
              ? <><ChevronLeft className="w-4 h-4 shrink-0" /><span>Collapse</span></>
              : <ChevronRight className="w-4 h-4 shrink-0 mx-auto" />
            }
          </button>
          
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </motion.aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[1030] bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 z-[1040] w-64
                         bg-surface-card dark:bg-dark-card border-r border-surface-border dark:border-dark-border
                         flex flex-col"
            >
              <div className="flex items-center gap-2.5 px-4 border-b border-surface-border dark:border-dark-border"
                style={{ height: 'var(--header-height)' }}>
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base" style={{ color: 'var(--color-heading)' }}>{APP.name}</span>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                  <NavLink
                    key={href}
                    to={href}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-body hover:bg-surface-muted dark:hover:bg-dark-muted hover:text-primary',
                    )}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {label}
                  </NavLink>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-4.5 h-4.5 shrink-0" />
                  Logout
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Dashboard Header */}
        <header
          className="sticky top-0 z-[1020] flex items-center justify-between px-4 sm:px-6 gap-4
                     border-b border-surface-border dark:border-dark-border
                     bg-surface-card/95 dark:bg-dark-card/95 backdrop-blur-md"
          style={{ height: 'var(--header-height)' }}
        >
          {/* Left — mobile menu + breadcrumb placeholder */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center
                         text-muted hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>Dashboard</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button aria-label="Search"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted
                         hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button aria-label="Notifications"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted
                         hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full" aria-hidden />
            </button>
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted
                         hover:text-heading hover:bg-surface-muted dark:hover:bg-dark-muted transition-colors">
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Avatar */}
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-xl ml-1 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-primary text-white text-xs font-bold
                              flex items-center justify-center cursor-pointer ml-1">
                {userInitials}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main id="dashboard-content" className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
