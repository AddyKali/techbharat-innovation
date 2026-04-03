const supabase = require('../config/supabase');

exports.getAllCourses = async (req, res) => {
  try {
    let query = supabase.from('courses').select('*').order('order', { ascending: true });
    if (!req.admin) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
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

exports.deleteCourse = async (req, res) => {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
