import { Navigate } from 'react-router-dom';
import { ROUTES } from '@constants';
import { useAuthStore } from '../store/useAuthStore';
import { PageLoader } from '../components/ui/States';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
