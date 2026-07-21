import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry on 429 (rate limit) or if already retried
    if (error.response?.status === 429 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if we're already on the login/register page
      const isAuthPage = window.location.pathname.startsWith('/login') ||
                         window.location.pathname.startsWith('/register') ||
                         window.location.pathname.startsWith('/auth');
      if (isAuthPage) {
        return Promise.reject(error);
      }

      // Prevent multiple simultaneous refresh calls
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = import.meta.env.MODE === 'production'
          ? '/api/auth/refresh-token'
          : 'http://localhost:5000/api/auth/refresh-token';
        await axios.post(refreshUrl, {}, { withCredentials: true });
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
