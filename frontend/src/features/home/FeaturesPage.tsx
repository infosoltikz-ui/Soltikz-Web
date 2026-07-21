import { motion }     from 'framer-motion'
import { Badge }      from '@components/ui/Badge'
import { FEATURES_LIST } from '@constants'
import { Sparkles, Target, Layout, Zap, Download, BarChart2 } from 'lucide-react'
import { stagger, fadeUp, staggerFast } from '@utils/motion'
import { cn } from '@utils/cn'

const FeatureIconMap: Record<string, React.ElementType> = {
  Sparkles, Target, Layout, Zap, Download, BarChart2,
}

export default function FeaturesPage() {
  return (
    <div className="section-y mesh-bg">
      <div className="container-app space-y-20">
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="secondary" dot>All Features</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="heading-1">
            Everything you need to get hired
          </motion.h1>
          <motion.p variants={fadeUp} className="body-lg max-w-xl mx-auto">
            A complete AI-powered toolkit built for the modern job seeker.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES_LIST.map((feat) => {
            const Icon = FeatureIconMap[feat.icon] ?? Sparkles
            return (
              <motion.div key={feat.title} variants={fadeUp}
                whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                className="card p-8 space-y-5">
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center',
                  feat.color === 'primary'
                    ? 'bg-primary-light dark:bg-primary-900/30 text-primary'
                    : 'bg-secondary-light dark:bg-secondary-900/30 text-secondary',
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>{feat.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
