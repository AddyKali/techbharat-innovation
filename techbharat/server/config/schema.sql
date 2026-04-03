-- ============================================================
-- TechBharat Innovation — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run: tables use IF NOT EXISTS, seeds use row-count guards
-- ============================================================

-- ── Admins ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Sections ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT NOT NULL CHECK (type IN ('hero','stats','features','courses','process','testimonials','cta','contact','custom')),
  title      TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  "order"    INT NOT NULL DEFAULT 1,
  config     JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Courses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  duration       TEXT NOT NULL,
  level          TEXT NOT NULL,
  price          NUMERIC NOT NULL,
  original_price NUMERIC,
  image          TEXT,
  tags           TEXT[] DEFAULT '{}',
  badge          TEXT,
  "order"        INT DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Testimonials ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  company    TEXT NOT NULL,
  avatar     TEXT,
  content    TEXT NOT NULL,
  rating     INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  "order"    INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Stats ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  icon       TEXT DEFAULT 'trending-up',
  "order"    INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Leads ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  course     TEXT,
  message    TEXT,
  source     TEXT DEFAULT 'website',
  status     TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── updated_at auto-trigger ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sections_updated_at     ON sections;
DROP TRIGGER IF EXISTS courses_updated_at      ON courses;
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;

CREATE TRIGGER sections_updated_at     BEFORE UPDATE ON sections     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER courses_updated_at      BEFORE UPDATE ON courses      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Disable RLS for service_role access ─────────────────────
ALTER TABLE admins       DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections     DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses      DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE stats        DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads        DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA — guarded by row-count check so re-running is safe
-- ============================================================

-- Stats seed
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM stats) = 0 THEN
    INSERT INTO stats (label, value, icon, "order") VALUES
      ('Students Trained',  '50,000+', 'users',       1),
      ('Courses Available', '120+',    'book-open',    2),
      ('Industry Partners', '80+',     'briefcase',    3),
      ('Placement Rate',    '94%',     'trending-up',  4);
  END IF;
END $$;

-- Courses seed
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM courses) = 0 THEN
    INSERT INTO courses (title, description, duration, level, price, original_price, image, tags, badge, "order") VALUES
      (
        'Full Stack Development',
        'Master React, Node.js, and build production-ready applications from scratch.',
        '6 Months', 'Beginner to Advanced', 29999, 49999,
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        ARRAY['React','Node.js','PostgreSQL','Express'],
        'Most Popular', 1
      ),
      (
        'AI & Machine Learning',
        'Deep dive into Python, TensorFlow, and build real-world AI models.',
        '5 Months', 'Intermediate', 34999, 59999,
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
        ARRAY['Python','TensorFlow','PyTorch','OpenAI'],
        'Trending', 2
      ),
      (
        'DevOps & Cloud Engineering',
        'Learn AWS, Docker, Kubernetes and master the modern DevOps pipeline.',
        '4 Months', 'Intermediate', 27999, 44999,
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
        ARRAY['AWS','Docker','Kubernetes','CI/CD'],
        'High Demand', 3
      ),
      (
        'UI/UX Design Mastery',
        'From wireframes to high-fidelity prototypes. Learn Figma and design thinking.',
        '3 Months', 'Beginner', 19999, 34999,
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
        ARRAY['Figma','Design Systems','Prototyping'],
        'New', 4
      );
  END IF;
END $$;

-- Testimonials seed
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM testimonials) = 0 THEN
    INSERT INTO testimonials (name, role, company, avatar, content, rating, "order") VALUES
      (
        'Arjun Sharma', 'Software Engineer', 'Google India',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
        'TechBharat completely transformed my career. The mentorship and real-world projects gave me confidence to crack interviews at top tech companies.',
        5, 1
      ),
      (
        'Priya Menon', 'AI Engineer', 'Microsoft',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        'The AI/ML program was exceptional. From theory to production deployment, every concept was taught with clarity. Got placed within 2 months of completion.',
        5, 2
      ),
      (
        'Rahul Verma', 'DevOps Lead', 'Flipkart',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
        'Best investment I made in my career. The hands-on labs and live projects prepared me for real industry challenges. Community support is unparalleled.',
        5, 3
      ),
      (
        'Sneha Gupta', 'Full Stack Developer', 'Razorpay',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
        'I went from a complete beginner to a confident developer in 6 months. The curriculum is industry-relevant and the instructors are world-class.',
        5, 4
      );
  END IF;
END $$;

-- Sections seed
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM sections) = 0 THEN
    INSERT INTO sections (type, title, is_visible, "order", config) VALUES
      ('hero', 'Hero Section', true, 1,
        '{"headline":"Build India''s Digital Future","subheadline":"World-class tech education designed for ambitious Indians. Learn from industry veterans, build real projects, and launch your tech career.","ctaText":"Start Learning Free","ctaLink":"#courses","secondaryCtaText":"Watch Demo","badgeText":"🇮🇳 Made for Bharat"}'::jsonb),
      ('stats', 'Stats Section', true, 2, '{}'::jsonb),
      ('features', 'Features Section', true, 3,
        '{"headline":"Why TechBharat?","subheadline":"A learning experience built for results, not just certificates."}'::jsonb),
      ('courses', 'Courses Section', true, 4,
        '{"headline":"Industry-Ready Programs","subheadline":"Hands-on courses built with top companies to match real hiring needs."}'::jsonb),
      ('process', 'Learning Process', true, 5,
        '{"headline":"Your Journey to Tech Mastery","subheadline":"A structured path from beginner to job-ready professional."}'::jsonb),
      ('testimonials', 'Testimonials', true, 6,
        '{"headline":"Success Stories","subheadline":"Hear from graduates now leading at top companies."}'::jsonb),
      ('cta', 'CTA Banner', true, 7,
        '{"headline":"Ready to Start Your Tech Journey?","subheadline":"Join 50,000+ students who transformed their careers with TechBharat.","ctaText":"Enroll Now — Limited Seats"}'::jsonb),
      ('contact', 'Contact Section', true, 8,
        '{"headline":"Get in Touch","subheadline":"Our counsellors are ready to help you choose the right path."}'::jsonb);
  END IF;
END $$;
