const supabase = require('../config/supabase');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const { data, error } = await supabase
      .from('leads')
      .insert({ name, email, phone, course, message, source: 'website' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: "We'll reach out to you soon!", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count, pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
