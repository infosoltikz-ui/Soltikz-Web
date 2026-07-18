import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'

import { PublicLayout }    from '@layouts/PublicLayout'
import { AuthLayout }      from '@layouts/AuthLayout'
import { DashboardLayout } from '@layouts/DashboardLayout'
import { PageLoader }      from '@components/ui/States'
import { ProtectedRoute }  from './ProtectedRoute'

// ── Lazy page imports ─────────────────────────────────────────
const HomePage         = lazy(() => import('@features/home/HomePage'))
const AboutPage        = lazy(() => import('@features/home/AboutPage'))
const FeaturesPage     = lazy(() => import('@features/home/FeaturesPage'))
const PricingPage      = lazy(() => import('@features/home/PricingPage'))
const TemplatesPage    = lazy(() => import('@features/home/TemplatesPage'))
const LoginPage        = lazy(() => import('@features/auth/LoginPage'))
const RegisterPage     = lazy(() => import('@features/auth/RegisterPage'))
const DashboardPage    = lazy(() => import('@features/resume/pages/ResumeDashboardPage').then(module => ({ default: module.ResumeDashboardPage })))
const ResumeEditorPage = lazy(() => import('@features/resume/pages/ResumeBuilderPage').then(module => ({ default: module.ResumeBuilderPage })))
const JobAnalyzerPage  = lazy(() => import('@features/resume/pages/JobAnalyzerPage').then(module => ({ default: module.JobAnalyzerPage })))
const NotFoundPage     = lazy(() => import('@features/home/NotFoundPage'))

// ── Suspense wrapper ──────────────────────────────────────────
const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

// ── Router ────────────────────────────────────────────────────
const router = createBrowserRouter([
  /* Public routes */
  {
    element: <PublicLayout />,
    children: [
      { path: '/',           element: <Lazy><HomePage /></Lazy>      },
      { path: '/about',      element: <Lazy><AboutPage /></Lazy>     },
      { path: '/features',   element: <Lazy><FeaturesPage /></Lazy>  },
      { path: '/pricing',    element: <Lazy><PricingPage /></Lazy>   },
      { path: '/templates',  element: <Lazy><TemplatesPage /></Lazy> },
    ],
  },
  /* Auth routes */
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <Lazy><LoginPage /></Lazy>    },
      { path: '/register', element: <Lazy><RegisterPage /></Lazy> },
    ],
  },
  /* Protected dashboard */
  {
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Lazy><DashboardPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId', element: <Lazy><ResumeEditorPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId/job-analyzer', element: <Lazy><JobAnalyzerPage /></Lazy> },
    ],
  },
  /* Fallback */
  { path: '/404', element: <Lazy><NotFoundPage /></Lazy> },
  { path: '*',    element: <Navigate to="/404" replace />  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
