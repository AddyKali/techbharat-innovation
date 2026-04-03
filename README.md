# 🇮🇳 TechBharat Innovation — Full Stack EdTech Platform

React + Vite frontend · Node.js + Express backend · **Supabase (PostgreSQL)** · JWT admin auth

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Node.js, Express |
| Database | **Supabase (PostgreSQL)** |
| Auth | JWT (custom admin sessions via bcrypt) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |

---

## 🗄️ Step 1 — Set Up Supabase (5 minutes)

### 1a. Create a project
1. Go to [https://supabase.com](https://supabase.com) → **New Project**
2. Name it `techbharat`, pick a strong DB password
3. Region: `ap-south-1` (Mumbai) for best India latency
4. Wait ~2 min for provisioning

### 1b. Run the schema + seed
1. Dashboard → **SQL Editor** → **New Query**
2. Open `server/config/schema.sql` from this project
3. Paste **entire file** → click **Run**

This creates all 6 tables AND seeds initial content (8 sections, 4 courses, 4 testimonials, 4 stats).

### 1c. Grab your API keys
**Project Settings → API:**
- **Project URL** → `SUPABASE_URL`
- **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` key bypasses Row Level Security — server-side only, never in frontend.

---

## ⚙️ Step 2 — Configure Environment

Edit `server/.env`:

```env
PORT=5000

# ── Supabase ─────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── JWT (your own secret) ─────────────────────────
JWT_SECRET=techbharat_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

# ── Admin seed credentials ────────────────────────
ADMIN_EMAIL=admin@techbharat.in
ADMIN_PASSWORD=TechBharat@2024

CLIENT_URL=http://localhost:5173
```

---

## 🌱 Step 3 — Seed Admin User (run once)

```bash
cd server
npm install
node config/seed-admin.js
# ✅ Admin created: admin@techbharat.in
```

---

## 🚀 Step 4 — Run Dev Servers

```bash
# From project root
npm run install:all   # installs root + client + server deps
npm run dev           # starts both on :5173 and :5000
```

| URL | What |
|-----|------|
| `http://localhost:5173` | Public website |
| `http://localhost:5173/admin/login` | Admin dashboard |
| `http://localhost:5000/api/health` | Backend health check |

**Admin login:** `admin@techbharat.in` / `TechBharat@2024`

---

## 📁 Project Structure

```
techbharat/
├── package.json                        # Root: concurrently runner
├── client/                             # React + Vite
│   ├── vite.config.js                  # Proxy /api → :5000
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                     # Routes + protected admin
│       ├── index.css                   # Tailwind + glassmorphism vars
│       ├── utils/api.js                # Axios + auto JWT header
│       ├── store/
│       │   ├── authStore.js            # Zustand auth
│       │   └── siteStore.js            # Zustand content + CRUD
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx     # Sidebar + outlet
│       │       └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── PublicPage.jsx          # ← Dynamic section renderer
│       │   └── admin/
│       │       ├── AdminLogin.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminSections.jsx   # Drag-and-drop reorder
│       │       ├── AdminCourses.jsx
│       │       ├── AdminTestimonials.jsx
│       │       ├── AdminStats.jsx
│       │       └── AdminLeads.jsx
│       └── sections/                   # All data-driven from API
│           ├── HeroSection.jsx
│           ├── StatsSection.jsx
│           ├── FeaturesSection.jsx
│           ├── CoursesSection.jsx
│           ├── ProcessSection.jsx
│           ├── TestimonialsSection.jsx
│           ├── CTASection.jsx
│           └── ContactSection.jsx
│
└── server/                             # Node.js + Express
    ├── index.js                        # App entry
    ├── .env                            # Supabase + JWT secrets
    ├── config/
    │   ├── supabase.js                 # Supabase client (service role)
    │   ├── schema.sql                  # ← RUN THIS IN SUPABASE SQL EDITOR
    │   └── seed-admin.js               # One-time admin seeder
    ├── middleware/auth.js              # JWT protect
    ├── controllers/                    # Business logic (Supabase queries)
    │   ├── authController.js
    │   ├── sectionsController.js
    │   ├── coursesController.js
    │   ├── testimonialsController.js
    │   ├── statsController.js
    │   └── leadsController.js
    └── routes/                         # Express routers
        ├── auth.js
        ├── sections.js
        ├── courses.js
        ├── testimonials.js
        ├── stats.js
        └── leads.js
```

---

## 🌐 REST API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login → JWT token |
| GET | `/api/auth/me` | ✅ | Current admin |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Sections
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sections` | ❌ | All visible sections (ordered) |
| POST | `/api/sections` | ✅ | Create section |
| PUT | `/api/sections/reorder` | ✅ | Batch reorder `[{id, order}]` |
| PUT | `/api/sections/:id` | ✅ | Update section / config |
| DELETE | `/api/sections/:id` | ✅ | Delete section |

### Courses / Testimonials / Stats
Standard CRUD — `GET` public, `POST/PUT/DELETE` protected.

### Leads
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/leads` | ❌ | Submit contact form |
| GET | `/api/leads` | ✅ | All leads (filterable by status) |
| PUT | `/api/leads/:id/status` | ✅ | Update pipeline status |

---

## 🗃️ Supabase Schema Summary

| Table | Key Columns |
|-------|-------------|
| `admins` | id (UUID), name, email, password (bcrypt), role |
| `sections` | id, type, title, is_visible, order, **config (JSONB)** |
| `courses` | id, title, description, duration, level, price, original_price, image, tags (TEXT[]), badge, order, is_active |
| `testimonials` | id, name, role, company, avatar, content, rating, order, is_active |
| `stats` | id, label, value, icon, order, is_active |
| `leads` | id, name, email, phone, course, message, source, status |

---

## 📦 Sample Responses

### GET /api/sections
```json
{
  "success": true,
  "data": [{
    "id": "a1b2c3d4-e5f6-...",
    "type": "hero",
    "title": "Hero Section",
    "is_visible": true,
    "order": 1,
    "config": {
      "headline": "Build India's Digital Future",
      "subheadline": "World-class tech education...",
      "ctaText": "Start Learning Free",
      "badgeText": "🇮🇳 Made for Bharat"
    }
  }]
}
```

### POST /api/auth/login → 200
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "name": "TechBharat Admin",
    "email": "admin@techbharat.in",
    "role": "admin"
  }
}
```

---

## 🚢 Production Deployment

### Backend → Railway
1. Push project to GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set all `server/.env` vars in Railway environment settings
4. Railway auto-detects Node.js and runs `npm start`

### Frontend → Vercel
1. Import `client/` directory on [vercel.com](https://vercel.com)
2. Add env var: `VITE_API_URL=https://your-api.railway.app/api`
3. Update `client/src/utils/api.js`:
   ```js
   baseURL: import.meta.env.VITE_API_URL || '/api'
   ```

---

## 🔧 Add a New Section Type

1. Create `client/src/sections/MyNewSection.jsx`
2. Register in `SECTION_MAP` in `PublicPage.jsx`
3. Add to `SECTION_TYPES` array in `AdminSections.jsx`
4. Add type to the `CHECK` constraint in `schema.sql` and run migration in Supabase SQL Editor:
   ```sql
   ALTER TABLE sections DROP CONSTRAINT sections_type_check;
   ALTER TABLE sections ADD CONSTRAINT sections_type_check
     CHECK (type IN ('hero','stats','features','courses','process',
                     'testimonials','cta','contact','custom','mynewtype'));
   ```

---

Made with ❤️ for Bharat 🇮🇳
