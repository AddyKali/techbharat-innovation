import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useSiteStore from '../../store/siteStore';
import api from '../../utils/api';

const STATUS_OPTIONS = ['new', 'contacted', 'enrolled', 'closed'];

const STATUS_COLORS = {
  new:       'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  contacted: 'bg-blue-500/20   text-blue-400   border-blue-500/20',
  enrolled:  'bg-saffron-500/20 text-saffron-400 border-saffron-500/20',
  closed:    'bg-white/10      text-white/40   border-white/10',
};

export default function AdminLeads() {
  const { leads, fetchLeads } = useSiteStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchLeads(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/leads/${id}/status`, { status });
      await fetchLeads();
      toast.success('Lead status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.course?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }),
    {},
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Leads</h1>
        <p className="text-white/50 text-sm mt-1">
          {leads.length} total lead{leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`glass-card p-4 text-center transition-all duration-200 ${
              statusFilter === status
                ? 'border-saffron-500/40 bg-saffron-500/10'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="text-2xl font-display font-bold text-white">{counts[status] || 0}</div>
            <div className="text-xs text-white/50 capitalize mt-1">{status}</div>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all placeholder-white/25"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all"
        >
          <option value="" className="bg-[#0f0a2e]">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-[#0f0a2e] capitalize">{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Name', 'Contact', 'Course', 'Message', 'Status', 'Date'].map((h) => (
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
              {filtered.map((lead, i) => (
                <motion.tr
                  key={lead.id}                    // .id not ._id
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white whitespace-nowrap">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                      <Mail className="w-3 h-3 flex-shrink-0" /> {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Phone className="w-3 h-3 flex-shrink-0" /> {lead.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60 capitalize">
                    {lead.course || '—'}
                  </td>
                  <td className="px-6 py-4 text-xs text-white/45 max-w-[200px]">
                    <span className="line-clamp-2">{lead.message || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}   // .id not ._id
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[lead.status] || STATUS_COLORS.closed}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#0f0a2e] text-white capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/40 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {/* created_at snake_case — Supabase */}
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })
                        : '—'}
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-white/30 text-sm">
                    {search || statusFilter
                      ? 'No leads match your filters.'
                      : 'No leads yet. Submit the contact form on the website to see entries here.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
