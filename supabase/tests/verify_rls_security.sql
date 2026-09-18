-- ==============================================================================
-- Supabase RLS Security Verification Test Suite
-- Run this script in the Supabase SQL Editor to test and verify Row-Level Security
-- ==============================================================================

-- ==============================================================================
-- 1. VERIFY FUNCTION CONFIGURATION & SECURITY DEFINER
-- ==============================================================================
SELECT 
  proname, 
  prosecdef AS is_security_definer,
  proconfig AS search_path_config
FROM pg_proc 
WHERE proname = 'is_admin';
-- Expected result: is_security_definer = true, search_path_config = {search_path=""}

-- ==============================================================================
-- 2. VERIFY TABLE PRIVILEGES & LEAST-PRIVILEGE GRANTS
-- ==============================================================================
SELECT 
  grantee, 
  table_name, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('rsvps', 'admin_users')
  AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY table_name, grantee, privilege_type;
-- Expected:
-- anon: ONLY INSERT on rsvps. NO permissions on admin_users.
-- authenticated: SELECT, INSERT, UPDATE, DELETE on rsvps; SELECT on admin_users.

-- ==============================================================================
-- 3. SIMULATE ANONYMOUS ROLE (anon)
-- ==============================================================================
BEGIN;
  -- Switch role to anon (unauthenticated guest)
  SET LOCAL ROLE anon;
  SET LOCAL "request.jwt.claims" = '{"role": "anon"}';

  -- TEST 3A: Anonymous INSERT -> MUST SUCCEED
  INSERT INTO public.rsvps (name, attendance, guest_count)
  VALUES ('Security Test Guest Anon', 'attending', 2);
  -- Expected: 1 row inserted

  -- TEST 3B: Anonymous SELECT -> MUST RETURN 0 ROWS (BLOCKED BY RLS)
  SELECT count(*) AS anon_visible_rsvps FROM public.rsvps;
  -- Expected: 0 rows returned (or count = 0)

  -- TEST 3C: Anonymous UPDATE -> MUST AFFECT 0 ROWS (BLOCKED BY RLS)
  UPDATE public.rsvps SET name = 'Hacked Name' WHERE name = 'Security Test Guest Anon';
  -- Expected: 0 rows affected

  -- TEST 3D: Anonymous DELETE -> MUST AFFECT 0 ROWS (BLOCKED BY RLS)
  DELETE FROM public.rsvps WHERE name = 'Security Test Guest Anon';
  -- Expected: 0 rows affected

  -- TEST 3E: Anonymous SELECT on admin_users -> MUST BE DENIED / 0 ROWS
  -- SELECT * FROM public.admin_users; (Will trigger permission denied error)
ROLLBACK;

-- ==============================================================================
-- 4. SIMULATE AUTHENTICATED NON-ADMIN ROLE
-- ==============================================================================
BEGIN;
  -- Switch role to authenticated user WITHOUT entry in admin_users
  SET LOCAL ROLE authenticated;
  SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

  -- TEST 4A: Authenticated Non-Admin SELECT -> MUST RETURN 0 ROWS (BLOCKED BY RLS)
  SELECT count(*) AS non_admin_visible_rsvps FROM public.rsvps;
  -- Expected: 0

  -- TEST 4B: Authenticated Non-Admin UPDATE -> MUST AFFECT 0 ROWS (BLOCKED BY RLS)
  UPDATE public.rsvps SET name = 'Unauthorized Update';
  -- Expected: 0 rows affected

  -- TEST 4C: Authenticated Non-Admin DELETE -> MUST AFFECT 0 ROWS (BLOCKED BY RLS)
  DELETE FROM public.rsvps;
  -- Expected: 0 rows affected
ROLLBACK;

-- ==============================================================================
-- 5. SIMULATE AUTHENTICATED ADMIN ROLE
-- ==============================================================================
BEGIN;
  -- Create a temporary test admin user in admin_users
  INSERT INTO public.admin_users (id, user_id, role)
  VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'admin')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create a test RSVP record
  INSERT INTO public.rsvps (id, name, attendance, guest_count)
  VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin Test Subject', 'attending', 2);

  -- Switch role to authenticated admin
  SET LOCAL ROLE authenticated;
  SET LOCAL "request.jwt.claims" = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

  -- TEST 5A: Admin SELECT -> MUST RETURN RECORDS
  SELECT count(*) AS admin_visible_rsvps FROM public.rsvps WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  -- Expected: 1

  -- TEST 5B: Admin UPDATE -> MUST SUCCEED
  UPDATE public.rsvps SET guest_count = 3 WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  -- Expected: 1 row affected

  -- TEST 5C: Admin DELETE -> MUST SUCCEED
  DELETE FROM public.rsvps WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  -- Expected: 1 row affected
ROLLBACK;
