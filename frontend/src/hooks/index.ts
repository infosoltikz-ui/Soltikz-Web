import { useState, useEffect, useRef, useCallback } from 'react'

// ── useDebounce ───────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ── useLocalStorage ───────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }, [key])

  return [value, setStoredValue] as const
}

// ── useMediaQuery ─────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ── useIsMobile ───────────────────────────────────────────────
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

// ── useIsTablet ───────────────────────────────────────────────
export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

// ── useScrollY ────────────────────────────────────────────────
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return scrollY
}

// ── useClickOutside ───────────────────────────────────────────
export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

// ── useKeyboard ───────────────────────────────────────────────
export function useKeyboard(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options: { ctrlKey?: boolean; metaKey?: boolean } = {},
) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const ctrlOk  = !options.ctrlKey  || e.ctrlKey
      const metaOk  = !options.metaKey  || e.metaKey
      if (e.key === key && ctrlOk && metaOk) handler(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key, handler, options.ctrlKey, options.metaKey])
}

// ── useCopyToClipboard ────────────────────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [])

  return { copy, copied }
}

// ── useCounter ───────────────────────────────────────────────
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset:     () => setCount(initial),
    set:       setCount,
  }
}

// ── usePrevious ───────────────────────────────────────────────
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined)
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}
