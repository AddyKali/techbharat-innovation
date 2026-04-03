// Run this once after setting up the schema:
// node server/config/seed-admin.js

require('dotenv').config({ path: __dirname + '/../.env' });
const supabase = require('./supabase');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env');
    process.exit(1);
  }

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('admins')
    .insert({ name: 'TechBharat Admin', email, password: hashedPassword, role: 'admin' })
    .select()
    .single();

  if (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }

  console.log(`✅ Admin created: ${data.email}`);
  process.exit(0);
}

seedAdmin();
