import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useSiteStore from '../../store/siteStore';

const SECTION_TYPES = ['hero', 'stats', 'features', 'courses', 'process', 'testimonials', 'cta', 'contact'];

function SortableSection({ section, onEdit, onDelete, onToggleVisibility }) {
  // Supabase uses section.id (UUID) not section._id
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card flex items-center gap-4 px-5 py-4 ${
        isDragging ? 'shadow-2xl shadow-saffron-500/20 scale-[1.02]' : ''
      } transition-shadow`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded border border-saffron-500/20">
            {section.type}
          </span>
          {/* is_visible — Supabase snake_case */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${section.is_visible ? 'bg-emerald-400' : 'bg-white/20'}`} />
        </div>
        <div className="font-medium text-white text-sm mt-1 truncate">{section.title}</div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onToggleVisibility(section)}
          title={section.is_visible ? 'Hide section' : 'Show section'}
          className={`p-2 rounded-lg transition-all ${
            section.is_visible ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-white/30 hover:bg-white/10'
          }`}
        >
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onEdit(section)}
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EditModal({ section, onClose, onSave }) {
  const [form, setForm] = useState({
    title: section?.title || '',
    type: section?.type || 'hero',
    is_visible: section?.is_visible ?? true,     // ← snake_case
    config: section?.config ? JSON.stringify(section.config, null, 2) : '{}',
  });
  const [jsonError, setJsonError] = useState('');

  const handleSave = () => {
    try {
      const config = JSON.parse(form.config);
      setJsonError('');
      onSave({ ...form, config });
    } catch {
      setJsonError('Invalid JSON in config field');
    }
  };

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
            {section ? 'Edit Section' : 'Add Section'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-saffron-500/50 transition-all"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0f0a2e]">{t}</option>
              ))}
            </select>
          </div>

          {/* Toggle uses is_visible */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_visible: !form.is_visible })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_visible ? 'bg-saffron-500' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.is_visible ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-white/60">Visible on website</span>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide">Config (JSON)</label>
            <textarea
              value={form.config}
              onChange={(e) => setForm({ ...form, config: e.target.value })}
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-saffron-500/50 transition-all resize-none"
            />
            {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center">
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminSections() {
  const { sections, fetchSections, updateSection, createSection, deleteSection, reorderSections } = useSiteStore();
  const [editingSection, setEditingSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [localSections, setLocalSections] = useState([]);

  useEffect(() => { fetchSections(); }, []);
  useEffect(() => { setLocalSections(sections); }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = localSections.findIndex((s) => s.id === active.id);
    const newIndex = localSections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(localSections, oldIndex, newIndex);
    setLocalSections(reordered);
    await reorderSections(reordered);
    toast.success('Sections reordered');
  };

  const handleToggleVisibility = async (section) => {
    // send is_visible (snake_case) to match Supabase column
    await updateSection(section.id, { is_visible: !section.is_visible });
    toast.success(`Section ${section.is_visible ? 'hidden' : 'shown'}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    await deleteSection(id);
    toast.success('Section deleted');
  };

  const handleSave = async (data) => {
    if (editingSection) {
      await updateSection(editingSection.id, data);
      toast.success('Section updated');
    } else {
      await createSection(data);
      toast.success('Section created');
    }
    setShowModal(false);
    setEditingSection(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Sections</h1>
          <p className="text-white/50 text-sm mt-1">Drag to reorder · Toggle visibility · Edit content</p>
        </div>
        <button onClick={() => { setEditingSection(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* SortableContext needs string/number ids — section.id is UUID string ✓ */}
        <SortableContext items={localSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {localSections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onEdit={(s) => { setEditingSection(s); setShowModal(true); }}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showModal && (
        <EditModal
          section={editingSection}
          onClose={() => { setShowModal(false); setEditingSection(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
