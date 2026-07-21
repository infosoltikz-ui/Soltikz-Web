// ============================================================
// FRAMER MOTION ANIMATION VARIANTS
// ============================================================
import type { Variants } from 'framer-motion'

/** Ease curves */
export const ease = {
  out:    [0.16, 1, 0.3, 1]    as const,
  inOut:  [0.45, 0, 0.55, 1]   as const,
  spring: { type: 'spring' as const, damping: 24, stiffness: 300 },
  springBounce: { type: 'spring' as const, damping: 18, stiffness: 280 },
}

/** Fade up — primary entrance animation */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
}

/** Fade in */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

/** Fade from left */
export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } },
}

/** Fade from right */
export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } },
}

/** Scale in */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease.out } },
}

/** Stagger children container */
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

export const staggerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

/** Slide down for accordion/dropdown */
export const slideDown: Variants = {
  hidden:  { opacity: 0, height: 0, overflow: 'hidden' },
  visible: { opacity: 1, height: 'auto', overflow: 'hidden', transition: { duration: 0.3, ease: ease.out } },
  exit:    { opacity: 0, height: 0, overflow: 'hidden', transition: { duration: 0.2, ease: 'easeIn' } },
}

/** Modal overlay */
export const overlay: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
}

/** Modal panel */
export const modalPanel: Variants = {
  hidden:  { opacity: 0, scale: 0.93, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: ease.spring },
  exit:    { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.18 } },
}

/** Drawer — slide from right */
export const drawerRight: Variants = {
  hidden:  { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { ...ease.spring, damping: 28 } },
  exit:    { opacity: 0, x: '100%', transition: { duration: 0.22, ease: 'easeIn' } },
}

/** Mobile menu */
export const mobileNav: Variants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.28, ease: ease.out } },
  exit:    { opacity: 0, height: 0, transition: { duration: 0.2 } },
}

/** Page transition */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: ease.out } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

/** Float for decorative elements */
export const floatY = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

/** Hover card lift */
export const cardLift = {
  rest:  { y: 0, transition: { duration: 0.25, ease: ease.out } },
  hover: { y: -4, transition: { duration: 0.25, ease: ease.out } },
}

/** Magnetic button pulse */
export const buttonPulse = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap:   { scale: 0.97, transition: { duration: 0.1 } },
}

/** Rotating shine effect trigger */
export const shine = {
  rest:  { backgroundPosition: '200% center' },
  hover: { backgroundPosition: '-200% center', transition: { duration: 0.7 } },
}

/** Number counter (controlled via useMotionValue externally) */
export const counterVariant: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
}
