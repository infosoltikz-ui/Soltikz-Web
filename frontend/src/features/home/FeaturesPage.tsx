import { Link } from 'react-router-dom'
import {
  FileText, Zap, Layout, Sparkles, BarChart2, Download,
  Target, Clock, Cloud, Shield, Headphones, CheckCircle, User, Rocket, Star, StarHalf
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { ROUTES } from '@constants'

// ============================================================
// SVG ICONS FOR PLATFORMS
// ============================================================

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
)

const TrustpilotLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#00B67A" d="M12 0l3.708 11.413h11.996l-9.704 7.05L21.708 24 12 16.946 2.292 24l3.708-5.537-9.704-7.05h11.996L12 0z"/>
  </svg>
)

// Use standard lucide icons or generic colored svgs for others to save space
const CapterraLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#005B9F" d="M11.66 0C5.22 0 0 5.22 0 11.66s5.22 11.66 11.66 11.66S23.32 18.1 23.32 11.66 18.1 0 11.66 0zm0 18.47a6.81 6.81 0 110-13.62 6.81 6.81 0 010 13.62z"/>
    <path fill="#FF6D00" d="M16.48 11.66a4.82 4.82 0 11-9.64 0 4.82 4.82 0 019.64 0z"/>
  </svg>
)

const G2Logo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF492C" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.632 16.59c-.43.515-1.125.867-2.072 1.055a10.05 10.05 0 01-3.56.024 4.542 4.542 0 01-2.12-.903c-1.35-1.07-1.874-2.822-1.464-4.887.408-2.063 1.705-3.52 3.628-4.08 1.403-.41 2.875-.246 3.992.443.535.33 1.002.824 1.34 1.417.337.592.518 1.25.518 1.932H14.18c0-.62-.22-.962-.486-1.134-.51-.336-1.554-.343-2.316.142-.712.455-1.164 1.418-1.293 2.763-.136 1.423.107 2.458.745 3.037.665.603 1.745.69 2.527.243.342-.196.657-.52.923-.95l3.35 1.898z"/>
  </svg>
)


// ============================================================
// SECTIONS
// ============================================================

function FeaturesHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Dots */}
      <div className="absolute top-20 right-10 grid grid-cols-6 gap-3 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
      </div>
      <div className="absolute bottom-20 left-10 grid grid-cols-6 gap-3 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
      </div>

      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6 relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 mb-8">
          <Link to={ROUTES.HOME} className="hover:text-primary">Home</Link>
          <span>&gt;</span>
          <span className="text-primary">Features</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold shadow-sm border border-green-100">
          <Sparkles className="w-4 h-4 text-primary" />
          ✨ Powerful Features
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.2]">
          Everything You Need to Build <br />
          <span className="text-primary">a Perfect Resume</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Our AI-powered tools and smart features help you create ATS-optimized resumes that get noticed by recruiters and land you more interviews.
        </p>
      </div>
    </section>
  )
}

function DetailedFeaturesGrid() {
  const features = [
    { icon: FileText, title: 'ATS Optimization', desc: 'Built-in ATS checker scans your resume and gives suggestions to improve your score and increase interview chances.' },
    { icon: Zap, title: 'AI-Powered Content', desc: 'Get AI suggestions for skills, bullet points, achievements and keywords that match your target role perfectly.' },
    { icon: Layout, title: 'Professional Templates', desc: 'Choose from 25+ professionally designed, ATS-friendly templates that are recruiter-approved and easy to customize.' },
    { icon: Sparkles, title: 'Smart Suggestions', desc: 'AI analyzes job descriptions and recommends relevant skills and keywords to include in your resume.' },
    { icon: BarChart2, title: 'Real-time ATS Score', desc: 'Get real-time feedback and actionable tips to improve your resume score and overall quality.' },
    { icon: Download, title: 'Multiple Export Options', desc: 'Download your resume in PDF, DOCX or share directly with potential employers with one click.' },
    { icon: FileText, title: 'Cover Letter Builder', desc: 'Create a matching cover letter tailored to the job role with AI assistance in minutes.' },
    { icon: Target, title: 'Job Tracker', desc: 'Track your job applications, interviews, follow-ups and manage your job search efficiently.' },
    { icon: Clock, title: 'Version History', desc: 'Access all your previous versions and track changes to your resume over time.' },
    { icon: Cloud, title: 'Cloud Sync', desc: 'Access your resumes anywhere, anytime with secure cloud synchronization.' },
    { icon: Shield, title: '100% Secure', desc: 'Your data is encrypted and secure. We never share your information with third parties.' },
    { icon: Headphones, title: 'Expert Support', desc: 'Get help when you need it. Our support team is here to help you succeed.' },
  ]

  return (
    <section className="py-12 bg-white relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all bg-white group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
              <div className="pt-2">
                <Link to="#" className="text-sm font-bold text-primary hover:text-green-700 flex items-center gap-1">
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksFeatures() {
  const steps = [
    { icon: User, title: 'Add Your Information', desc: 'Fill in your details or import from LinkedIn to save time.' },
    { icon: Sparkles, title: 'AI Optimizes Your Content', desc: 'Our AI suggests the best content, skills & keywords for your target role.' },
    { icon: Shield, title: 'Check ATS Score', desc: 'Get real-time ATS score and improvement suggestions.' },
    { icon: Download, title: 'Download & Apply', desc: 'Download your ATS-optimized resume and apply with confidence.' },
  ]
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">How It Works</span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Build Your Resume in <span className="text-primary">4 Simple Steps</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8 text-center pt-8">
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-green-200" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-green-100 border-4 border-white flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-sm font-black text-slate-300">0{i+1}</div>
              <h3 className="font-bold text-slate-900 text-lg">{step.title}</h3>
              <p className="text-sm text-slate-500 max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  const reasons = [
    { icon: CheckCircle, title: 'ATS Friendly', desc: 'Designed to pass ATS systems & get you shortlisted.' },
    { icon: User, title: 'Recruiter Approved', desc: 'Templates and content approved by HR professionals.' },
    { icon: Zap, title: 'Save Time', desc: 'Build a professional resume in minutes, not hours.' },
    { icon: Target, title: 'Increase Interviews', desc: 'Our users get 3x more interviews on average.' },
    { icon: Shield, title: 'Privacy Focused', desc: 'Your data is safe with enterprise-grade security.' },
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="text-center">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">Why Choose ATS Resume Builder?</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {reasons.map((r, i) => (
            <div key={i} className="flex flex-col items-center space-y-4">
              <r.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[150px]">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewsSection() {
  const StarRating = ({ val }: { val: string }) => (
    <div className="flex items-center gap-1 text-amber-400">
      <Star className="w-4 h-4 fill-current" />
      <Star className="w-4 h-4 fill-current" />
      <Star className="w-4 h-4 fill-current" />
      <Star className="w-4 h-4 fill-current" />
      {val.includes('.5') || val.includes('.7') || val.includes('.8') ? <StarHalf className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4 fill-current" />}
    </div>
  )

  const reviews = [
    { Logo: GoogleLogo, score: '4.8/5', text: 'Based on 3,200+ reviews' },
    { Logo: TrustpilotLogo, score: '4.7/5', text: 'Based on 2,100+ reviews', bg: 'bg-green-500', isTrustpilot: true },
    { Logo: CapterraLogo, score: '4.8/5', text: 'Based on 1,200+ reviews' },
    { Logo: G2Logo, score: '4.7/5', text: 'Based on 900+ reviews' },
  ]

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Loved by 50,000+ Job Seekers</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                {r.isTrustpilot ? (
                  <div className="w-6 h-6 bg-green-500 flex items-center justify-center rounded-sm">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                ) : (
                  <r.Logo />
                )}
                {r.isTrustpilot && <span className="font-bold text-slate-900 tracking-tight">Trustpilot</span>}
                {i === 2 && <span className="font-bold text-slate-900 tracking-tight">Capterra</span>}
                {i === 3 && <span className="font-bold text-slate-900 tracking-tight">G2</span>}
              </div>
              
              {r.isTrustpilot ? (
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_,j) => <div key={j} className="bg-green-500 p-0.5"><Star className="w-4 h-4 text-white fill-white"/></div>)}
                  <div className="bg-green-500 p-0.5"><StarHalf className="w-4 h-4 text-white fill-white"/></div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <StarRating val={r.score} />
                </div>
              )}
              
              <div className="font-bold text-slate-900">{r.score}</div>
              <div className="text-xs text-slate-400 font-medium">{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
          <div className="shrink-0 flex flex-col items-center gap-3 w-full md:w-auto">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-50 shadow-xl w-full">
              Get Started Free
            </Button>
            <span className="text-xs font-medium text-green-200">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      <FeaturesHero />
      <DetailedFeaturesGrid />
      <HowItWorksFeatures />
      <WhyChooseSection />
      <ReviewsSection />
      <CTASection />
    </div>
  )
}
