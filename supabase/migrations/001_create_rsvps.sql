-- ==============================================================================
-- Migration: 001_create_rsvps.sql
-- Description: Core schema for Nike & Ann wedding RSVP platform.
-- Includes:
--   1. admin_users table (authorization)
--   2. rsvps table (guest submissions mapped from Phase 5 RSVPSubmission)
--   3. Automated updated_at trigger
--   4. Targeted indexes for filtering/reporting
--   5. Row Level Security (RLS) policies & least-privilege grants
-- ==============================================================================

-- 1. ADMIN USERS TABLE
-- Tracks authenticated Supabase users who hold administrative permissions.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PRIMARY RSVPS TABLE
-- Maps directly from frontend Phase 5 RSVPSubmission payload.
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined')),
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1),
  dietary_preference TEXT NOT NULL DEFAULT 'no-preference',
  dietary_other TEXT,
  accommodation_required BOOLEAN NOT NULL DEFAULT false,
  phone TEXT,
  people_staying INTEGER CHECK (people_staying IS NULL OR people_staying >= 1),
  arrival_date DATE,
  departure_date DATE,
  rooms_required INTEGER CHECK (rooms_required IS NULL OR rooms_required >= 1),
  transportation TEXT,
  transportation_other TEXT,
  special_requirements TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'confirmed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint: Arrival must precede or match departure
  CONSTRAINT valid_date_order CHECK (
    arrival_date IS NULL OR departure_date IS NULL OR arrival_date <= departure_date
  ),

  -- Constraint: If accommodation requested, coordinate details must be supplied
  CONSTRAINT valid_accommodation_fields CHECK (
    accommodation_required = false OR (
      phone IS NOT NULL AND
      arrival_date IS NOT NULL AND
      departure_date IS NOT NULL AND
      rooms_required >= 1 AND
      people_staying >= 1
    )
  )
);

-- 3. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER set_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance ON public.rsvps(attendance);
CREATE INDEX IF NOT EXISTS idx_rsvps_accommodation ON public.rsvps(accommodation_required);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_arrival_date ON public.rsvps(arrival_date);
CREATE INDEX IF NOT EXISTS idx_rsvps_departure_date ON public.rsvps(departure_date);
CREATE INDEX IF NOT EXISTS idx_rsvps_name ON public.rsvps(name);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper security-definer function: returns true if current session is an authorized admin.
-- Search path is explicitly set to empty to eliminate search-path injection vulnerabilities.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = (SELECT auth.uid())
  );
END;
$$;

-- Restrict execution on security-definer function
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- RLS Policies on public.rsvps:
-- (A) Anonymous & authenticated guests may submit a new RSVP
DROP POLICY IF EXISTS "Allow public RSVP insert" ON public.rsvps;
CREATE POLICY "Allow public RSVP insert"
ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- (B) ONLY authorized admins can read RSVP records
DROP POLICY IF EXISTS "Allow admins to read RSVPs" ON public.rsvps;
CREATE POLICY "Allow admins to read RSVPs"
ON public.rsvps
FOR SELECT
TO authenticated
USING (public.is_admin());

-- (C) ONLY authorized admins can update RSVP records
DROP POLICY IF EXISTS "Allow admins to update RSVPs" ON public.rsvps;
CREATE POLICY "Allow admins to update RSVPs"
ON public.rsvps
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- (D) ONLY authorized admins can delete RSVP records
DROP POLICY IF EXISTS "Allow admins to delete RSVPs" ON public.rsvps;
CREATE POLICY "Allow admins to delete RSVPs"
ON public.rsvps
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies on public.admin_users:
-- Authenticated users can only read their own admin authorization status
DROP POLICY IF EXISTS "Allow users to read own admin record" ON public.admin_users;
CREATE POLICY "Allow users to read own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- 6. LEAST-PRIVILEGE GRANTS
-- Revoke all default table privileges from PUBLIC
REVOKE ALL ON TABLE public.rsvps FROM PUBLIC;
REVOKE ALL ON TABLE public.admin_users FROM PUBLIC;

-- Explicit schema and table grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Anonymous users: INSERT only on public.rsvps (cannot SELECT, UPDATE, or DELETE)
GRANT INSERT ON public.rsvps TO anon;

-- Authenticated users: Full CRUD on rsvps (guarded by RLS is_admin())
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;

-- Authenticated users: SELECT on admin_users (guarded by RLS user_id = auth.uid())
GRANT SELECT ON public.admin_users TO authenticated;

