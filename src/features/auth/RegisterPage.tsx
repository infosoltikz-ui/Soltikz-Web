import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { motion }         from 'framer-motion'
import { useForm }        from 'react-hook-form'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button }         from '@components/ui/Button'
import { Input }          from '@components/ui/Input'
import { Checkbox }       from '@components/ui/Input'
import { ROUTES }         from '@constants'
import { stagger, fadeUp } from '@utils/motion'

interface RegisterFormData {
  name:     string
  email:    string
  password: string
  terms:    boolean
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>()

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(response.data.data);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('Registration failed', error);
      // Ideally show an error toast here
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeUp} className="text-center space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-heading)' }}>
          Create your account
        </h1>
        <p className="text-sm text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="card p-8 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Full name"
            type="text"
            placeholder="Jane Smith"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
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
            placeholder="Create a strong password"
            leftIcon={<Lock className="w-4 h-4" />}
            hint="Minimum 8 characters"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            error={errors.terms?.message}
            {...register('terms', { required: 'You must agree to continue' })}
          />
          <Button type="submit" fullWidth loading={isSubmitting} size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}>
            {isSubmitting ? 'Creating account…' : 'Create free account'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted">
          No credit card required · Cancel anytime
        </p>
      </motion.div>
    </motion.div>
  )
}
