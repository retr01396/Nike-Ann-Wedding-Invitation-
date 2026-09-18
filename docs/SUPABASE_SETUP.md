# Supabase Setup Guide — Nike & Ann Wedding RSVP Platform

This guide documents the complete process for provisioning the Supabase database, applying Row Level Security (RLS) policies, and authorizing administrative users for the Nike & Ann wedding invitation platform.

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create an account.
2. Click **"New Project"**.
3. Set the project name (e.g., `nike-ann-wedding`).
4. Generate or specify a strong database password (keep this secure).
5. Select a region close to your primary audience (e.g., `ap-south-1` Mumbai for India).
6. Click **"Create new project"** and wait for provisioning to complete.

---

## 2. Obtain API Credentials

1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Locate the following values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon / public key** (safe to use in browser)
   - **service_role key** (keep secret; server-side only)

---

## 3. Configure Local Environment Variables

Create a file named `.env.local` in the project root (this file is ignored by `.gitignore`):

```bash
cp .env.example .env.local
```

Populate `.env.local` with your project's credentials:

```env
# Supabase Project Connection (Client & Server)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
```

> [!NOTE]
> **No Privileged Service-Role Key Required**:
> The application uses authenticated user credentials and PostgreSQL Row Level Security (RLS) with explicit `admin_users` authorization for all administrative CRUD operations. Anonymous visitors can only insert RSVPs. Therefore, no privileged service-role key is required or used in your environment.

---

## 4. Run Database Migrations

1. In your Supabase dashboard, navigate to the **SQL Editor** tab.
2. Click **"New query"**.
3. Open the migration file:
   [`supabase/migrations/001_create_rsvps.sql`](../supabase/migrations/001_create_rsvps.sql)
4. Copy the entire contents of `001_create_rsvps.sql` into the SQL editor.
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`).
6. Verify that the following objects were created:
   - Tables: `public.admin_users`, `public.rsvps`
   - Trigger: `set_rsvps_updated_at` on `rsvps`
   - Indexes: `idx_rsvps_attendance`, `idx_rsvps_accommodation`, `idx_rsvps_created_at`, `idx_rsvps_arrival_date`, `idx_rsvps_departure_date`, `idx_rsvps_name`, `idx_admin_users_user_id`
   - Function: `public.is_admin()` (Security Definer)
   - RLS Policies on `rsvps` and `admin_users`
   - Grants: Least-privilege schema and table permissions

---

## 5. Provision the Initial Admin User

Public guest registration is disabled. Administrator accounts must be explicitly provisioned:

### Step 5A: Create User in Supabase Auth
1. In your Supabase dashboard, navigate to **Authentication** → **Users**.
2. Click **"Add User"** → **"Create user"**.
3. Enter the administrator's email and a secure password.
4. Set **"Auto Confirm User"** to `true` (checked), then click **"Create user"**.
5. Copy the newly created user's **User UID** (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 5B: Authorize Admin in `admin_users` Table
1. Return to the **SQL Editor** tab.
2. Execute the following SQL query, replacing `<USER_UID>` with the actual UUID copied from Step 5A:

```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('<USER_UID>', 'admin');
```

3. Confirm the record was inserted:

```sql
SELECT * FROM public.admin_users;
```

---

## 6. Verify Row Level Security (RLS)

You can verify the RLS policies in the SQL Editor:

```sql
-- 1. Test that public (anon) cannot select from rsvps
-- (This should return an empty set or permission error when run as anon)
SET ROLE anon;
SELECT * FROM public.rsvps;
RESET ROLE;

-- 2. Test that public (anon) can insert an RSVP
SET ROLE anon;
INSERT INTO public.rsvps (name, attendance)
VALUES ('RLS Test Guest', 'declined');
RESET ROLE;

-- 3. Verify clean up of test record
DELETE FROM public.rsvps WHERE name = 'RLS Test Guest';
```

---

## 7. Start Next.js & Log In

1. Start the production server or development server:

```bash
# Production server
npm run build
npm run start

# Or development server
npm run dev
```

2. Open `http://localhost:3000/admin/login` in your browser.
3. Sign in with the administrator email and password provisioned in Step 5.
4. You will be redirected to `http://localhost:3000/admin` where you can view live statistics, search guests, apply filters, edit records, delete responses, and export CSVs.
