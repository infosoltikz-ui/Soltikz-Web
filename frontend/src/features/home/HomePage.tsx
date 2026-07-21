import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Play, Sparkles, Layout, Target, Download,
  BarChart2, Shield, Clock, Cloud, Headphones, FileText,
  User, Check, ChevronDown, Rocket, CheckCircle, Zap
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Badge } from '@components/ui/Badge'
import { Accordion } from '@components/ui/Navigation'
import { ROUTES } from '@constants'

// ============================================================
// SECTION COMPONENTS
// ============================================================

function HeroSection() {
  return (
    <section className="pt-32 pb-20 overflow-hidden bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100/80 text-green-700 text-sm font-semibold">
              <Rocket className="w-4 h-4" />
              <span>AI-Powered • ATS-Optimized • Recruiter Approved</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Build ATS-Optimized Resumes That <span className="text-primary">Get You</span> Hired Faster
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Create professional resumes in minutes with AI-powered content optimization, smart suggestions, and ATS scoring that helps you stand out from the competition.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button as={Link} to={ROUTES.REGISTER} size="lg" className="px-8 shadow-lg shadow-primary/30">
                Create My Resume Free
              </Button>
              <Button variant="outline" size="lg" className="px-8 bg-white" leftIcon={<Play className="w-4 h-4" />}>
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> ATS Optimized</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> AI Powered</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> 100% Secure</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Used by 50,000+</div>
            </div>
          </div>

          {/* Right Content / Mockup */}
          <div className="relative">
            {/* The laptop/browser frame mockup */}
            <div className="relative z-10 w-full aspect-[4/3] bg-slate-900 rounded-2xl shadow-2xl border-8 border-slate-900 overflow-hidden flex flex-col">
              <div className="h-6 bg-slate-800 flex items-center gap-1.5 px-3 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-slate-50 p-4 flex gap-4">
                {/* Sidebar mock */}
                <div className="w-1/4 bg-white rounded-lg border border-slate-100 flex flex-col gap-2 p-2">
                  {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-6 bg-slate-100 rounded"></div>)}
                </div>
                {/* Editor mock */}
                <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                    <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating ATS Score Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-40 flex flex-col items-center gap-2"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-primary" strokeDasharray="98, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800 leading-none">90+</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ATS Score</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Excellent</span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

function TrustedSection() {
  const logos = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Adobe', color: '#FF0000' },
    { name: 'TCS', color: '#000000' },
    { name: 'Infosys', color: '#007CC3' },
    { name: 'Wipro', color: '#000000' },
  ]
  return (
    <section className="py-10 border-b border-slate-100 bg-white">
      <div className="container mx-auto px-4 text-center space-y-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trusted by job seekers and professionals at</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map(logo => (
            <span key={logo.name} className="text-xl font-black text-slate-800">{logo.name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: FileText, title: 'ATS Optimization', desc: 'Built-in ATS checker analyzes your resume and gives suggestions to improve your score.' },
    { icon: Zap, title: 'AI-Powered Content', desc: 'Get AI suggestions for skills, achievements, bullet points & content that match your target role.' },
    { icon: Layout, title: 'Professional Templates', desc: 'Choose from 25+ professionally designed templates that are ATS-friendly and recruiter-approved.' },
    { icon: Sparkles, title: 'Smart Suggestions', desc: 'AI analyzes job descriptions and recommends relevant skills and keywords to include.' },
    { icon: BarChart2, title: 'Real-time ATS Score', desc: 'Get real-time feedback and score while you build your resume with improvement tips.' },
    { icon: Download, title: 'Multiple Export Options', desc: 'Download your resume in PDF, DOCX, or share directly with potential employers.' },
    { icon: FileText, title: 'Cover Letter Builder', desc: 'Create a matching cover letter with AI assistance in minutes.' },
    { icon: Target, title: 'Job Tracker', desc: 'Track your job applications, interviews, follow-ups and manage your job search efficiently.' },
    { icon: Clock, title: 'Version History', desc: 'Access all your previous versions and track changes to your resume over time.' },
    { icon: Cloud, title: 'Cloud Sync', desc: 'Access your resumes anywhere, anytime with secure cloud synchronization.' },
    { icon: Shield, title: '100% Secure', desc: 'Your data is encrypted and secure. We never share your information with third parties.' },
    { icon: Headphones, title: 'Expert Support', desc: 'Get help when you need it. Our support team is here to help you succeed.' },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Everything You Need to Build a <span className="text-primary">Winning Resume</span>
          </h2>
          <p className="text-slate-600">Powerful tools and AI features to help you create a resume that gets noticed by recruiters and ATS systems.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all bg-white group cursor-default space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                <f.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { icon: User, title: 'Add Your Information', desc: 'Fill in your details or import from LinkedIn to save time.' },
    { icon: Sparkles, title: 'AI Optimizes Your Content', desc: 'Our AI suggests the best content, skills & keywords for your target role.' },
    { icon: Shield, title: 'Check ATS Score', desc: 'Get real-time ATS score and improvement suggestions.' },
    { icon: FileText, title: 'Download & Apply', desc: 'Download your ATS-optimized resume and apply with confidence.' },
  ]
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Build Your Resume in <span className="text-primary">4 Simple Steps</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8 text-center pt-8">
          {/* Dashed line connecting steps (hidden on mobile) */}
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-green-200" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-green-100 border-4 border-white flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-sm font-black text-slate-300">0{i+1}</div>
              <h3 className="font-bold text-slate-900 text-lg">{step.title}</h3>
              <p className="text-sm text-slate-500 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TemplatesSection() {
  const templates = ['Modern Professional', 'Classic Clean', 'Executive', 'Creative', 'Minimal', 'Technical']
  
  return (
    <section id="templates" className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Professional Templates</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Choose from Beautiful, ATS-Friendly Templates
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {templates.map(t => (
            <div key={t} className="flex flex-col items-center gap-3">
              <div className="w-[180px] h-[240px] bg-white border border-slate-200 rounded shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col p-2">
                <div className="flex items-start gap-2 border-b border-slate-100 pb-2 mb-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-2 w-3/4 bg-slate-300 rounded"></div>
                    <div className="h-1.5 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                  <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                  <div className="h-1.5 w-5/6 bg-slate-100 rounded"></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700">{t}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-green-50">
            View All Templates &rarr;
          </Button>
        </div>
      </div>
    </section>
  )
}

function SplitSections() {
  return (
    <>
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Why Choose Us */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Why Choose ATS Resume Builder?</span>
                <h2 className="text-4xl font-extrabold text-slate-900">
                  Stand Out. Get Noticed. <br/><span className="text-primary">Get Hired.</span>
                </h2>
              </div>
              
              <ul className="space-y-4">
                {[
                  'Designed by HR experts and recruiters',
                  'ATS-compliant templates and formatting',
                  'AI-powered content optimization',
                  'Increase interview calls by 3x',
                  'Loved by 50,000+ job seekers worldwide'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 font-medium text-slate-700">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonials */}
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 space-y-8">
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Loved by Job Seekers</span>
              <h3 className="text-3xl font-extrabold text-slate-900">What Our Users Say</h3>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 relative">
                <div className="absolute top-4 right-4 text-green-100">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <p className="relative z-10 text-slate-600 font-medium italic">
                  "The ATS score feature really helped me optimize my resume. I started getting more interview calls within a week!"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-900">Sarah Johnson</div>
                    <div className="text-xs text-slate-500">Marketing Manager</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing and FAQ Side by Side */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Pricing */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Simple Pricing</span>
                <h2 className="text-3xl font-extrabold text-slate-900">Choose the Plan That's Right for You</h2>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Free */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                  <div className="font-bold text-slate-900">Free Plan</div>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black text-slate-900">$0</span><span className="text-sm text-slate-500">/forever</span></div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 1 Resume</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Basic Templates</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> ATS Score (Limited)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Download in PDF</li>
                  </ul>
                  <Button variant="outline" className="w-full text-primary border-primary">Get Started Free</Button>
                </div>
                {/* Pro */}
                <div className="bg-white p-6 rounded-2xl border-2 border-primary shadow-xl shadow-primary/10 space-y-6 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                  <div className="font-bold text-slate-900">Pro Plan</div>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black text-slate-900">$9.99</span><span className="text-sm text-slate-500">/month</span></div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Unlimited Resumes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 25+ Premium Templates</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> AI Content Suggestions</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Full ATS Score & Analysis</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Cover Letter Builder</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Priority Support</li>
                  </ul>
                  <Button className="w-full shadow-lg">Start 7-Day Free Trial</Button>
                </div>
                {/* Business */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                  <div className="font-bold text-slate-900">Business Plan</div>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black text-slate-900">$19.99</span><span className="text-sm text-slate-500">/month</span></div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Everything in Pro</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Team Management</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Shared Templates</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Analytics & Reports</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Dedicated Support</li>
                  </ul>
                  <Button variant="outline" className="w-full text-primary border-primary">Start 7-Day Free Trial</Button>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Frequently Asked Questions</span>
                <h2 className="text-3xl font-extrabold text-slate-900">Got Questions? We've Got Answers.</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  'What is ATS and why is it important?',
                  'How does the ATS score work?',
                  'Can I import my existing resume?',
                  'Is my data secure?',
                  'Can I cancel my subscription anytime?'
                ].map(q => (
                  <div key={q} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center font-bold text-slate-700 cursor-pointer hover:border-primary/50 transition-colors">
                    {q}
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-primary rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Ready to Build Your Dream Resume?</h2>
              <p className="text-green-100 font-medium">Join thousands of successful job seekers and land your dream job.</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-50 shadow-xl w-full">
              Create My Resume Free
            </Button>
            <span className="text-xs font-medium text-green-200">No credit card required</span>
          </div>
        </div>
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
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <SplitSections />
      <CTASection />
    </div>
  )
}
