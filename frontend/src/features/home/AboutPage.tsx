import { motion } from 'framer-motion'
import { Badge }  from '@components/ui/Badge'
import { Users, Target, Award, Lightbulb } from 'lucide-react'
import { stagger, fadeUp, staggerFast } from '@utils/motion'

const TEAM = [
  { name: 'Alex Morgan',   role: 'CEO & Co-Founder',    initials: 'AM' },
  { name: 'Jordan Lee',    role: 'CTO & Co-Founder',    initials: 'JL' },
  { name: 'Sam Rivera',    role: 'Head of Design',      initials: 'SR' },
  { name: 'Taylor Kim',    role: 'Head of AI/ML',       initials: 'TK' },
]

const VALUES = [
  { icon: Users,     title: 'People First',      desc: 'We build tools that genuinely help people advance their careers, not just sell subscriptions.' },
  { icon: Target,    title: 'Accuracy Matters',  desc: 'Every ATS score, every keyword match, every suggestion is grounded in real hiring data.' },
  { icon: Award,     title: 'Quality over Speed', desc: 'We ship fewer features done right, not many features done poorly.' },
  { icon: Lightbulb, title: 'Always Learning',   desc: 'The job market evolves constantly. Our AI does too — updated weekly with fresh signals.' },
]

export default function AboutPage() {
  return (
    <div className="section-y space-y-24">
      <div className="container-app">
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div variants={fadeUp}><Badge variant="primary" dot>Our Story</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="heading-1">
            We're on a mission to democratize career success
          </motion.h1>
          <motion.p variants={fadeUp} className="body-lg">
            ResumeAI was founded in 2023 by a team of engineers and recruiters who were
            frustrated by how opaque the hiring process had become. We built the tool we
            wished existed.
          </motion.p>
        </motion.div>
      </div>

      {/* Values */}
      <div className="container-app">
        <motion.div variants={staggerFast} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary-900/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Team */}
      <div className="container-app space-y-10">
        <div className="text-center">
          <h2 className="heading-2">Meet the team</h2>
        </div>
        <motion.div variants={staggerFast} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <motion.div key={member.name} variants={fadeUp} className="card-hover p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary
                              flex items-center justify-center text-white font-bold text-lg mx-auto">
                {member.initials}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{member.name}</p>
                <p className="text-xs text-muted mt-0.5">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
