-- ==============================================================================
-- Migration: 003_cleanup_obsolete_rsvp_columns.sql
-- Description: Safely removes obsolete columns from public.rsvps:
--   1. dietary_preference
--   2. dietary_other
--   3. transportation
--   4. transportation_other
--   5. special_requirements
-- Preserves all core and accommodation fields:
--   id, name, email, attendance, guest_count,
--   accommodation_required, stay_guest_name, phone, people_staying,
--   arrival_date, departure_date, rooms_required,
--   message, status, created_at, updated_at
-- ==============================================================================

ALTER TABLE public.rsvps
  DROP COLUMN IF EXISTS dietary_preference,
  DROP COLUMN IF EXISTS dietary_other,
  DROP COLUMN IF EXISTS transportation,
  DROP COLUMN IF EXISTS transportation_other,
  DROP COLUMN IF EXISTS special_requirements;
