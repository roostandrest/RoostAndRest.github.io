-- ═══════════════════════════════════════════════════════════════════
-- ROOST AND REST — 1-CLICK MASTER DATABASE SCHEMA MIGRATION
-- Project: https://lfxeacasgyofsyxthman.supabase.co
-- Owner / Director: Anwar Ahmad (+91 9807486555 / roostandrestlucknow@gmail.com)
-- Developer: Praveen Singh (praveensinghaws@gmail.com)
-- ═══════════════════════════════════════════════════════════════════
-- Instructions:
-- 1. Open Supabase Dashboard → SQL Editor → New Query
-- 2. Paste this entire file
-- 3. Click "RUN"
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at helper trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────
-- 1. USER PROFILES & ROLES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid(),
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  role TEXT DEFAULT 'staff',
  emp_id TEXT,
  investor_id TEXT,
  is_approved BOOLEAN DEFAULT true,
  auth_provider TEXT DEFAULT 'google',
  avatar_url TEXT,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow auth manage profiles" ON public.profiles;
CREATE POLICY "Allow auth manage profiles" ON public.profiles FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 2. PENDING ACCESS REQUESTS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pending_users (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'Pending',
  auth_provider TEXT DEFAULT 'google',
  requested_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all pending_users" ON public.pending_users;
CREATE POLICY "Allow all pending_users" ON public.pending_users FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 3. ROOMS & PROPERTIES (18 ROOST & REST UNITS)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rooms (
  room_id TEXT PRIMARY KEY,
  unit_no TEXT NOT NULL,
  property_name TEXT NOT NULL,
  nickname TEXT,
  unit_type TEXT DEFAULT 'Flat',
  rent_per_night NUMERIC DEFAULT 3000,
  max_guests INTEGER DEFAULT 4,
  building_name TEXT,
  address TEXT,
  floor TEXT,
  checkin_manager_emp_id TEXT,
  caretaker_emp_id TEXT,
  checkin_manager TEXT,
  caretaker_name TEXT,
  caretaker_phone TEXT,
  map_link TEXT,
  directions TEXT,
  landmarks TEXT,
  floor_info TEXT,
  wifi_ssid TEXT DEFAULT 'RoostAndRest_Guest',
  wifi_password TEXT DEFAULT 'Roost@2026',
  lock_type TEXT DEFAULT 'Smart Lock',
  key_number TEXT,
  mode TEXT DEFAULT 'Active',
  bookable BOOLEAN DEFAULT true,
  notes TEXT,
  cover_image TEXT,
  airbnb_ical_url TEXT,
  whatsapp_group_link TEXT,
  whatsapp_group_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all rooms read" ON public.rooms;
CREATE POLICY "Allow all rooms read" ON public.rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow auth rooms manage" ON public.rooms;
CREATE POLICY "Allow auth rooms manage" ON public.rooms FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 4. FLATS & HOUSEKEEPING STATUS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flats_status (
  room_id TEXT PRIMARY KEY REFERENCES public.rooms(room_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Free',
  cleaning_status TEXT DEFAULT 'Clean',
  assigned_cleaner TEXT,
  cleaner_emp_id TEXT,
  last_cleaned_at TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.flats_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all flats_status" ON public.flats_status;
CREATE POLICY "Allow all flats_status" ON public.flats_status FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 5. GUEST REGISTER (BOOKINGS MASTER TABLE)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.guest_register (
  id SERIAL,
  booking_id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  guest_email TEXT,
  room_id TEXT NOT NULL,
  property_name TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER DEFAULT 2,
  source TEXT DEFAULT 'Direct',
  status TEXT DEFAULT 'confirmed',
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance_amount NUMERIC DEFAULT 0,
  payout_amount NUMERIC DEFAULT 0,
  advance_paid NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'unpaid',
  booked_by TEXT,
  created_by TEXT,
  notes TEXT,
  special_requests TEXT,
  airbnb_reservation_code TEXT,
  is_direct BOOLEAN DEFAULT true,
  show_to_investor BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_reg_room ON public.guest_register(room_id);
CREATE INDEX IF NOT EXISTS idx_guest_reg_dates ON public.guest_register(check_in, check_out);

ALTER TABLE public.guest_register ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all guest_register" ON public.guest_register;
CREATE POLICY "Allow all guest_register" ON public.guest_register FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 6. PAYMENT HISTORY
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_history (
  id SERIAL PRIMARY KEY,
  booking_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_mode TEXT DEFAULT 'UPI',
  payment_type TEXT DEFAULT 'Room Rent',
  reference_no TEXT,
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all payment_history" ON public.payment_history;
CREATE POLICY "Allow all payment_history" ON public.payment_history FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 7. EXPENSES & OUTFLOWS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.expenses (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  room_id TEXT,
  property_name TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  paid_by TEXT,
  payment_mode TEXT DEFAULT 'UPI',
  receipt_url TEXT,
  status TEXT DEFAULT 'approved',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all expenses" ON public.expenses;
CREATE POLICY "Allow all expenses" ON public.expenses FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 8. HRMS EMPLOYEES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employees (
  id SERIAL PRIMARY KEY,
  emp_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'cleaner',
  status TEXT DEFAULT 'Active',
  property_role TEXT,
  monthly_salary NUMERIC DEFAULT 0,
  per_day_wage NUMERIC DEFAULT 0,
  joined_date DATE DEFAULT CURRENT_DATE,
  assigned_properties TEXT,
  emergency_contact TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all employees" ON public.employees;
CREATE POLICY "Allow all employees" ON public.employees FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 9. ATTENDANCE LOG
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendance_log (
  id SERIAL PRIMARY KEY,
  emp_id TEXT NOT NULL,
  name TEXT,
  att_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  in_time TIMESTAMPTZ,
  out_time TIMESTAMPTZ,
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (emp_id, att_date)
);

ALTER TABLE public.attendance_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all attendance_log" ON public.attendance_log;
CREATE POLICY "Allow all attendance_log" ON public.attendance_log FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 10. EMPLOYEE TASKS & HOUSEKEEPING
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employee_tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  room_id TEXT,
  property_name TEXT,
  assigned_to TEXT,
  assigned_to_name TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  due_date DATE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.employee_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all employee_tasks" ON public.employee_tasks;
CREATE POLICY "Allow all employee_tasks" ON public.employee_tasks FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 11. COMPANY ADVANCES & STAFF LEDGER
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_advances (
  id SERIAL PRIMARY KEY,
  emp_id TEXT,
  emp_name TEXT,
  amount NUMERIC NOT NULL,
  type TEXT DEFAULT 'advance',
  date DATE DEFAULT CURRENT_DATE,
  payment_mode TEXT DEFAULT 'UPI',
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.company_advances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all company_advances" ON public.company_advances;
CREATE POLICY "Allow all company_advances" ON public.company_advances FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 12. CENTRAL APP SETTINGS (REAL-TIME SYNC ENGINE)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all app_settings" ON public.app_settings;
CREATE POLICY "Allow all app_settings" ON public.app_settings FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 13. USER ACTIVITY & AUDIT LOGS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  display_name TEXT,
  role TEXT,
  log_date DATE NOT NULL,
  login_count INTEGER DEFAULT 1,
  active_seconds INTEGER DEFAULT 0,
  first_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, log_date)
);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all user_activity_logs" ON public.user_activity_logs;
CREATE POLICY "Allow all user_activity_logs" ON public.user_activity_logs FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 14. MAINTENANCE LOG
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.maintenance_log (
  id SERIAL PRIMARY KEY,
  room_id TEXT,
  property_name TEXT,
  issue TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  cost NUMERIC DEFAULT 0,
  reported_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.maintenance_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all maintenance_log" ON public.maintenance_log;
CREATE POLICY "Allow all maintenance_log" ON public.maintenance_log FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────────
-- 15. LAUNDRY RECORDS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.laundry_records (
  id SERIAL PRIMARY KEY,
  vendor_name TEXT DEFAULT 'Lucknow Premium Laundry',
  sent_date DATE DEFAULT CURRENT_DATE,
  received_date DATE,
  total_items INTEGER DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.laundry_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all laundry_records" ON public.laundry_records;
CREATE POLICY "Allow all laundry_records" ON public.laundry_records FOR ALL USING (true);

-- ═══════════════════════════════════════════════════════════════════
-- 16. SEED ALL 18 ROOST AND REST PROPERTIES
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.rooms (room_id, unit_no, property_name, nickname, unit_type, rent_per_night, max_guests, address, notes, cover_image) VALUES
  ('RST-101', '101', 'Awadh Abode : Modern 2BHK in City Centre', 'Awadh Abode', '2BHK Modern Flat', 3443, 6, 'City Centre, Lucknow, UP', '[AIRBNB_ID: 1513689704038700506]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-102', '102', 'Green leaf Corner: 2Bhk in Lucknow', 'Green Leaf Corner', '2BHK Flat', 3000, 6, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1432351238708631534]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-103', '103', 'Moon Light House: 3Bhk with garden', 'Moon Light House', '3BHK Villa with Garden', 3600, 8, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1403663140808704064]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-104', '104', 'Palladium Loft: Medanta Hospital | LuLu | Ekana', 'Palladium Loft', 'Luxury Loft', 3800, 4, 'Near Medanta & LuLu Mall, Shaheed Path, Lucknow', '[AIRBNB_ID: 1728065461825716832]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-105', '105', 'Peaceful Nest', 'Peaceful Nest', 'Cozy Homestay', 3250, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1472836855538423252]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-106', '106', 'The Awadh Retreat | Amity University', 'The Awadh Retreat', 'Executive Stay', 3600, 4, 'Near Amity University, Gomti Nagar, Lucknow', '[AIRBNB_ID: 1754920271857081441]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-107', '107', 'The Comfort Corner: 2BHK Centrally located', 'The Comfort Corner', '2BHK Central Flat', 2639, 6, 'Centrally Located, Lucknow', '[AIRBNB_ID: 1546149723330595826]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-108', '108', 'The Cozy Corner', 'The Cozy Corner', '1BHK Cozy Flat', 2800, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1765272258371576617]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-109', '109', 'The Eighteenth: Amity Campus', 'The Eighteenth', 'Executive Flat', 3200, 4, 'Amity Campus, Lucknow', '[AIRBNB_ID: 1778104021407872339]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-110', '110', 'The Family Fun Heaven; 1BHK in posh locality', 'Family Fun Heaven', '1BHK Posh Stay', 3000, 4, 'Posh Locality, Lucknow', '[AIRBNB_ID: 1381275814432030373]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-111', '111', 'The Grand Alcove : Krishnam Villa', 'The Grand Alcove', 'Luxury Villa', 6500, 8, 'Krishnam Villa, Lucknow', '[AIRBNB_ID: 1673624571406248647]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-112', '112', 'The Luxe Haven : Gomti Nagar Extension', 'The Luxe Haven', 'Luxury Homestay', 4200, 6, 'Gomti Nagar Extension, Lucknow', '[AIRBNB_ID: 1756974059274081131]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-113', '113', 'The Monarch Suites', 'The Monarch Suites', 'Executive Suite', 3500, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1759943752045444261]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-114', '114', 'The Nestora', 'The Nestora', 'Boutique Homestay', 3200, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1758780588353629399]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-115', '115', 'The Nivora Nest- A cozy retreat for memorable stay', 'The Nivora Nest', 'Cozy Retreat', 3100, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1754941277309610915]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-116', '116', 'The Rustic Anjuman : A day in Gray and white', 'The Rustic Anjuman', 'Thematic Designer Flat', 3300, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1311579015127768002]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-117', '117', 'The Zenvana:A Peaceful Retreat like blissful scape', 'The Zenvana', 'Peaceful Retreat', 3400, 4, 'Lucknow, Uttar Pradesh', '[AIRBNB_ID: 1700681506593234895]', 'https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&width=720&quality=70&auto=webp'),
  ('RST-118', '118', 'Roost Presidential Suite : Luxury Stay', 'Presidential Suite', 'Luxury Penthouse', 4500, 6, 'Gomti Nagar, Lucknow', '[AIRBNB_ID: roost_suite_118]', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (room_id) DO UPDATE SET
  property_name  = EXCLUDED.property_name,
  nickname       = EXCLUDED.nickname,
  rent_per_night = EXCLUDED.rent_per_night,
  unit_type      = EXCLUDED.unit_type,
  cover_image    = EXCLUDED.cover_image;

-- Seed initial flats cleaning status
INSERT INTO public.flats_status (room_id, status, cleaning_status)
SELECT room_id, 'Free', 'Clean' FROM public.rooms
ON CONFLICT (room_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 17. SEED DEFAULT APP SETTINGS
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.app_settings (key, value) VALUES
  ('brand_name', 'ROOST AND REST'),
  ('company_name', 'ROOST AND REST STAYS'),
  ('owner_name', 'Anwar Ahmad'),
  ('owner_phone', '9807486555'),
  ('owner_email', 'roostandrestlucknow@gmail.com'),
  ('checkin_time', '1:00 PM'),
  ('checkout_time', '11:00 AM'),
  ('registered_office_address', 'Lucknow, Uttar Pradesh, India'),
  ('google_review_link', ''),
  ('airbnb_review_link', ''),
  ('dev_login_alerts', '[]'),
  ('user_daily_activity_logs', '{}')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════
-- 18. PRE-APPROVE ANWAR AHMAD (OWNER) & PRAVEEN SINGH (DEVELOPER)
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.profiles (user_id, display_name, role, is_approved)
VALUES
  ('c6343844-a307-4668-9b16-1947a0c0f8fa', 'Praveen Singh', 'developer', true),
  ('roost_owner_anwar', 'Anwar Ahmad', 'owner', true)
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_approved = true;

-- ═══════════════════════════════════════════════════════════════════
-- 19. CREATE DEFAULT ADMIN USER IN AUTH (admin@roostandrest.com / Airbnb.in1)
-- ═══════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID := 'a1111111-2222-3333-4444-555555555555'::UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@roostandrest.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'admin@roostandrest.com',
      crypt('Airbnb.in1', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin","name":"Admin"}',
      NOW(),
      NOW(),
      ''
    );
  ELSE
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@roostandrest.com';
    UPDATE auth.users 
    SET encrypted_password = crypt('Airbnb.in1', gen_salt('bf')),
        email_confirmed_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- Ensure profile exists and is approved as Admin
  INSERT INTO public.profiles (user_id, display_name, role, is_approved)
  VALUES (v_user_id::TEXT, 'Admin', 'admin', true)
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = 'Admin',
    role = 'admin',
    is_approved = true;
END $$;

SELECT '✅ Roost And Rest Schema Created, 18 Properties & Admin User Configured!' AS status;

