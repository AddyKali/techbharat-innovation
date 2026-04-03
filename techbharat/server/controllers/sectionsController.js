const supabase = require('../config/supabase');

exports.getAllSections = async (req, res) => {
  try {
    let query = supabase.from('sections').select('*').order('order', { ascending: true });
    // Public: only visible sections; Admin: all
    if (!req.admin) query = query.eq('is_visible', true);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { type, title, is_visible = true, order, config = {} } = req.body;

    // Auto-assign order if not provided
    let newOrder = order;
    if (!newOrder) {
      const { data: last } = await supabase
        .from('sections')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)
        .single();
      newOrder = last ? last.order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('sections')
      .insert({ type, title, is_visible, order: newOrder, config })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sections')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Section not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { error } = await supabase.from('sections').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderSections = async (req, res) => {
  try {
    const { sections } = req.body; // [{ id, order }]
    const updates = sections.map(({ id, order }) =>
      supabase.from('sections').update({ order }).eq('id', id)
    );
    await Promise.all(updates);
    res.json({ success: true, message: 'Sections reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
