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
const MyResumesPage    = lazy(() => import('@features/resume/pages/MyResumesPage').then(module => ({ default: module.MyResumesPage })))
const ResumeEditorPage = lazy(() => import('@features/resume/pages/ResumeBuilderPage').then(module => ({ default: module.ResumeBuilderPage })))
const JobAnalyzerPage  = lazy(() => import('@features/resume/pages/JobAnalyzerPage').then(module => ({ default: module.JobAnalyzerPage })))
const ATSScannerPage   = lazy(() => import('@features/resume/pages/ATSScannerPage').then(module => ({ default: module.ATSScannerPage })))
const ResumeAnalyzerPage = lazy(() => import('@features/resume/pages/ResumeAnalyzerPage').then(module => ({ default: module.ResumeAnalyzerPage })))
const CoverLetterPage  = lazy(() => import('@features/cover-letter/pages/CoverLetterPage').then(module => ({ default: module.CoverLetterPage })))
const ExportPage       = lazy(() => import('@features/export/pages/ExportPage').then(module => ({ default: module.ExportPage })))
const NotFoundPage     = lazy(() => import('@features/home/NotFoundPage'))
const BillingDashboardPage = lazy(() => import('@features/billing/pages/BillingDashboard').then(module => ({ default: module.BillingDashboard })))
const BillingPricingPage   = lazy(() => import('@features/billing/pages/PricingPage').then(module => ({ default: module.PricingPage })))
const AdminLayout          = lazy(() => import('@features/admin/layouts/AdminLayout').then(module => ({ default: module.AdminLayout })))
const AdminDashboardPage   = lazy(() => import('@features/admin/pages/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })))
const UsersPage            = lazy(() => import('@features/admin/pages/UsersPage').then(module => ({ default: module.UsersPage })))
const MasterProfilePage    = lazy(() => import('@features/master-profile/pages/MasterProfilePage').then(module => ({ default: module.MasterProfilePage })))

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
      { path: '/dashboard/master-profile', element: <Lazy><MasterProfilePage /></Lazy> },
      { path: '/dashboard/resumes', element: <Lazy><MyResumesPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId', element: <Lazy><ResumeEditorPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId/job-analyzer', element: <Lazy><JobAnalyzerPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId/ats-scanner', element: <Lazy><ATSScannerPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId/analyzer', element: <Lazy><ResumeAnalyzerPage /></Lazy> },
      { path: '/dashboard/resumes/:resumeId/cover-letter', element: <Lazy><CoverLetterPage /></Lazy> },
      { path: '/dashboard/ats', element: <Lazy><ATSScannerPage /></Lazy> },
      { path: '/dashboard/cover-letters', element: <Lazy><CoverLetterPage /></Lazy> },
      { path: '/dashboard/profile', element: <Lazy><DashboardPage /></Lazy> },
      { path: '/dashboard/settings', element: <Lazy><DashboardPage /></Lazy> },
      { path: '/dashboard/billing', element: <Lazy><BillingDashboardPage /></Lazy> },
      { path: '/dashboard/pricing', element: <Lazy><BillingPricingPage /></Lazy> },
    ],
  },
  /* Admin routes */
  {
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { path: '/admin', element: <Lazy><AdminDashboardPage /></Lazy> },
      { path: '/admin/users', element: <Lazy><UsersPage /></Lazy> },
    ],
  },
  /* Fallback */
  { path: '/404', element: <Lazy><NotFoundPage /></Lazy> },
  { path: '*',    element: <Navigate to="/404" replace />  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
