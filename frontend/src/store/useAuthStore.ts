import { create } from 'zustand';
import api from '../utils/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, 
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
      return false;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/google', { credential });
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Google Login failed. Please try again.' 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  checkAuth: async () => {
    // This is optional if your backend has an endpoint like /auth/me
    // For now we just set loading to false if we don't have one
    // A more robust implementation would fetch the user profile here
    set({ isLoading: false });
  }
}));
