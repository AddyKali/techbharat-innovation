import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useSiteStore from '../../store/siteStore';

// Supabase columns: original_price, is_active (snake_case)
const EMPTY_COURSE = {
  title: '',
  description: '',
  duration: '',
  level: 'Beginner',
  price: '',
  original_price: '',
  image: '',
  badge: '',
  tags: '',           // comma-separated string in form, converted to array on save
  is_active: true,
};

function CourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(
    course
      ? {
          ...course,
          tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
          original_price: course.original_price ?? '',
        }
      : EMPTY_COURSE,
  );

  const handleSave = () => {
    if (!form.title || !form.description) return toast.error('Title and description are required');
    onSave({
      ...form,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
  };

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
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
        className="relative w-full max-w-2xl glass-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold text-white">
            {course ? 'Edit Course' : 'New Course'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Course Title" field="title" placeholder="Full Stack Development" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all resize-none placeholder-white/25"
              placeholder="Course description..."
            />
          </div>

          <Field label="Duration" field="duration" placeholder="6 Months" />
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Level</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all"
            >
              {['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'].map((l) => (
                <option key={l} value={l} className="bg-[#0f0a2e]">{l}</option>
              ))}
            </select>
          </div>

          <Field label="Price (₹)" field="price" type="number" placeholder="29999" />
          {/* original_price — matches Supabase column name */}
          <Field label="Original Price (₹)" field="original_price" type="number" placeholder="49999" />

          <div className="sm:col-span-2">
            <Field label="Image URL" field="image" placeholder="https://images.unsplash.com/..." />
          </div>

          <Field label="Badge Text" field="badge" placeholder="Most Popular" />
          <Field label="Tags (comma-separated)" field="tags" placeholder="React, Node.js, PostgreSQL" />

          {/* is_active — matches Supabase column name */}
          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.is_active ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-white/60">Active (visible on website)</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center">
            <Check className="w-4 h-4" /> Save Course
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCourses() {
  const { courses, fetchCourses, createCourse, updateCourse, deleteCourse } = useSiteStore();
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await updateCourse(editing.id, data);    // .id not ._id
      toast.success('Course updated');
    } else {
      await createCourse(data);
      toast.success('Course created');
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    await deleteCourse(id);
    toast.success('Course deleted');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Courses</h1>
          <p className="text-white/50 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}                          // .id not ._id
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden group"
          >
            <div className="flex gap-4 p-5">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-white text-base truncate">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {course.badge && (
                        <span className="text-xs bg-saffron-500/20 text-saffron-400 border border-saffron-500/20 px-2 py-0.5 rounded-full">
                          {course.badge}
                        </span>
                      )}
                      {/* is_active — Supabase snake_case */}
                      <span className={`w-2 h-2 rounded-full ${course.is_active ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      <span className="text-xs text-white/40">{course.is_active ? 'Active' : 'Hidden'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => { setEditing(course); setShowModal(true); }}
                      className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}   // .id not ._id
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/45 mt-2 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                  <span>{course.duration}</span>
                  <span>·</span>
                  <span>{course.level}</span>
                  <span>·</span>
                  <span className="text-white/70 font-medium">
                    ₹{Number(course.price)?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-2 glass-card p-16 text-center text-white/30">
            No courses yet. Add your first course!
          </div>
        )}
      </div>

      {showModal && (
        <CourseModal
          course={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
