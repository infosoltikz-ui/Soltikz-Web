import { Outlet, Link } from 'react-router-dom'
import { FileText, CheckCircle, Sparkles, Layout, Download, ShieldCheck, Lock, Cloud } from 'lucide-react'
import { ROUTES } from '@constants'

// ============================================================
// SVG LOGOS
// ============================================================
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="70" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
)

const MicrosoftLogo = () => (
  <svg viewBox="0 0 24 24" width="80" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f35325" d="M1 1h10.5v10.5H1z"/>
    <path fill="#81bc06" d="M12.5 1H23v10.5H12.5z"/>
    <path fill="#05a6f0" d="M1 12.5h10.5V23H1z"/>
    <path fill="#ffba08" d="M12.5 12.5H23V23H12.5z"/>
  </svg>
)

const AmazonLogo = () => (
  <svg viewBox="0 0 100 30" width="80" height="24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="24">amazon</text>
    <path fill="#FF9900" d="M 0 25 Q 25 35 65 25 Q 55 30 40 28 Z"/>
  </svg>
)

export function AuthLayout() {
  const features = [
    { icon: CheckCircle, title: 'ATS Score Checker', desc: 'Get real-time ATS score and improvement tips' },
    { icon: Sparkles, title: 'AI-Powered Suggestions', desc: 'Smart content, skills & keywords recommendations' },
    { icon: Layout, title: 'Professional Templates', desc: '25+ recruiter-approved templates' },
    { icon: Download, title: 'Multiple Export Options', desc: 'Download in PDF, DOCX and more' },
  ]

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      
      {/* ========================================= */}
      {/* LEFT SIDE (Branding & Info)               */}
      {/* ========================================= */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden border-r border-slate-100 pb-10">
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full pointer-events-none -z-10" />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col pt-8 px-12 xl:px-16 relative z-10">
          
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-8 w-fit">
            <div className="bg-primary text-white p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-xl leading-none text-slate-900 tracking-tight">ATS</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resume Builder</div>
            </div>
          </Link>

          {/* Main Copy */}
          <div className="max-w-xl">
            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-slate-900 leading-[1.15] mb-4">
              Build ATS-Optimized <br />
              Resumes That Get You <br />
              <span className="text-primary">Hired Faster</span>
            </h1>
            <p className="text-base xl:text-lg text-slate-600 font-medium mb-8">
              Create professional resumes, get AI-powered suggestions, check ATS score and land your dream job.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{f.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Abstract Mockup Graphic (Absolute positioned on the right) */}
          <div className="absolute right-[-10%] top-[30%] w-[400px] h-[320px] pointer-events-none opacity-20 xl:opacity-100 transition-opacity transform scale-75 xl:scale-100 origin-top-right">
            {/* Fake Dashboard Back */}
            <div className="absolute top-0 right-0 w-[350px] h-[250px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 transform rotate-3">
              <div className="h-6 w-32 bg-slate-100 rounded mb-4" />
              <div className="h-40 w-full bg-green-50 rounded-lg border border-green-100 mb-4" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
            </div>
            {/* Fake Resume Front */}
            <div className="absolute top-10 left-0 w-[300px] h-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 transform -rotate-2 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-16 bg-slate-300 rounded" />
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded mb-2" />
              <div className="h-2 w-5/6 bg-slate-100 rounded mb-6" />
              <div className="h-3 w-20 bg-slate-800 rounded mb-4" />
              <div className="h-2 w-full bg-slate-100 rounded mb-2" />
              <div className="h-2 w-full bg-slate-100 rounded mb-2" />
              <div className="h-2 w-3/4 bg-slate-100 rounded mb-6" />
              {/* Fake Score Badge */}
              <div className="absolute bottom-10 right-[-20px] w-24 h-24 bg-white rounded-full shadow-xl border-4 border-primary flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 leading-none">90+</span>
                <span className="text-[8px] font-bold text-primary uppercase">ATS Score</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust Section */}
        <div className="px-12 xl:px-16 mt-auto">
          <div className="border-t border-slate-100 pt-6 pb-4">
            <p className="text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
              Trusted by 50,000+ job seekers worldwide
            </p>
            <div className="flex items-center justify-between opacity-60 grayscale hover:grayscale-0 transition-all duration-300 gap-4 flex-wrap">
              <GoogleLogo />
              <MicrosoftLogo />
              <AmazonLogo />
              <div className="font-black text-xl text-red-600 flex items-center gap-1">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 9h-4v2h4v2h-4v2h4v2H9v-8h6v-2z"/></svg>
                Adobe
              </div>
              <div className="font-black text-xl text-blue-800 tracking-tighter">tcs</div>
              <div className="font-black text-xl text-blue-600">Infosys</div>
            </div>
          </div>
          
          {/* Bottom Security Indicators */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-4">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary"/> 100% Secure</div>
            <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary"/> Your data is protected</div>
            <div className="flex items-center gap-1.5"><Cloud className="w-4 h-4 text-primary"/> GDPR Compliant</div>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE (Form Content)                 */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col bg-slate-50 relative overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 lg:p-8">
          <Outlet />
        </div>
      </div>

    </div>
  )
}
