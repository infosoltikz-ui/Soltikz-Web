import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@utils/cn'

// ── Types ─────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  pill?:      boolean
  as?:        any
  to?:        string
}

// ── Style maps ────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-button hover:bg-primary-hover active:scale-[0.98] ' +
    'dark:bg-primary dark:hover:bg-primary-hover',
  secondary:
    'bg-secondary text-white shadow-button hover:bg-secondary-hover active:scale-[0.98] ' +
    'dark:bg-secondary dark:hover:bg-secondary-hover',
  outline:
    'border bg-transparent hover:bg-surface-muted dark:hover:bg-dark-muted active:scale-[0.98] ' +
    'border-surface-border dark:border-dark-border ' +
    'text-heading dark:text-dark-text',
  ghost:
    'bg-transparent hover:bg-surface-muted dark:hover:bg-dark-muted active:scale-[0.98] ' +
    'text-heading dark:text-dark-text',
  danger:
    'bg-danger text-white shadow-button hover:bg-red-600 active:scale-[0.98]',
  link:
    'bg-transparent underline-offset-4 hover:underline p-0 h-auto ' +
    'text-primary hover:text-primary-hover',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7  px-3  text-xs  gap-1   rounded-lg',
  sm: 'h-8  px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-10 px-5  text-sm gap-2   rounded-xl',
  lg: 'h-11 px-6  text-base gap-2 rounded-xl',
  xl: 'h-13 px-8  text-base gap-2.5 rounded-2xl',
}

// ── Component ─────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      pill      = false,
      className,
      children,
      disabled,
      as,
      to,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading
    const Component = as ? motion.create(as as any) : motion.button

    return (
      <Component
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        whileHover={isDisabled ? {} : { scale: variant === 'link' ? 1 : 1.01 }}
        transition={{ duration: 0.15 }}
        className={cn(
          // Base
          'relative inline-flex items-center justify-center font-medium',
          'select-none transition-all duration-200 focus-visible:ring-2',
          'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none',
          // Variant & size
          variantClasses[variant],
          sizeClasses[size],
          // Modifiers
          pill && '!rounded-full',
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        to={to}
        {...(props as any)}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        {children && (
          <span className={cn(loading && 'opacity-0 absolute')}>{children}</span>
        )}

        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </Component>
    )
  },
)

Button.displayName = 'Button'

// ── Icon Button ───────────────────────────────────────────────
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon:       React.ReactNode
  label:      string
  size?:      ButtonSize
}

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: 'w-7  h-7  rounded-lg',
  sm: 'w-8  h-8  rounded-xl',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-11 h-11 rounded-xl',
  xl: 'w-13 h-13 rounded-2xl',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'md', variant = 'ghost', className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label={label}
      className={cn('p-0', iconSizeClasses[size], className)}
      {...props}
    >
      {icon}
    </Button>
  ),
)

IconButton.displayName = 'IconButton'
