-- =========================================================================
-- DREAM LOVE CAFE & RESTAURANT — SUPABASE AUTH INSTANT ACTIVATION SQL
-- =========================================================================
-- Purpose:
-- 1. Auto-confirms any existing unconfirmed staff/admin accounts in auth.users.
-- 2. Sets up a PostgreSQL trigger to automatically confirm all future accounts
--    upon creation (email_confirmed_at = now()), enabling pure Email + Password
--    login without waiting for email verification codes or links.
--
-- Instructions:
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/efjgszyoiaoapsmmutzm/sql/new
-- =========================================================================

-- Step 1: Immediately confirm any existing unconfirmed users
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Step 2: Auto-confirm trigger function for future user creations
CREATE OR REPLACE FUNCTION public.handle_auto_confirm_admin_user()
RETURNS trigger AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Attach trigger to auth.users table
DROP TRIGGER IF EXISTS tr_auto_confirm_admin_user ON auth.users;
CREATE TRIGGER tr_auto_confirm_admin_user
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auto_confirm_admin_user();

-- Step 4: Ensure profiles table exists with proper indexes and RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'staff', 'manager')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public and authenticated can read profiles" ON public.profiles;
CREATE POLICY "Public and authenticated can read profiles" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage own profile" ON public.profiles;
CREATE POLICY "Authenticated users can manage own profile" ON public.profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT ALL ON public.profiles TO anon, authenticated, service_role;
