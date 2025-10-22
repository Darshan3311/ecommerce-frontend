import { create } from 'zustand';
import AuthService from '../services/auth.service';

const useAuthStore = create((set, get) => ({
  // Try to seed from localStorage immediately for fast UI, but we'll
  // reconcile with the server on app init.
  user: AuthService.getStoredUser(),
  token: null,
  isAuthenticated: !!AuthService.getStoredUser(),
  // isLoading is used for mutation operations; isInitializing is true
  // while we call the server to verify the HTTP-only cookie at startup.
  isLoading: false,
  isInitializing: true,
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

  // Initialize session: call backend /auth/me to reconcile cookie-based auth
  // with client state. This is idempotent and safe to call on App mount.
  init: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false, isInitializing: false });
      } else {
        // No user returned - clear any stale local state
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isLoading: false, isInitializing: false });
      }
    } catch (err) {
      // On error (network / 401) clear local state and treat as unauthenticated
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false, isInitializing: false });
    }
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
