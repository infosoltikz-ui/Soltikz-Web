import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion }      from 'framer-motion'
import { ChevronDown, ChevronUp }       from 'lucide-react'
import { cn }                           from '@utils/cn'
import { slideDown }                    from '@utils/motion'

// ============================================================
// ACCORDION
// ============================================================
interface AccordionItem {
  id:       string
  trigger:  React.ReactNode
  content:  React.ReactNode
}

interface AccordionProps {
  items:      AccordionItem[]
  multiple?:  boolean
  className?: string
  defaultOpen?: string[]
}

export function Accordion({ items, multiple = false, defaultOpen = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen)

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : multiple ? [...prev, id] : [id],
    )
  }

  return (
    <div className={cn('divide-y', 'divide-surface-border dark:divide-dark-border', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between py-5 text-left gap-4
                         hover:text-primary transition-colors group"
            >
              <span className="font-medium text-sm sm:text-base"
                style={{ color: 'var(--color-heading)' }}>
                {item.trigger}
              </span>
              <span className={cn(
                'shrink-0 transition-transform duration-300 text-muted group-hover:text-primary',
                isOpen && 'rotate-180',
              )}>
                <ChevronDown className="w-5 h-5" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-${item.id}`}
                  key={`content-${item.id}`}
                  variants={slideDown}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="region"
                >
                  <div className="pb-5 text-sm leading-relaxed text-muted">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// TABS
// ============================================================
interface Tab {
  id:      string
  label:   string
  icon?:   React.ReactNode
  badge?:  string
  content: React.ReactNode
}

interface TabsProps {
  tabs:          Tab[]
  defaultTab?:   string
  onChange?:     (id: string) => void
  className?:    string
  tabsClassName?: string
}

export function Tabs({ tabs, defaultTab, onChange, className, tabsClassName }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const handleSelect = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const next = tabs[(index + 1) % tabs.length]
      tabRefs.current.get(next.id)?.focus()
    } else if (e.key === 'ArrowLeft') {
      const prev = tabs[(index - 1 + tabs.length) % tabs.length]
      tabRefs.current.get(prev.id)?.focus()
    }
  }

  const activeTab = tabs.find((t) => t.id === active)

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          'flex gap-1 p-1 rounded-xl',
          'bg-surface-muted dark:bg-dark-muted',
          'overflow-x-auto no-scrollbar',
          tabsClassName,
        )}
      >
        {tabs.map((tab, i) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => { if (el) tabRefs.current.set(tab.id, el) }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'whitespace-nowrap transition-all duration-200 outline-none',
                isActive
                  ? 'bg-surface-card dark:bg-dark-card text-primary shadow-xs'
                  : 'text-muted hover:text-heading hover:bg-surface-card/50 dark:hover:bg-dark-card/50',
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Panel */}
      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div
            key={active}
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// TOOLTIP
// ============================================================
interface TooltipProps {
  content:    string
  children:   React.ReactNode
  side?:      'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const tooltipPositions = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative inline-flex" aria-describedby={visible ? 'tooltip' : undefined}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            id="tooltip"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-[1070] px-2.5 py-1.5 rounded-lg text-xs font-medium',
              'bg-heading dark:bg-dark-text text-white dark:text-heading',
              'shadow-card pointer-events-none whitespace-nowrap max-w-xs',
              tooltipPositions[side],
              className,
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// DROPDOWN MENU
// ============================================================
interface DropdownItem {
  id:        string
  label:     string
  icon?:     React.ReactNode
  onClick?:  () => void
  danger?:   boolean
  divider?:  boolean
  disabled?: boolean
}

interface DropdownProps {
  trigger:    React.ReactNode
  items:      DropdownItem[]
  align?:     'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-[1060] mt-2 min-w-48 rounded-xl border shadow-card-hover py-1',
              'bg-surface-card dark:bg-dark-card',
              'border-surface-border dark:border-dark-border',
              align === 'right' ? 'right-0' : 'left-0',
            )}
            role="menu"
          >
            {items.map((item) => (
              item.divider
                ? <div key={item.id} className="my-1 border-t border-surface-border dark:border-dark-border" />
                : (
                  <button
                    key={item.id}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => { item.onClick?.(); setOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      item.danger
                        ? 'text-danger hover:bg-danger-light dark:hover:bg-red-900/20'
                        : 'hover:bg-surface-muted dark:hover:bg-dark-muted',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      !item.danger && 'text-body dark:text-dark-text',
                    )}
                  >
                    {item.icon && <span className="shrink-0 w-4 h-4">{item.icon}</span>}
                    {item.label}
                  </button>
                )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
