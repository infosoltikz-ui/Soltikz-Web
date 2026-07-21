import { Link } from 'react-router-dom'
import {
  Target, Eye, Users, FileText, BarChart2, ShieldCheck,
  Sparkles, Layout, ThumbsUp, Lock, User, Star
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { ROUTES } from '@constants'

// ============================================================
// SECTIONS
// ============================================================

function AboutHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-slate-50">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-green-100/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-8">
            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-green-100/50 px-3 py-1 rounded-full border border-green-200/50">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.2]">
              We're on a Mission to <br />
              Help You <span className="text-primary">Get Hired Faster</span>
            </h1>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed max-w-lg">
              <p>
                <strong>ATS Resume Builder</strong> was created with a simple goal: to help job seekers create resumes that not only look professional but also pass <strong>ATS</strong> systems and get noticed by recruiters.
              </p>
              <p>
                We combine AI technology, career expertise, and user-friendly tools to give you everything you need to stand out in today's competitive job market.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-green-700 text-white font-bold h-12 px-6 rounded-xl">
                Start Building Your Resume &rarr;
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold h-12 px-6 rounded-xl">
                Explore Features
              </Button>
            </div>
          </div>

          {/* Right Laptop Graphic (CSS Illustration) */}
          <div className="relative mx-auto w-full max-w-lg">
            {/* The Laptop */}
            <div className="bg-slate-900 rounded-t-2xl p-3 pb-0 shadow-2xl relative z-10 border-b-[12px] border-slate-700">
              <div className="bg-white rounded-t-xl aspect-[16/10] overflow-hidden relative flex">
                
                {/* Fake App UI */}
                <div className="w-2/3 p-6 space-y-6">
                  {/* Fake User Profile */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sophia" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-32 bg-slate-200 rounded" />
                    </div>
                  </div>
                  {/* Fake Resume Lines */}
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-5/6 bg-slate-100 rounded" />
                    <div className="h-2 w-4/6 bg-slate-100 rounded" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="h-3 w-32 bg-slate-800 rounded mb-4" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                  </div>
                </div>

                {/* Fake ATS Score Panel */}
                <div className="w-1/3 bg-slate-50 border-l border-slate-100 p-4 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                      <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-primary" strokeDasharray="98, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-800 leading-none">98</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">ATS Score</span>
                    </div>
                  </div>
                  
                  {/* Fake Progress Bars */}
                  <div className="w-full space-y-3">
                    {[95, 98, 86, 100].map((val, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[8px] font-bold text-slate-500 mb-1">
                          <span>{['Keyword Match', 'Skills Match', 'Content Quality', 'Format Check'][i]}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            {/* Laptop Base */}
            <div className="w-[110%] h-3 bg-slate-300 rounded-b-xl mx-auto -ml-[5%] relative z-0 shadow-md">
              <div className="w-1/4 h-full bg-slate-400 mx-auto rounded-t-sm" />
            </div>

            {/* Decorative Plant (fake SVG) */}
            <div className="absolute -right-12 bottom-0 w-24 h-32 hidden md:block">
              <div className="absolute bottom-0 w-12 h-14 bg-white rounded-b-xl rounded-t border border-slate-200 mx-auto left-0 right-0 z-20 shadow-sm" />
              <div className="absolute bottom-10 left-6 w-4 h-16 bg-green-700 rounded-full origin-bottom -rotate-12 z-10" />
              <div className="absolute bottom-10 left-12 w-4 h-12 bg-green-600 rounded-full origin-bottom rotate-12 z-10" />
              <div className="absolute bottom-10 left-9 w-4 h-20 bg-green-800 rounded-full origin-bottom z-10" />
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

function MissionVision() {
  return (
    <section className="py-16 bg-white relative z-20 -mt-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
          
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">Our Mission & Vision</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="flex gap-6 items-start pt-6 md:pt-0">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                <Target className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  To empower every job seeker with AI-powered resume tools, smart insights, and professional templates that help them build confidence and land their dream job.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start pt-8 md:pt-0 pl-0 md:pl-12">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                <Eye className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  To become the world's most trusted AI resume platform, transforming how people present their careers and connect with life-changing opportunities.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { icon: Users, val: '50,000+', label: 'Happy Job Seekers', sub: 'Trusted by users worldwide' },
    { icon: FileText, val: '100,000+', label: 'Resumes Created', sub: 'And counting every day', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
    { icon: BarChart2, val: '95%', label: 'ATS Success Rate', sub: 'Higher chance of getting noticed', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: ShieldCheck, val: '4.8/5', label: 'User Rating', sub: 'Based on thousands of reviews', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  ]
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {stats.map((s, i) => (
            <div key={i} className={`flex flex-col items-center text-center ${i === 0 ? '' : 'pl-8'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.bg || 'bg-green-50'} border ${s.border || 'border-green-100'}`}>
                <s.icon className={`w-6 h-6 ${s.color || 'text-primary'}`} />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">{s.val}</div>
              <div className="text-sm font-bold text-slate-800 mb-1">{s.label}</div>
              <div className="text-xs text-slate-400 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesGrid() {
  const features = [
    { icon: ShieldCheck, title: 'ATS-Optimized', desc: 'Our resumes are built to pass ATS systems and reach real human recruiters.' },
    { icon: Sparkles, title: 'AI-Powered Tools', desc: 'Get smart suggestions, content improvements, and real-time scoring.' },
    { icon: Layout, title: 'Professional Templates', desc: 'Choose from 25+ recruiter-approved templates for any industry.' },
    { icon: ThumbsUp, title: 'Easy to Use', desc: 'Simple, intuitive interface that helps you build your resume in minutes.' },
    { icon: Lock, title: 'Secure & Private', desc: 'Your data is 100% secure and never shared with third parties.' },
    { icon: User, title: 'Designed by Experts', desc: 'Built by career experts who understand what recruiters are looking for.' },
  ]
  return (
    <section className="py-24 bg-white border-t border-slate-50">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">Why Choose ATS Resume Builder?</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Smart Technology. Real Results.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-y-12 gap-x-8">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 mt-1">
                <f.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-100/50">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Graphic Placeholder */}
            <div className="bg-slate-50 rounded-2xl aspect-video border border-slate-100 flex items-center justify-center relative overflow-hidden">
              {/* Fake UI representing the team/story illustration */}
              <div className="absolute inset-0 bg-green-50/50" />
              <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col p-4 relative z-10">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-1/3 bg-slate-200 rounded" />
                    <div className="h-2 w-1/4 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-12 h-12 text-slate-300" />
                </div>
              </div>
              {/* Abstract decorative shapes */}
              <div className="absolute bottom-4 left-4 w-12 h-24 bg-green-200 rounded-full opacity-50" />
              <div className="absolute top-8 right-8 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
            </div>

            {/* Right Text */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase">Our Story</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Built for Job Seekers, by Career Experts</h2>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p>
                  We understand the challenges job seekers face because we've been there too. ATS Resume Builder was founded by a team of HR professionals, recruiters, and technologists who wanted to create a tool that makes resume building simple, effective, and accessible for everyone.
                </p>
                <p>
                  Today, we're proud to help thousands of professionals worldwide create resumes that open doors to new opportunities.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const reviews = [
    { text: "This platform helped me create an ATS-friendly resume that got me 3x more interviews. Highly recommended!", name: "James Carter", title: "Software Engineer", img: "1" },
    { text: "The AI suggestions are amazing! My resume went from average to outstanding in just a few minutes.", name: "Emily Johnson", title: "Marketing Manager", img: "2" },
    { text: "Best resume builder I've ever used. The templates are professional and the ATS score feature is a game changer.", name: "Michael Chen", title: "Product Manager", img: "3" },
  ]

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">What Our Users Say</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Loved by Thousands of Job Seekers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex gap-1 mb-6 text-amber-400">
                {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed mb-8 flex-1">
                "{r.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${r.name}`} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{r.name}</h5>
                  <p className="text-xs font-medium text-slate-500">{r.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-white">
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

export default function AboutPage() {
  return (
    <div className="bg-white">
      <AboutHero />
      <MissionVision />
      <StatsBar />
      <FeaturesGrid />
      <OurStory />
      <Testimonials />
      <CTASection />
    </div>
  )
}
