import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useSiteStore from '../../store/siteStore';

const ICONS = ['users', 'book-open', 'briefcase', 'trending-up', 'star', 'award', 'globe', 'zap'];

function StatModal({ stat, onClose, onSave }) {
  const [form, setForm] = useState(
    stat || { label: '', value: '', icon: 'trending-up', is_active: true },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm glass-card p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-white">
            {stat ? 'Edit Stat' : 'Add Stat'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Value</label>
            <input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="50,000+"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all placeholder-white/25"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Label</label>
            <input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Students Trained"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all placeholder-white/25"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all"
            >
              {ICONS.map((icon) => (
                <option key={icon} value={icon} className="bg-[#0f0a2e]">{icon}</option>
              ))}
            </select>
          </div>
          {/* is_active snake_case */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.is_active ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-white/60">Active</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={() => onSave(form)} className="btn-primary flex-1 justify-center">
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminStats() {
  const { stats, fetchStats, createStat, updateStat, deleteStat } = useSiteStore();
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await updateStat(editing.id, data);     // .id not ._id
      toast.success('Stat updated');
    } else {
      await createStat(data);
      toast.success('Stat created');
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this stat?')) return;
    await deleteStat(id);
    toast.success('Stat deleted');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Stats</h1>
          <p className="text-white/50 text-sm mt-1">Social proof numbers shown on the website</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Stat
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}                        // .id not ._id
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 text-center group relative"
          >
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditing(stat); setShowModal(true); }}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(stat.id)}   // .id not ._id
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
            <div className="text-xs text-white/25 mt-2 font-mono">{stat.icon}</div>
            {/* is_active snake_case */}
            <div className={`mt-3 inline-flex text-xs px-2 py-0.5 rounded-full ${stat.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
              {stat.is_active ? 'Active' : 'Hidden'}
            </div>
          </motion.div>
        ))}

        {stats.length === 0 && (
          <div className="col-span-4 glass-card p-16 text-center text-white/30">
            No stats yet.
          </div>
        )}
      </div>

      {showModal && (
        <StatModal
          stat={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
