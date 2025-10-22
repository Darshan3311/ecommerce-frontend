import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow sending/receiving cookies for cross-site auth when frontend and backend are on different origins
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Auth is handled via HTTP-only cookie set by backend. Do not attach tokens from localStorage.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return full axios response so calling services can access `response.data` or other fields as needed.
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // Allow callers to suppress toasts for expected 404s or optional endpoints
    const suppress = error.config && error.config.suppressToast;
    if (suppress) {
      return Promise.reject(error);
    }

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear stored user and notify the app to navigate to login
      localStorage.removeItem('user');
      // Dispatch a custom event so the React app can navigate using react-router
      // Notify the app to navigate via react-router (avoid full page reload)
      window.dispatchEvent(new CustomEvent('app:unauthorized'));
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
