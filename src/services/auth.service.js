import api from '../utils/api';

class AuthService {
  // Register
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  // Login
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    // Backend returns an envelope { status, data: { user, token, refreshToken } }
    const inner = response?.data?.data || {};

    // Persist only the user profile locally (server also sets HTTP-only cookie)
    if (inner.user) {
      localStorage.setItem('user', JSON.stringify(inner.user));
    }

    // Fallback for dev: persist token and set Authorization header
    if (inner.token) {
      try {
        const token = inner.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // ignore storage errors
      }
    }

    // Return the inner payload so callers receive { user, token, refreshToken }
    return inner;
  }

  // Logout
  logout() {
    // Call backend to clear auth cookie and then purge local state
    // Add a debug trace in development so we can see what triggered logout
    try {
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed('[AuthService.logout] logout called');
        console.trace();
        console.groupEnd();
      }
      api.post('/auth/logout');
    } catch (e) {
      // ignore network error; still clear local state
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Remove Authorization header so subsequent requests are unauthenticated
    try {
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('cart');
  }

  // Get current user
  async getCurrentUser() {
    // Avoid sending duplicate /auth/me requests when multiple components mount at once
    if (this._getCurrentUserPromise) {
      return this._getCurrentUserPromise;
    }

    // Ensure Authorization header is set from localStorage token (fallback for dev)
    const token = localStorage.getItem('token');
    if (token && !api.defaults.headers.common['Authorization']) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Use suppressToast so a normal 'not authenticated' response does not show an error toast
    const config = { suppressToast: true };

    this._getCurrentUserPromise = (async () => {
      try {
        const response = await api.get('/auth/me', config);
        // response.data is envelope { status, data: { user } }
        const user = response?.data?.data?.user || null;
        return user;
      } catch (err) {
        // If 401/unauthenticated, return null silently
        if (err.response && err.response.status === 401) {
          return null;
        }
        // For other errors, rethrow so callers can handle network/server issues
        throw err;
      } finally {
        // Clear the in-flight promise so subsequent calls can re-check later
        this._getCurrentUserPromise = null;
      }
    })();

    return this._getCurrentUserPromise;
  }

  // Verify email
  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  // Reset password
  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password?token=${token}`, { password });
    return response.data;
  }

  // Get stored user
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if logged in (based on stored user profile)
  isLoggedIn() {
    return !!this.getStoredUser();
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
