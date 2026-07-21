import { AnimatePresence, motion } from 'framer-motion'
import { useEffect }              from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useUIStore }             from '@store/useUIStore'
import { overlay, modalPanel }   from '@utils/motion'
import { cn }                    from '@utils/cn'

// ============================================================
// MODAL
// ============================================================
interface ModalProps {
  id:            string
  title?:        string
  description?:  string
  children?:     React.ReactNode
  footer?:       React.ReactNode
  size?:         'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeable?:    boolean
}

const sizeMap = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({
  id, title, description, children, footer, size = 'md', closeable = true,
}: ModalProps) {
  const isOpen    = useUIStore((s) => s.isModalOpen(id))
  const closeModal = useUIStore((s) => s.closeModal)

  // Close on Escape
  useEffect(() => {
    if (!isOpen || !closeable) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && closeModal(id)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeable, closeModal, id])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1050] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? `${id}-title` : undefined}
        >
          {/* Overlay */}
          <motion.div
            variants={overlay}
            initial="hidden" animate="visible" exit="hidden"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeable ? () => closeModal(id) : undefined}
          />

          {/* Panel */}
          <motion.div
            variants={modalPanel}
            initial="hidden" animate="visible" exit="exit"
            className={cn(
              'relative w-full rounded-2xl shadow-card-hover overflow-hidden',
              'bg-surface-card dark:bg-dark-card',
              'border border-surface-border dark:border-dark-border',
              sizeMap[size],
            )}
          >
            {/* Header */}
            {(title || closeable) && (
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  {title && (
                    <h2 id={`${id}-title`}
                      className="text-lg font-bold"
                      style={{ color: 'var(--color-heading)' }}>
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-muted mt-1">{description}</p>
                  )}
                </div>
                {closeable && (
                  <button
                    onClick={() => closeModal(id)}
                    aria-label="Close modal"
                    className="ml-4 shrink-0 p-1.5 rounded-lg text-muted
                               hover:bg-surface-muted dark:hover:bg-dark-muted
                               hover:text-heading transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            {children && (
              <div className="px-6 pb-6">{children}</div>
            )}

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-surface-border dark:border-dark-border
                             flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// DRAWER
// ============================================================
import { drawerRight } from '@utils/motion'

interface DrawerProps {
  id:         string
  title?:     string
  children?:  React.ReactNode
  footer?:    React.ReactNode
  side?:      'right' | 'left'
  width?:     string
}

export function Drawer({
  id, title, children, footer, width = 'max-w-md',
}: DrawerProps) {
  const isOpen    = useUIStore((s) => s.isModalOpen(id))
  const closeModal = useUIStore((s) => s.closeModal)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && closeModal(id)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeModal, id])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1050] flex">
          <motion.div
            variants={overlay}
            initial="hidden" animate="visible" exit="hidden"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => closeModal(id)}
          />
          <motion.div
            variants={drawerRight}
            initial="hidden" animate="visible" exit="exit"
            className={cn(
              'relative ml-auto h-full flex flex-col',
              'bg-surface-card dark:bg-dark-card',
              'border-l border-surface-border dark:border-dark-border',
              'shadow-card-hover w-full',
              width,
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-border dark:border-dark-border">
              {title && (
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-heading)' }}>
                  {title}
                </h2>
              )}
              <button
                onClick={() => closeModal(id)}
                aria-label="Close drawer"
                className="p-1.5 rounded-lg text-muted hover:bg-surface-muted dark:hover:bg-dark-muted
                           hover:text-heading transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {footer && (
              <div className="p-6 border-t border-surface-border dark:border-dark-border">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// TOAST CONTAINER
// ============================================================
const toastVariant = {
  hidden:  { opacity: 0, y: -12, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.2 } },
}

const toastIconMap = {
  success: { icon: CheckCircle2, className: 'text-green-500' },
  error:   { icon: AlertCircle,  className: 'text-red-500'   },
  warning: { icon: AlertTriangle,className: 'text-amber-500' },
  info:    { icon: Info,         className: 'text-blue-500'  },
}

export function ToastContainer() {
  const toasts      = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)

  return (
    <div
      className="fixed top-4 right-4 z-[1080] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const { icon: Icon, className: iconClass } = toastIconMap[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              variants={toastVariant}
              initial="hidden" animate="visible" exit="exit"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-card-hover',
                'bg-surface-card dark:bg-dark-card',
                'border border-surface-border dark:border-dark-border',
              )}
              role="alert"
            >
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconClass)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss"
                className="shrink-0 text-muted hover:text-heading transition-colors p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// ALERT
// ============================================================
type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?:   AlertVariant
  title:      string
  message?:   string
  onClose?:   () => void
  className?: string
}

const alertStyles: Record<AlertVariant, { wrapper: string; icon: React.ElementType; iconClass: string }> = {
  success: { wrapper: 'bg-success-light border-green-200 dark:bg-green-900/20 dark:border-green-800',   icon: CheckCircle2,  iconClass: 'text-green-600 dark:text-green-400' },
  error:   { wrapper: 'bg-danger-light border-red-200 dark:bg-red-900/20 dark:border-red-800',          icon: AlertCircle,   iconClass: 'text-red-600 dark:text-red-400'   },
  warning: { wrapper: 'bg-warning-light border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',   icon: AlertTriangle, iconClass: 'text-amber-600 dark:text-amber-400' },
  info:    { wrapper: 'bg-info-light border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',         icon: Info,          iconClass: 'text-blue-600 dark:text-blue-400'  },
}

export function Alert({ variant = 'info', title, message, onClose, className }: AlertProps) {
  const { wrapper, icon: Icon, iconClass } = alertStyles[variant]
  return (
    <div role="alert"
      className={cn('flex items-start gap-3 p-4 rounded-xl border', wrapper, className)}>
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{title}</p>
        {message && <p className="text-xs mt-0.5 text-muted leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="shrink-0 text-muted hover:text-heading transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
