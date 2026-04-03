import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, BarChart2, Users, Layers, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSiteStore from '../../store/siteStore';
import useAuthStore from '../../store/authStore';

function StatCard({ icon: Icon, label, value, color, to, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        to={to}
        className="glass-card p-6 flex items-center gap-4 hover:border-white/20 transition-all duration-300 group block"
      >
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-display font-bold text-white">{value}</div>
          <div className="text-sm text-white/50">{label}</div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
      </Link>
    </motion.div>
  );
}

const STATUS_COLORS = {
  new: 'bg-emerald-500/20 text-emerald-400',
  contacted: 'bg-blue-500/20 text-blue-400',
  enrolled: 'bg-saffron-500/20 text-saffron-400',
  closed: 'bg-white/10 text-white/40',
};

export default function AdminDashboard() {
  const admin = useAuthStore((s) => s.admin);
  const {
    courses, testimonials, stats, leads, sections,
    fetchCourses, fetchTestimonials, fetchStats, fetchLeads, fetchSections,
  } = useSiteStore();

  useEffect(() => {
    fetchCourses();
    fetchTestimonials();
    fetchStats();
    fetchLeads();
    fetchSections();
  }, []);

  const CARDS = [
    { icon: Layers,     label: 'Sections',     value: sections.length,                              color: 'bg-saffron-500/70', to: '/admin/sections',     delay: 0    },
    { icon: BookOpen,   label: 'Courses',       value: courses.length,                               color: 'bg-violet-500/70',  to: '/admin/courses',      delay: 0.05 },
    { icon: Star,       label: 'Testimonials',  value: testimonials.length,                          color: 'bg-amber-500/70',   to: '/admin/testimonials', delay: 0.1  },
    { icon: BarChart2,  label: 'Stats',         value: stats.length,                                 color: 'bg-emerald-500/70', to: '/admin/stats',        delay: 0.15 },
    { icon: Users,      label: 'Total Leads',   value: leads.length,                                 color: 'bg-pink-500/70',    to: '/admin/leads',        delay: 0.2  },
    { icon: TrendingUp, label: 'New Leads',     value: leads.filter((l) => l.status === 'new').length, color: 'bg-blue-500/70', to: '/admin/leads',        delay: 0.25 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-sm text-white/40 mb-1">Welcome back</p>
        <h1 className="text-3xl font-display font-bold text-white">
          {admin?.name || 'Admin'} 👋
        </h1>
        <p className="text-white/50 mt-1">Here's what's happening with TechBharat today.</p>
      </motion.div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {CARDS.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Recent Leads table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display font-semibold text-white">Recent Leads</h2>
          <Link to="/admin/leads" className="text-xs text-saffron-400 hover:text-saffron-300 transition-colors">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Name', 'Email', 'Course', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.slice(0, 8).map((lead) => (
                <tr key={lead.id} className="hover:bg-white/3 transition-colors">   {/* .id not ._id */}
                  <td className="px-6 py-4 text-sm text-white font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-white/60">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-white/60">{lead.course || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || 'bg-white/10 text-white/40'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">
                    {/* created_at snake_case — Supabase */}
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : '—'}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                    No leads yet. Submit the contact form on the website to see entries here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
