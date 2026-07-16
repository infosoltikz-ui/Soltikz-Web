// ============================================================
// UTILITY FUNCTIONS
// ============================================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price */
export function formatPrice(amount: number, currency = 'USD') {
  if (amount === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Truncate text */
export function truncate(str: string, len = 80): string {
  return str.length > len ? `${str.slice(0, len)}…` : str
}

/** Debounce */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/** Sleep */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Generate short ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

/** Clamp number */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Format big numbers */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

/** Check if running on client */
export const isClient = typeof window !== 'undefined'

/** Get CSS variable value */
export function getCssVar(name: string): string {
  if (!isClient) return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Scroll element into view */
export function scrollToId(id: string, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

/** Validate email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Pluralize */
export function pluralize(count: number, word: string, suffix = 's'): string {
  return `${count} ${word}${count !== 1 ? suffix : ''}`
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
