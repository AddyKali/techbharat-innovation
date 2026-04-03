const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    let query = supabase.from('testimonials').select('*').order('order', { ascending: true });
    if (!req.admin) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase.from('testimonials').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
