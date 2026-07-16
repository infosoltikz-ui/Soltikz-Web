import { create } from 'zustand'
import { generateId } from '@utils/cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id:       string
  type:     ToastType
  title:    string
  message?: string
  duration: number
}

interface UIState {
  /* Sidebar */
  sidebarOpen:     boolean
  setSidebarOpen:  (v: boolean) => void
  toggleSidebar:   () => void

  /* Mobile nav */
  mobileNavOpen:    boolean
  setMobileNavOpen: (v: boolean) => void
  closeMobileNav:   () => void

  /* Command palette */
  commandOpen:    boolean
  setCommandOpen: (v: boolean) => void

  /* Toasts */
  toasts:       Toast[]
  addToast:     (payload: Omit<Toast, 'id'>) => string
  removeToast:  (id: string) => void
  clearToasts:  () => void
  toast:        {
    success: (title: string, message?: string) => string
    error:   (title: string, message?: string) => string
    warning: (title: string, message?: string) => string
    info:    (title: string, message?: string) => string
  }

  /* Modals */
  modals:      Record<string, { open: boolean; data: unknown }>
  openModal:   (id: string, data?: unknown) => void
  closeModal:  (id: string) => void
  isModalOpen: (id: string) => boolean
  getModalData:<T>(id: string) => T | null
}

export const useUIStore = create<UIState>((set, get) => ({
  /* ── Sidebar ── */
  sidebarOpen:    true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar:  () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  /* ── Mobile nav ── */
  mobileNavOpen:    false,
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  closeMobileNav:   () => set({ mobileNavOpen: false }),

  /* ── Command palette ── */
  commandOpen:    false,
  setCommandOpen: (v) => set({ commandOpen: v }),

  /* ── Toasts ── */
  toasts: [],

  addToast: (payload) => {
    const id = generateId()
    const toast: Toast = { id, ...payload }
    set((s) => ({ toasts: [...s.toasts, toast] }))
    if (toast.duration > 0) {
      setTimeout(() => get().removeToast(id), toast.duration)
    }
    return id
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),

  toast: {
    success: (title, message) =>
      get().addToast({ type: 'success', title, message: message ?? '', duration: 4000 }),
    error: (title, message) =>
      get().addToast({ type: 'error', title, message: message ?? '', duration: 6000 }),
    warning: (title, message) =>
      get().addToast({ type: 'warning', title, message: message ?? '', duration: 5000 }),
    info: (title, message) =>
      get().addToast({ type: 'info', title, message: message ?? '', duration: 4000 }),
  },

  /* ── Modals ── */
  modals: {},
  openModal:   (id, data = null) =>
    set((s) => ({ modals: { ...s.modals, [id]: { open: true, data } } })),
  closeModal:  (id) =>
    set((s) => ({ modals: { ...s.modals, [id]: { open: false, data: null } } })),
  isModalOpen: (id) => !!get().modals[id]?.open,
  getModalData: <T,>(id: string) => (get().modals[id]?.data ?? null) as T | null,
}))
