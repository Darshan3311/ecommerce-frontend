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
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
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

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('token');
  }

  // Check if logged in
  isLoggedIn() {
    return !!this.getStoredToken();
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
