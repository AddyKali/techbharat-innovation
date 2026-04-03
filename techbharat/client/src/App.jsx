import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import PublicPage from './pages/PublicPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSections from './pages/admin/AdminSections';
import AdminCourses from './pages/admin/AdminCourses';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminStats from './pages/admin/AdminStats';
import AdminLeads from './pages/admin/AdminLeads';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import useAuthStore from './store/authStore';

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1050', color: '#e8e4f0', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#ff6f0f', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicPage />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="sections" element={<AdminSections />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
