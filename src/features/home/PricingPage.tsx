import { motion }   from 'framer-motion'
import { Link }     from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button }   from '@components/ui/Button'
import { Badge }    from '@components/ui/Badge'
import { PRICING_PLANS, ROUTES } from '@constants'
import { cn }       from '@utils/cn'
import { stagger, fadeUp } from '@utils/motion'

export default function PricingPage() {
  return (
    <div className="section-y mesh-bg">
      <div className="container-app space-y-16">
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="secondary" dot>Pricing</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="heading-1">Simple, transparent pricing</motion.h1>
          <motion.p variants={fadeUp} className="body-lg">
            Start free. Upgrade when you're ready. No surprise fees.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className={cn(
                'card p-8 space-y-6 relative flex flex-col',
                plan.highlighted ? 'border-primary ring-1 ring-primary shadow-glow' : '',
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" className="shadow-glow-sm">{plan.badge}</Badge>
                </div>
              )}
              <div className="space-y-2">
                <h2 className="font-bold text-xl" style={{ color: 'var(--color-heading)' }}>{plan.name}</h2>
                <p className="text-sm text-muted">{plan.description}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black" style={{ color: 'var(--color-heading)' }}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-sm text-muted mb-1.5">/ {plan.period}</span>}
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                variant={plan.highlighted ? 'primary' : 'outline'}
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted"
        >
          All plans include a 7-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </div>
  )
}
