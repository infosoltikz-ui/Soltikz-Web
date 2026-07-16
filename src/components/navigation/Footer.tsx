import { Link } from 'react-router-dom'
import { FileText, MessageCircle, Briefcase, Code, PlaySquare } from 'lucide-react'
import { APP, FOOTER_LINKS, SOCIAL_LINKS } from '@constants'
import { cn } from '@utils/cn'

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Twitter: MessageCircle,
  Linkedin: Briefcase,
  Github: Code,
  Youtube: PlaySquare,
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-surface-border dark:border-dark-border
                 bg-surface-card dark:bg-dark-card"
      aria-label="Site footer"
    >
      <div className="container-app py-16 lg:py-20">

        {/* ── Top Row ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="Home">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center
                              shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl" style={{ color: 'var(--color-heading)' }}>
                {APP.name}
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-muted max-w-xs">
              {APP.description}. Built for ambitious professionals who want to land their dream job faster.
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Stay Updated
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="input-base h-9 text-xs flex-1"
                />
                <button
                  type="submit"
                  className="px-4 h-9 rounded-xl bg-primary text-white text-xs font-semibold
                             hover:bg-primary-hover transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.values(FOOTER_LINKS).map((col) => (
              <div key={col.title} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className={cn(
                          'text-sm transition-colors duration-200',
                          'text-body dark:text-muted',
                          'hover:text-primary dark:hover:text-primary-300',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="mt-12 pt-8 border-t border-surface-border dark:border-dark-border
                        flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-muted order-2 sm:order-1">
            © {currentYear} {APP.name}, Inc. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${s.name}`}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    'text-muted hover:text-primary',
                    'hover:bg-primary-light dark:hover:bg-primary-900/20',
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </a>
              )
            })}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 order-3 text-xs text-muted">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
