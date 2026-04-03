import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Layers, BookOpen, Star, BarChart2,
  Users, LogOut, Zap, Menu, X, ChevronRight, ExternalLink,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',     end: true  },
  { to: '/admin/sections',     icon: Layers,          label: 'Sections',      end: false },
  { to: '/admin/courses',      icon: BookOpen,        label: 'Courses',       end: false },
  { to: '/admin/testimonials', icon: Star,            label: 'Testimonials',  end: false },
  { to: '/admin/stats',        icon: BarChart2,       label: 'Stats',         end: false },
  { to: '/admin/leads',        icon: Users,           label: 'Leads',         end: false },
];

// Standalone nav item — avoids mixing className render prop with children render prop
function NavItem({ to, icon: Icon, label, end, sidebarOpen }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
          isActive
            ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
            : 'text-white/50 hover:text-white hover:bg-white/8',
        ].join(' ')
      }
    >
      {/* className-only — no render prop for children */}
      <Icon className="w-5 h-5 flex-shrink-0" />
      {sidebarOpen && <span className="truncate flex-1">{label}</span>}

      {/* Tooltip when sidebar is collapsed */}
      {!sidebarOpen && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-[#0f0a2e] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
          {label}
        </div>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const logout    = useAuthStore((s) => s.logout);
  const admin     = useAuthStore((s) => s.admin);
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#080414] overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar flex-shrink-0 transition-all duration-300 flex flex-col border-r border-white/10 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo row */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>

          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-display font-bold text-white text-sm leading-none truncate">TechBharat</div>
              <div className="text-[10px] text-saffron-400 tracking-widest uppercase">Admin Panel</div>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {sidebarOpen
              ? <X    className="w-4 h-4 text-white/60" />
              : <Menu className="w-4 h-4 text-white/60" />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} sidebarOpen={sidebarOpen} />
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>View Website</span>}
          </a>

          {sidebarOpen && admin && (
            <div className="px-3 py-1 text-xs text-white/30 truncate">{admin.email}</div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
