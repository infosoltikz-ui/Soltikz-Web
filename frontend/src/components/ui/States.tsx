import { cn } from '@utils/cn'

// ============================================================
// SKELETON
// ============================================================
interface SkeletonProps {
  className?: string
  width?:     string | number
  height?:    string | number
  rounded?:   string
  lines?:     number
}

export function Skeleton({ className, width, height, rounded = 'rounded-lg', lines }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton h-4', rounded, i === lines - 1 && 'w-3/4', className)}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('skeleton', rounded, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

// ── Card Skeleton ──────────────────────────────────────────────
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 shrink-0" rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" rounded="rounded-xl" />
        <Skeleton className="h-8 w-16" rounded="rounded-xl" />
      </div>
    </div>
  )
}

// ============================================================
// SPINNER
// ============================================================
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface SpinnerProps {
  size?:      SpinnerSize
  className?: string
  label?:     string
}

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-[3px]',
}

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center justify-center">
      <span
        className={cn(
          'rounded-full border-current/20 border-t-current animate-spin',
          spinnerSizes[size],
          className,
        )}
        style={{ borderTopColor: 'var(--color-primary)' }}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

// ── Full Page Loader ───────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="flex flex-col items-center gap-4">
        {/* Logo mark */}
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-glow-sm">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <Spinner size="md" />
      </div>
    </div>
  )
}

// ============================================================
// PROGRESS BAR
// ============================================================
interface ProgressProps {
  value:      number   // 0–100
  max?:       number
  label?:     string
  showValue?: boolean
  size?:      'sm' | 'md' | 'lg'
  color?:     'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  className?: string
  animated?:  boolean
}

const progressColors = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  success:   'bg-green-500',
  warning:   'bg-amber-500',
  danger:    'bg-red-500',
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value, max = 100, label, showValue = false, size = 'md',
  color = 'primary', className, animated = true,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium" style={{ color: 'var(--color-body)' }}>{label}</span>}
          {showValue && <span className="text-xs font-semibold" style={{ color: 'var(--color-heading)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={cn('w-full rounded-full overflow-hidden',
          progressSizes[size],
          'bg-surface-muted dark:bg-dark-muted')}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            progressColors[color],
            animated && 'animate-pulse-slow',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon?:        React.ReactNode
  title:        string
  description?: string
  action?:      React.ReactNode
  className?:   string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 gap-4', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-muted dark:bg-dark-muted
                        flex items-center justify-center text-muted">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-xs">
        <h3 className="font-semibold text-base" style={{ color: 'var(--color-heading)' }}>{title}</h3>
        {description && <p className="text-sm text-muted leading-relaxed">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

// ============================================================
// ERROR STATE
// ============================================================
interface ErrorStateProps {
  title?:       string
  description?: string
  onRetry?:     () => void
  className?:   string
}

export function ErrorState({
  title = 'Failed to load',
  description = 'Something went wrong. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 gap-4', className)}>
      <div className="w-16 h-16 rounded-2xl bg-danger-light dark:bg-red-900/20
                      flex items-center justify-center">
        <svg className="w-8 h-8 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="space-y-1 max-w-xs">
        <h3 className="font-semibold" style={{ color: 'var(--color-heading)' }}>{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white
                     hover:bg-primary-hover transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
