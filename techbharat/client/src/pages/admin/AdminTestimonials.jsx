import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import useSiteStore from '../../store/siteStore';

function TestimonialModal({ testimonial, onClose, onSave }) {
  const [form, setForm] = useState(
    testimonial || {
      name: '', role: '', company: '', avatar: '',
      content: '', rating: 5, is_active: true,   // is_active snake_case
    },
  );

  const Field = ({ label, field, placeholder = '' }) => (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={form[field] ?? ''}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all placeholder-white/25"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg glass-card p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold text-white">
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" field="name" placeholder="Arjun Sharma" />
            <Field label="Role" field="role" placeholder="Software Engineer" />
            <Field label="Company" field="company" placeholder="Google India" />
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Rating</label>
              <div className="flex gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, rating: r })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-6 h-6 ${r <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Field label="Avatar URL" field="avatar" placeholder="https://api.dicebear.com/..." />

          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all resize-none placeholder-white/25"
              placeholder="What the student said..."
            />
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
            <span className="text-sm text-white/60">Active (shown on website)</span>
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

export default function AdminTestimonials() {
  const { testimonials, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = useSiteStore();
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await updateTestimonial(editing.id, data);   // .id not ._id
      toast.success('Testimonial updated');
    } else {
      await createTestimonial(data);
      toast.success('Testimonial added');
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    toast.success('Testimonial deleted');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Testimonials</h1>
          <p className="text-white/50 text-sm mt-1">
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}                        // .id not ._id
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-white/10"
                />
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/45">{t.role} · {t.company}</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setEditing(t); setShowModal(true); }}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}   // .id not ._id
                  className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm text-white/60 italic mb-3 line-clamp-3">"{t.content}"</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {[...Array(t.rating || 5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {/* is_active snake_case */}
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
                {t.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>
          </motion.div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-2 glass-card p-16 text-center text-white/30">
            No testimonials yet.
          </div>
        )}
      </div>

      {showModal && (
        <TestimonialModal
          testimonial={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
