import { forwardRef } from 'react'
import { AlertCircle, Eye, EyeOff, Search, X } from 'lucide-react'
import { cn } from '@utils/cn'
import { useState } from 'react'

// ============================================================
// INPUT
// ============================================================
type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string
  error?:     string
  hint?:      string
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: InputSize
  fullWidth?: boolean
}

const inputSizeMap: Record<InputSize, string> = {
  sm: 'h-8  text-xs px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-4',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, error, hint,
      leftIcon, rightIcon,
      inputSize = 'md',
      fullWidth = true,
      className, id, type = 'text',
      ...props
    },
    ref,
  ) => {
    const [showPwd, setShowPwd] = useState(false)
    const isPassword = type === 'password'
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: 'var(--color-heading)' }}>
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPwd ? 'text' : 'password') : type}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'input-base',
              inputSizeMap[inputSize],
              leftIcon  && 'pl-10',
              (rightIcon || isPassword || error) && 'pr-10',
              error && 'border-danger focus:ring-danger/30 focus:border-danger',
              className,
            )}
            {...props}
          />

          {/* Right slot */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 text-muted hover:text-heading transition-colors"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : error ? (
            <AlertCircle className="absolute right-3 w-4 h-4 text-danger pointer-events-none" />
          ) : rightIcon ? (
            <span className="absolute right-3 text-muted pointer-events-none">{rightIcon}</span>
          ) : null}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert"
            className="text-xs text-danger flex items-center gap-1">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-muted">{hint}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

// ============================================================
// TEXTAREA
// ============================================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string
  error?:    string
  hint?:     string
  fullWidth?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const textareaId = id ?? `ta-${Math.random().toString(36).slice(2, 7)}`
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium"
            style={{ color: 'var(--color-heading)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          className={cn(
            'input-base resize-y min-h-[100px] py-3',
            error && 'border-danger focus:ring-danger/30 focus:border-danger',
            className,
          )}
          {...props}
        />
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

// ============================================================
// SELECT
// ============================================================
interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:    string
  error?:    string
  hint?:     string
  options:   SelectOption[]
  fullWidth?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, fullWidth = true, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? `sel-${Math.random().toString(36).slice(2, 7)}`
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium"
            style={{ color: 'var(--color-heading)' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            'input-base h-10 appearance-none cursor-pointer',
            error && 'border-danger focus:ring-danger/30 focus:border-danger',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'

// ============================================================
// CHECKBOX
// ============================================================
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?:       string
  description?: string
  error?:       string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const cbId = id ?? `cb-${Math.random().toString(36).slice(2, 7)}`
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={cbId}
            type="checkbox"
            className={cn(
              'mt-0.5 h-4 w-4 rounded border cursor-pointer',
              'border-surface-border dark:border-dark-border',
              'text-primary focus:ring-primary/30 focus:ring-2',
              'bg-surface-card dark:bg-dark-card',
              className,
            )}
            {...props}
          />
          {(label || description) && (
            <label htmlFor={cbId} className="cursor-pointer select-none">
              {label && (
                <span className="block text-sm font-medium"
                  style={{ color: 'var(--color-heading)' }}>
                  {label}
                </span>
              )}
              {description && (
                <span className="block text-xs mt-0.5 text-muted">{description}</span>
              )}
            </label>
          )}
        </div>
        {error && <p role="alert" className="text-xs text-danger ml-7">{error}</p>}
      </div>
    )
  },
)
Checkbox.displayName = 'Checkbox'

// ============================================================
// RADIO
// ============================================================
interface RadioOption { value: string; label: string; description?: string }
interface RadioGroupProps {
  name:      string
  label?:    string
  options:   RadioOption[]
  value?:    string
  onChange?: (value: string) => void
  error?:    string
}

export function RadioGroup({ name, label, options, value, onChange, error }: RadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      {label && (
        <legend className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>
          {label}
        </legend>
      )}
      <div className="space-y-2">
        {options.map((opt) => {
          const radioId = `${name}-${opt.value}`
          return (
            <label key={opt.value} htmlFor={radioId}
              className="flex items-start gap-3 cursor-pointer group">
              <input
                id={radioId}
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange?.(opt.value)}
                className="mt-0.5 h-4 w-4 border text-primary
                           focus:ring-primary/30 focus:ring-2 cursor-pointer
                           border-surface-border dark:border-dark-border
                           bg-surface-card dark:bg-dark-card"
              />
              <span>
                <span className="block text-sm font-medium group-hover:text-primary transition-colors"
                  style={{ color: 'var(--color-heading)' }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="block text-xs text-muted mt-0.5">{opt.description}</span>
                )}
              </span>
            </label>
          )
        })}
      </div>
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
    </fieldset>
  )
}

// ============================================================
// SWITCH
// ============================================================
interface SwitchProps {
  checked:    boolean
  onChange:   (v: boolean) => void
  label?:     string
  description?: string
  disabled?:  boolean
  size?:      'sm' | 'md'
}

export function Switch({
  checked, onChange, label, description, disabled = false, size = 'md',
}: SwitchProps) {
  const sizeMap = {
    sm: { track: 'w-8 h-4',  thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  }
  const s = sizeMap[size]

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex items-center shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          checked ? 'bg-primary' : 'bg-surface-border dark:bg-dark-border',
          disabled && 'opacity-50 cursor-not-allowed',
          s.track,
        )}
      >
        <span className={cn(
          'inline-block rounded-full bg-white shadow-xs',
          'transform transition-transform duration-200',
          checked ? s.translate : 'translate-x-0',
          s.thumb,
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && (
            <span className="block text-sm font-medium"
              style={{ color: 'var(--color-heading)' }}>{label}</span>
          )}
          {description && <span className="block text-xs text-muted mt-0.5">{description}</span>}
        </div>
      )}
    </div>
  )
}

// ============================================================
// SEARCH INPUT
// ============================================================
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?:  () => void
  loading?:  boolean
}

export function SearchInput({ onClear, loading, value, className, ...props }: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
      <input
        type="search"
        value={value}
        className={cn('input-base h-10 pl-10 pr-10', className)}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 text-muted hover:text-heading transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
