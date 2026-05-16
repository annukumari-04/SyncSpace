import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request Interceptor: Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Show toast for errors except 401 (handled usually by logging out)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    // Optional: Handle 401 globally to log out user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Or handle via context/router
    }

    return Promise.reject(error);
  }
);

export default api;
