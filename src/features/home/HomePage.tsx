import { useRef } from 'react'
import { Link }   from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  ArrowRight, CheckCircle2, Star, Sparkles, Zap,
  Target, Download, BarChart2, Layout, Play,
  ChevronDown, Shield, Users, Award,
} from 'lucide-react'
import { Button }                          from '@components/ui/Button'
import { Badge }                           from '@components/ui/Badge'
import { Accordion }                       from '@components/ui/Navigation'
import { STATS, COMPANIES, FEATURES_LIST,
         TESTIMONIALS, PRICING_PLANS, FAQ_ITEMS,
         HOW_IT_WORKS, ROUTES }            from '@constants'
import { cn }                              from '@utils/cn'
import { stagger, fadeUp, staggerFast }   from '@utils/motion'

// ── Viewport-triggered animation helper ──────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px', amount: threshold })
  return { ref, inView }
}

// ── Animated counter ──────────────────────────────────────────
function AnimatedCounter({ from = 0, to, suffix = '' }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const count  = useMotionValue(from)
  const spring = useSpring(count, { damping: 60, stiffness: 100 })
  const display = useTransform(spring, (v) => {
    if (suffix === '+')  return `${Math.round(v).toLocaleString()}+`
    if (suffix === '%')  return `${Math.round(v)}%`
    if (suffix === '★')  return `${v.toFixed(1)}★`
    return `${Math.round(v).toLocaleString()}${suffix}`
  })

  useEffect(() => {
    if (inView) count.set(to)
  }, [inView, count, to])

  return <motion.span ref={ref}>{display}</motion.span>
}

// ============================================================
// SECTION COMPONENTS
// ============================================================

// ── Hero ──────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden mesh-bg"
      aria-label="Hero"
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-10" />
      </div>

      <div className="container-app relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Eyebrow badge */}
            <motion.div variants={fadeUp}>
              <span className="badge-primary text-xs gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered ATS Resume Builder
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="heading-display text-balance">
              Build Resumes That{' '}
              <span className="gradient-text-warm">Beat ATS</span>{' '}
              and Win Interviews
            </motion.h1>

            {/* Sub-copy */}
            <motion.p variants={fadeUp} className="body-lg max-w-xl">
              Our AI analyzes your experience, matches it to any job description,
              and generates ATS-optimized content in seconds. Stop getting filtered
              out — start getting hired.
            </motion.p>

            {/* Social proof strip */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['SC', 'MJ', 'PP', 'AR', 'EW'].map((init, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full border-2 border-surface-card dark:border-dark-card
                               bg-gradient-to-br from-primary to-secondary
                               flex items-center justify-center text-white text-[10px] font-bold">
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted">Trusted by <strong className="text-heading dark:text-dark-text">2.4M+</strong> professionals</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button as={Link} to={ROUTES.REGISTER} size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Build My Resume Free
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Play className="w-4 h-4" />}>
                Watch Demo
              </Button>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-muted">
              ✓ No credit card required &nbsp; ✓ Free plan forever &nbsp; ✓ Cancel anytime
            </motion.p>
          </motion.div>

          {/* Right — illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main resume card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="card p-6 space-y-4 shadow-glow"
              >
                {/* Resume header */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-heading dark:bg-dark-text rounded-lg mb-2" />
                    <div className="h-3 w-24 bg-surface-muted dark:bg-dark-muted rounded" />
                    <div className="h-3 w-40 bg-surface-muted dark:bg-dark-muted rounded mt-1.5" />
                  </div>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-primary/30 rounded" />
                  {[100, 90, 95].map((w, i) => (
                    <div key={i} className="h-2.5 rounded" style={{
                      width: `${w}%`,
                      background: 'var(--color-border)',
                    }} />
                  ))}
                </div>

                {/* ATS score badge */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-border dark:border-dark-border">
                  <span className="text-xs text-muted font-medium">ATS Score</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full overflow-hidden bg-surface-muted dark:bg-dark-muted">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '94%' }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary">94%</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating AI badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 card px-4 py-3 flex items-center gap-2 shadow-glow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-heading)' }}>AI Optimized</p>
                  <p className="text-[10px] text-muted">Content ready</p>
                </div>
              </motion.div>

              {/* Floating interviews badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-4 -left-4 card px-4 py-3 flex items-center gap-2 shadow-glow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-heading)' }}>Interview Rate</p>
                  <p className="text-[10px] text-muted">+340% increase</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  )
}

// ── Trusted Companies ─────────────────────────────────────────
function TrustedSection() {
  const { ref, inView } = useReveal()

  return (
    <section ref={ref} className="py-12 border-y border-surface-border dark:border-dark-border"
      aria-label="Trusted by professionals at">
      <div className="container-app">
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          className="text-center text-xs font-semibold uppercase tracking-widest text-muted mb-8"
        >
          Trusted by professionals at
        </motion.p>
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 w-max"
          >
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <span key={`${name}-${i}`}
                className="text-lg font-bold text-muted/50 hover:text-muted transition-colors whitespace-nowrap cursor-default select-none">
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
function StatsSection() {
  const { ref, inView } = useReveal()
  const statValues = [2400000, 94, 680000, 4.9]
  const statSuffixes = ['+', '%', '+', '★']

  return (
    <section ref={ref} className="section-y" aria-label="Statistics">
      <div className="container-app">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-black gradient-text">
                <AnimatedCounter to={statValues[i]} suffix={statSuffixes[i]} />
              </div>
              <p className="text-sm text-muted font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────
function HowItWorksSection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y bg-surface-muted dark:bg-dark-muted/30" aria-label="How it works">
      <div className="container-app space-y-16">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="primary" dot>How it works</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="heading-2">From zero to interview-ready in minutes</motion.h2>
          <motion.p variants={fadeUp} className="body-lg">Three simple steps to a job-winning resume.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={step.step} variants={fadeUp}>
              <div className="card-hover p-8 space-y-5 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-black text-surface-muted dark:text-dark-muted/50 select-none">
                  {step.step}
                </div>
                <div className="relative w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary-900/20
                                flex items-center justify-center mx-auto">
                  <span className="text-2xl font-black text-primary">{i + 1}</span>
                </div>
                <h3 className="heading-3">{step.title}</h3>
                <p className="body-sm">{step.description}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────
const FeatureIconMap: Record<string, React.ElementType> = {
  Sparkles, Target, Layout, Zap, Download, BarChart2,
}

function FeaturesSection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y" id="features" aria-label="Features">
      <div className="container-app space-y-16">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="secondary" dot>Powerful Features</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="heading-2">
            Everything you need to land the job
          </motion.h2>
          <motion.p variants={fadeUp} className="body-lg">
            One tool. Every feature you need to build, optimize, and track your job search.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES_LIST.map((feat, i) => {
            const Icon = FeatureIconMap[feat.icon] ?? Sparkles
            const isPrimary = feat.color === 'primary'
            return (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card p-6 space-y-4 group cursor-pointer"
              >
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300',
                  isPrimary
                    ? 'bg-primary-light dark:bg-primary-900/30 group-hover:bg-primary group-hover:shadow-glow-sm'
                    : 'bg-secondary-light dark:bg-secondary-900/30 group-hover:bg-secondary',
                )}>
                  <Icon className={cn(
                    'w-6 h-6 transition-colors duration-300',
                    isPrimary
                      ? 'text-primary group-hover:text-white'
                      : 'text-secondary group-hover:text-white',
                  )} />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feat.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ── ATS Why Section ───────────────────────────────────────────
function ATSSection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y bg-surface-muted dark:bg-dark-muted/30" aria-label="Why ATS matters">
      <div className="container-app">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ATS Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>ATS Analysis Report</span>
                <Badge variant="success" dot>Live Score</Badge>
              </div>

              {[
                { label: 'Keyword Match',      score: 94, color: 'primary' as const   },
                { label: 'Format Compliance',  score: 100, color: 'success' as const  },
                { label: 'Section Completeness', score: 88, color: 'primary' as const },
                { label: 'Action Verbs',       score: 91, color: 'secondary' as const },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--color-body)' }}>{item.label}</span>
                    <span className="font-bold" style={{ color: 'var(--color-heading)' }}>{item.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-muted dark:bg-dark-muted overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', {
                        'bg-primary': item.color === 'primary',
                        'bg-green-500': item.color === 'success',
                        'bg-secondary': item.color === 'secondary',
                      })}
                      initial={{ width: '0%' }}
                      animate={inView ? { width: `${item.score}%` } : {}}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-light dark:bg-primary-900/20">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-primary-700 dark:text-primary-300 font-medium">
                  Your resume is highly ATS-compatible and ready to submit.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={fadeUp}><Badge variant="danger" dot>Why it matters</Badge></motion.div>
            <motion.h2 variants={fadeUp} className="heading-2">
              75% of resumes never reach a human
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg">
              ATS software automatically filters out resumes that don't match the right keywords,
              format, and structure. Most candidates don't even know this is happening.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-4">
              {[
                { icon: Target, text: 'Match exact keywords from the job description' },
                { icon: Shield, text: 'Use ATS-friendly formatting and structure'     },
                { icon: Award,  text: 'Stand out to both machines and human recruiters' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-light dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-body)' }}>{text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button as={Link} to={ROUTES.REGISTER} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Check My ATS Score
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function TestimonialsSection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y" aria-label="Testimonials">
      <div className="container-app space-y-16">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="primary" dot>Success Stories</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="heading-2">Thousands hired, every week</motion.h2>
          <motion.p variants={fadeUp} className="body-lg">Real results from real professionals.</motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="card p-6 space-y-4 group cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted line-clamp-3">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-surface-border dark:border-dark-border">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary
                                text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{t.name}</p>
                  <p className="text-xs text-muted">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing Preview ───────────────────────────────────────────
function PricingSection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y bg-surface-muted dark:bg-dark-muted/30" id="pricing" aria-label="Pricing">
      <div className="container-app space-y-16">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="secondary" dot>Pricing</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="heading-2">Simple, transparent pricing</motion.h2>
          <motion.p variants={fadeUp} className="body-lg">
            Start free. Upgrade when you're ready. No hidden fees.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={cn(
                'card p-8 space-y-6',
                plan.highlighted
                  ? 'border-primary ring-1 ring-primary shadow-glow relative'
                  : '',
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" className="shadow-glow-sm">{plan.badge}</Badge>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-heading)' }}>{plan.name}</h3>
                <p className="text-xs text-muted">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-4xl font-black" style={{ color: 'var(--color-heading)' }}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-muted mb-1">/ {plan.period}</span>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted">{feat}</span>
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                to={plan.id === 'enterprise' ? '#' : ROUTES.REGISTER}
                variant={plan.highlighted ? 'primary' : 'outline'}
                fullWidth
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
function FAQSection() {
  const { ref, inView } = useReveal()
  const faqItems = FAQ_ITEMS.map((f, i) => ({
    id:      String(i),
    trigger: f.q,
    content: f.a,
  }))

  return (
    <section ref={ref} className="section-y" id="faq" aria-label="FAQ">
      <div className="container-app space-y-12 max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center space-y-4">
          <motion.div variants={fadeUp}><Badge variant="neutral" dot>FAQ</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="heading-2">Frequently asked questions</motion.h2>
          <motion.p variants={fadeUp} className="body-lg">
            Everything you need to know. Can't find the answer?{' '}
            <a href="mailto:support@resumeai.io" className="text-primary hover:underline">Email us.</a>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Accordion items={faqItems} className="card px-8" />
        </motion.div>
      </div>
    </section>
  )
}

// ── Newsletter / CTA ──────────────────────────────────────────
function CTASection() {
  const { ref, inView } = useReveal()
  return (
    <section ref={ref} className="section-y" aria-label="Get started">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center space-y-8"
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #15803d 100%)',
          }}
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}
          />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative space-y-6">
            <Users className="w-12 h-12 text-white/70 mx-auto" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-balance">
              Ready to land your dream job?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Join 2.4M+ professionals who've used ResumeAI to get more interviews and better offers.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Build My Resume Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                View Templates
              </Button>
            </div>

            <p className="text-white/60 text-sm">
              No credit card required · Free forever plan available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── HOME PAGE ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustedSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ATSSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
