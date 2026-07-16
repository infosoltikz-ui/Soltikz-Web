import { motion }  from 'framer-motion'
import { Link }    from 'react-router-dom'
import { Button }  from '@components/ui/Button'
import { ROUTES }  from '@constants'
import { stagger, fadeUp } from '@utils/motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 max-w-lg"
      >
        {/* Big number */}
        <motion.div variants={fadeUp}>
          <span className="text-[10rem] leading-none font-black gradient-text select-none">
            404
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-3">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-heading)' }}>
            Page not found
          </h1>
          <p className="text-muted leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
          <Button as={Link} to={ROUTES.HOME}>
            Go Home
          </Button>
          <Button as={Link} to={ROUTES.DASHBOARD} variant="outline">
            Open Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
