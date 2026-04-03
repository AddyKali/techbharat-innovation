import { create } from 'zustand';
import api from '../utils/api';

const useSiteStore = create((set) => ({
  sections: [],
  courses: [],
  testimonials: [],
  stats: [],
  leads: [],
  isLoading: false,

  fetchSections: async () => {
    try {
      const { data } = await api.get('/sections');
      set({ sections: data.data });
    } catch (err) {
      console.error('Failed to fetch sections', err);
    }
  },

  fetchCourses: async () => {
    try {
      const { data } = await api.get('/courses');
      set({ courses: data.data });
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  },

  fetchTestimonials: async () => {
    try {
      const { data } = await api.get('/testimonials');
      set({ testimonials: data.data });
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get('/stats');
      set({ stats: data.data });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  },

  fetchLeads: async () => {
    try {
      const { data } = await api.get('/leads');
      set({ leads: data.data });
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  },

  // ── Section CRUD ──────────────────────────────────────────────
  updateSection: async (id, payload) => {
    const { data } = await api.put(`/sections/${id}`, payload);
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? data.data : s)),
    }));
    return data.data;
  },

  createSection: async (payload) => {
    const { data } = await api.post('/sections', payload);
    set((state) => ({
      sections: [...state.sections, data.data].sort((a, b) => a.order - b.order),
    }));
    return data.data;
  },

  deleteSection: async (id) => {
    await api.delete(`/sections/${id}`);
    set((state) => ({ sections: state.sections.filter((s) => s.id !== id) }));
  },

  // sections arg is already reordered array of full section objects
  reorderSections: async (sections) => {
    set({ sections });
    const payload = sections.map((s, i) => ({ id: s.id, order: i + 1 }));
    await api.put('/sections/reorder', { sections: payload });
  },

  // ── Course CRUD ───────────────────────────────────────────────
  createCourse: async (payload) => {
    const { data } = await api.post('/courses', payload);
    set((state) => ({ courses: [...state.courses, data.data] }));
    return data.data;
  },

  updateCourse: async (id, payload) => {
    const { data } = await api.put(`/courses/${id}`, payload);
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? data.data : c)),
    }));
    return data.data;
  },

  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}`);
    set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
  },

  // ── Testimonial CRUD ──────────────────────────────────────────
  createTestimonial: async (payload) => {
    const { data } = await api.post('/testimonials', payload);
    set((state) => ({ testimonials: [...state.testimonials, data.data] }));
    return data.data;
  },

  updateTestimonial: async (id, payload) => {
    const { data } = await api.put(`/testimonials/${id}`, payload);
    set((state) => ({
      testimonials: state.testimonials.map((t) => (t.id === id ? data.data : t)),
    }));
  },

  deleteTestimonial: async (id) => {
    await api.delete(`/testimonials/${id}`);
    set((state) => ({ testimonials: state.testimonials.filter((t) => t.id !== id) }));
  },

  // ── Stat CRUD ─────────────────────────────────────────────────
  createStat: async (payload) => {
    const { data } = await api.post('/stats', payload);
    set((state) => ({ stats: [...state.stats, data.data] }));
  },

  updateStat: async (id, payload) => {
    const { data } = await api.put(`/stats/${id}`, payload);
    set((state) => ({
      stats: state.stats.map((s) => (s.id === id ? data.data : s)),
    }));
  },

  deleteStat: async (id) => {
    await api.delete(`/stats/${id}`);
    set((state) => ({ stats: state.stats.filter((s) => s.id !== id) }));
  },
}));

export default useSiteStore;
