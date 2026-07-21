/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Primary ── */
        primary: {
          DEFAULT: '#16A34A',
          hover:   '#15803D',
          light:   '#DCFCE7',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        /* ── Secondary ── */
        secondary: {
          DEFAULT: '#F97316',
          hover:   '#EA580C',
          light:   '#FED7AA',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        /* ── Semantic Surface tokens ── */
        surface: {
          DEFAULT:  '#FAFAF8',
          card:     '#FFFFFF',
          border:   '#E5E7EB',
          muted:    '#F3F4F6',
        },
        /* ── Dark mode surfaces ── */
        dark: {
          DEFAULT:  '#020617',
          card:     '#0F172A',
          border:   '#1E293B',
          muted:    '#1E293B',
          elevated: '#162032',
          text:     '#F8FAFC',
        },
        /* ── Text ── */
        heading: '#0F172A',
        body:    '#475569',
        muted:   '#94A3B8',
        /* ── Semantic states ── */
        success: {
          DEFAULT: '#16A34A',
          light:   '#DCFCE7',
          dark:    '#14532D',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FEF3C7',
          dark:    '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          light:   '#FEE2E2',
          dark:    '#7F1D1D',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#DBEAFE',
          dark:    '#1E3A5F',
        },
      },
      boxShadow: {
        'xs':        '0 1px 2px rgba(0,0,0,0.05)',
        'soft':      '0 2px 15px rgba(0,0,0,0.06)',
        'card':      '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover':'0 8px 30px rgba(0,0,0,0.12)',
        'button':    '0 1px 2px rgba(0,0,0,0.08)',
        'glow-sm':   '0 0 20px rgba(22,163,74,0.15)',
        'glow':      '0 0 40px rgba(22,163,74,0.20)',
        'glow-lg':   '0 0 60px rgba(22,163,74,0.25)',
        'inner-sm':  'inset 0 1px 2px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
        'spin-slow':   'spin 12s linear infinite',
        'gradient':    'gradientShift 8s ease infinite',
        'shimmer':     'shimmer 1.5s infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'fade-in':     'fadeIn 0.4s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        bounceSoft: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'grid-pattern':    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':     "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.15'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        'noise':           "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
