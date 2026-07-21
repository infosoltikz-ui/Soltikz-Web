import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@constants'
import { useAuthStore } from '@store/useAuthStore'
import { useGoogleLogin } from '@react-oauth/google'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { register, googleLogin, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!name || !email || !password) return

    const success = await register({ name, email, password })
    if (success) {
      // Registration successful (Wait for email verification in real app, but we can redirect to login or dashboard)
      navigate(ROUTES.LOGIN)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      clearError()
      const success = await googleLogin(tokenResponse.access_token)
      if (success) navigate(ROUTES.DASHBOARD || '/dashboard')
    },
    onError: () => {
      console.log('Google Login popup closed or failed')
    },
  });


  return (
    <div className="w-full max-w-[440px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col">
      
      {/* Back to Home */}
      <div className="mb-4">
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account 🚀</h2>
        <p className="text-sm text-slate-500 font-medium">Join thousands of job seekers and build your perfect resume today.</p>
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b border-slate-200 mb-6 relative">
        <Link to={ROUTES.LOGIN} className="flex-1 pb-3 text-center font-bold text-slate-400 hover:text-slate-600 transition-colors" onClick={() => clearError()}>
          Login
        </Link>
        <div className="flex-1 pb-3 text-center font-bold text-primary cursor-default relative">
          Create Account
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
        
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-900 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-900 block">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-900 block">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary" required />
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            By creating an account, you agree to our <Link to="#" className="text-primary hover:underline font-bold">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline font-bold">Privacy Policy</Link>.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-primary hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <User className="w-5 h-5" />
          )}
          {isLoading ? 'Creating...' : 'Create Your Account'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Login - ONLY GOOGLE */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={isLoading}
          className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"/>
          </svg>
          <span className="font-bold text-slate-700 text-sm">Google</span>
        </button>

      </form>

      {/* Footer Badge */}
      <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-3 flex gap-4 items-start">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Secure Registration</h4>
          <p className="text-xs text-slate-500 font-medium">We use industry-standard encryption to keep your data safe and secure.</p>
        </div>
      </div>

    </div>
  )
}
