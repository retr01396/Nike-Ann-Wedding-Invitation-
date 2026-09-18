-- ==============================================================================
-- Migration: 002_add_stay_guest_name.sql
-- Description: Adds stay_guest_name and email support to public.rsvps.
-- Nullable for backward compatibility with all existing RSVP records.
-- ==============================================================================

ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS stay_guest_name TEXT;

ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_rsvps_stay_guest_name ON public.rsvps(stay_guest_name);
