import { cn } from '@utils/cn'

// ── Types ─────────────────────────────────────────────────────
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  variant?:   BadgeVariant
  size?:      BadgeSize
  dot?:       boolean
  children:   React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  primary:   'bg-primary-light text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  secondary: 'bg-secondary-light text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
  success:   'bg-success-light text-green-700 dark:bg-green-900/20 dark:text-green-400',
  warning:   'bg-warning-light text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  danger:    'bg-danger-light text-red-700 dark:bg-red-900/20 dark:text-red-400',
  info:      'bg-info-light text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  neutral:   'bg-surface-muted text-body dark:bg-dark-muted dark:text-dark-text',
}

const dotMap: Record<BadgeVariant, string> = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  success:   'bg-green-500',
  warning:   'bg-amber-500',
  danger:    'bg-red-500',
  info:      'bg-blue-500',
  neutral:   'bg-muted',
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        variantMap[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotMap[variant])} />
      )}
      {children}
    </span>
  )
}

// ── Chip ──────────────────────────────────────────────────────
interface ChipProps {
  children:   React.ReactNode
  onRemove?:  () => void
  variant?:   BadgeVariant
  className?: string
}

export function Chip({ children, onRemove, variant = 'neutral', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border',
        'border-surface-border dark:border-dark-border',
        'bg-surface-card dark:bg-dark-card',
        variantMap[variant],
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="ml-0.5 hover:opacity-70 transition-opacity shrink-0"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}
