import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(import.meta.env.MODE === 'production' ? '/api/auth/refresh-token' : 'http://localhost:5000/api/auth/refresh-token', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, usually log out user
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
