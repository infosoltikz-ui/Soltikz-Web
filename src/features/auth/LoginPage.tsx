import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { motion }        from 'framer-motion'
import { useForm }       from 'react-hook-form'
import { Mail, Lock, ArrowRight, FileText } from 'lucide-react'
import { Button }        from '@components/ui/Button'
import { Input }         from '@components/ui/Input'
import { ROUTES }        from '@constants'
import { stagger, fadeUp } from '@utils/motion'
import { GoogleLoginButton } from './components/GoogleLoginButton'

interface LoginFormData {
  email:    string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>()

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      setUser(response.data.data);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('Login failed', error);
      // Ideally show an error toast here
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-heading)' }}>
          Welcome back
        </h1>
        <p className="text-sm text-muted">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </motion.div>

      {/* Card */}
      <motion.div variants={fadeUp} className="card p-8 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('remember')}
                className="h-4 w-4 rounded border-surface-border text-primary focus:ring-primary/30" />
              <span className="text-sm text-muted">Remember me</span>
            </label>
            <Link to="#" className="text-sm text-primary hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={isSubmitting} size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
          <span className="text-xs text-muted">or continue with</span>
          <div className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <GoogleLoginButton actionText="signin_with" />
        </div>
      </motion.div>
    </motion.div>
  )
}
