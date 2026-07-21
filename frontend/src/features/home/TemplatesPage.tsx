import { motion } from 'framer-motion'
import { Badge }  from '@components/ui/Badge'
import { Button } from '@components/ui/Button'
import { Link }   from 'react-router-dom'
import { FileText, ArrowRight } from 'lucide-react'
import { ROUTES } from '@constants'
import { stagger, fadeUp, staggerFast } from '@utils/motion'

const TEMPLATE_CATEGORIES = ['All', 'Modern', 'Classic', 'Creative', 'ATS-Optimized', 'Executive']

const MOCK_TEMPLATES = [
  { id: 1, name: 'Minimal Pro',    category: 'Modern',      popular: true  },
  { id: 2, name: 'Executive Edge', category: 'Executive',   popular: false },
  { id: 3, name: 'Classic Clean',  category: 'Classic',     popular: true  },
  { id: 4, name: 'ATS Shield',     category: 'ATS-Optimized', popular: true },
  { id: 5, name: 'Creative Bold',  category: 'Creative',    popular: false },
  { id: 6, name: 'Corporate Pro',  category: 'Classic',     popular: false },
]

export default function TemplatesPage() {
  return (
    <div className="section-y">
      <div className="container-app space-y-12">
        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="primary" dot>Templates</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="heading-1">
            50+ ATS-ready resume templates
          </motion.h1>
          <motion.p variants={fadeUp} className="body-lg">
            Designed by recruiters, optimized for ATS, and customizable in minutes.
          </motion.p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button key={cat}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                         border-surface-border dark:border-dark-border
                         text-body dark:text-dark-text
                         hover:bg-primary hover:text-white hover:border-primary">
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Template grid */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MOCK_TEMPLATES.map((tpl) => (
            <motion.div key={tpl.id} variants={fadeUp} whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }} className="card overflow-hidden group cursor-pointer">
              {/* Template preview area */}
              <div className="aspect-[3/4] relative overflow-hidden"
                style={{ background: 'var(--color-muted-bg)' }}>
                <div className="absolute inset-4 space-y-3">
                  {/* Resume skeleton preview */}
                  <div className="flex items-start gap-3 pb-3 border-b border-surface-border dark:border-dark-border">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-heading/20 dark:bg-dark-text/20 rounded" />
                      <div className="h-2.5 w-36 bg-muted/30 rounded" />
                    </div>
                  </div>
                  {[90, 80, 100, 75, 85].map((w, i) => (
                    <div key={i} className="h-2 rounded" style={{
                      width: `${w}%`,
                      background: 'rgba(0,0,0,0.08)',
                    }} />
                  ))}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100
                               transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                    Preview
                  </Button>
                  <Button size="sm" as={Link} to={ROUTES.REGISTER}
                    variant="outline" className="border-white text-white hover:bg-white/10">
                    Use This
                  </Button>
                </div>

                {tpl.popular && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{tpl.name}</p>
                  <p className="text-xs text-muted">{tpl.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary
                                       group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center">
          <Button as={Link} to={ROUTES.REGISTER} size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse All 50+ Templates
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
