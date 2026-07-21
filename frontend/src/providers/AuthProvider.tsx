import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/axios';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const checked = useRef(false);

  useEffect(() => {
    // Only run once, never re-run to prevent loops
    if (checked.current) return;
    checked.current = true;

    const checkAuth = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data.data);
      } catch {
        // Silently fail — user is simply not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty deps - run ONCE only

  return <>{children}</>;
}
