require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Verify Supabase connection on boot
const supabase = require('./config/supabase');
supabase.from('sections').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) console.error('❌ Supabase connection error:', error.message);
    else console.log('✅ Supabase connected successfully');
  });

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/sections',     require('./routes/sections'));
app.use('/api/courses',      require('./routes/courses'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/stats',        require('./routes/stats'));
app.use('/api/leads',        require('./routes/leads'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', db: 'Supabase', timestamp: new Date() })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TechBharat Server running on port ${PORT}`);
  console.log(`📡 Supabase URL: ${process.env.SUPABASE_URL}`);
});
