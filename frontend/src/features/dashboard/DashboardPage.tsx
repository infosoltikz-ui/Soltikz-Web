import { motion } from 'framer-motion'
import { Plus, FileText, Target, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button }     from '@components/ui/Button'
import { Badge }      from '@components/ui/Badge'
import { Skeleton, CardSkeleton } from '@components/ui/States'
import { ProgressBar }  from '@components/ui/States'
import { stagger, fadeUp, staggerFast } from '@utils/motion'
import { STATS } from '@constants'

const MOCK_RESUMES = [
  { id: '1', name: 'Software Engineer - Google', updated: '2 days ago',  score: 94, status: 'active'  },
  { id: '2', name: 'Full Stack Developer - Meta',  updated: '5 days ago',  score: 87, status: 'draft'  },
  { id: '3', name: 'React Developer - Startup',    updated: '1 week ago', score: 79, status: 'active' },
]

const QUICK_ACTIONS = [
  { icon: Plus,       label: 'New Resume',         href: '/dashboard/resumes/new', color: 'primary'   as const },
  { icon: Target,     label: 'Check ATS Score',    href: '/dashboard/ats',         color: 'secondary' as const },
  { icon: FileText,   label: 'Cover Letter',       href: '/dashboard/cover-letters', color: 'primary' as const },
  { icon: TrendingUp, label: 'View Analytics',     href: '/dashboard',             color: 'secondary' as const },
]

export default function DashboardPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">

      {/* Welcome header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-heading)' }}>
            Good morning, Jane 👋
          </h1>
          <p className="text-sm text-muted mt-1">
            You have 3 active resumes and 2 pending applications.
          </p>
        </div>
        <Button as={Link} to="/dashboard/resumes/new" leftIcon={<Plus className="w-4 h-4" />}>
          New Resume
        </Button>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Resumes',    value: '3',   icon: FileText,   color: 'bg-primary-light dark:bg-primary-900/20 text-primary'   },
          { label: 'Avg ATS Score',    value: '87%', icon: Target,     color: 'bg-secondary-light dark:bg-secondary-900/20 text-secondary' },
          { label: 'Applications',     value: '12',  icon: TrendingUp, color: 'bg-info-light dark:bg-blue-900/20 text-info'             },
          { label: 'Interviews',       value: '4',   icon: Award,      color: 'bg-success-light dark:bg-green-900/20 text-success'      },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} variants={fadeUp} className="card p-5 space-y-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: 'var(--color-heading)' }}>{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Resume list */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base" style={{ color: 'var(--color-heading)' }}>
              My Resumes
            </h2>
            <Link to="/dashboard/resumes" className="text-xs text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_RESUMES.map((resume) => (
              <motion.div
                key={resume.id}
                whileHover={{ y: -2 }}
                className="card p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary-900/20
                                  flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-heading)' }}>
                      {resume.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">Updated {resume.updated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-muted mb-1">ATS Score</p>
                    <ProgressBar
                      value={resume.score}
                      size="sm"
                      color={resume.score >= 90 ? 'success' : resume.score >= 80 ? 'primary' : 'warning'}
                      className="w-24"
                      animated={false}
                    />
                  </div>
                  <Badge variant={resume.status === 'active' ? 'success' : 'neutral'} dot>
                    {resume.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="font-bold text-base" style={{ color: 'var(--color-heading)' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, href, color }) => (
              <Link
                key={label}
                to={href}
                className="card-hover p-4 flex flex-col items-center gap-3 text-center"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  color === 'primary'
                    ? 'bg-primary-light dark:bg-primary-900/20 text-primary'
                    : 'bg-secondary-light dark:bg-secondary-900/20 text-secondary'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-body)' }}>{label}</span>
              </Link>
            ))}
          </div>

          {/* ATS tips card */}
          <div className="card p-5 space-y-3 border-primary/30">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>
                ATS Tip of the Day
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Use standard section headings like "Work Experience" and "Education" — ATS
              systems struggle with creative section names.
            </p>
            <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
              Learn more
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
