import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/axios';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
