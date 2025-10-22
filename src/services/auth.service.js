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
    // Server sets HTTP-only auth cookie. Persist only the user profile locally.
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  // Logout
  logout() {
    // Call backend to clear auth cookie and then purge local state
    try {
      api.post('/auth/logout');
    } catch (e) {
      // ignore network error; still clear local state
    }
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
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
