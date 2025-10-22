import { create } from 'zustand';
import AuthService from '../services/auth.service';

const useAuthStore = create((set, get) => ({
  user: AuthService.getStoredUser(),
  token: AuthService.getStoredToken(),
  isAuthenticated: AuthService.isLoggedIn(),
  isLoading: false,
  error: null,

  // Set user
  setUser: (user) => set({ user, isAuthenticated: true }),

  // Set token
  setToken: (token) => set({ token }),

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthService.login(credentials);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthService.register(userData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    AuthService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  // Update user
  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;
