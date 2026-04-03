import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set, get) => ({
  admin: null,
  token: localStorage.getItem('tb_admin_token') || null,
  isAuthenticated: !!localStorage.getItem('tb_admin_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('tb_admin_token', data.token);
      set({ admin: data.admin, token: data.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('tb_admin_token');
    set({ admin: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    if (!get().token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ admin: data.admin, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },
}));

export default useAuthStore;
