-- ══════════════════════════════════════════════════════════════════
-- ROOST AND REST — NOVEMBER 2026 BOOKINGS SEED SCRIPT (From 1 Nov)
-- Populates public.guest_register and public.payment_history
-- ══════════════════════════════════════════════════════════════════

INSERT INTO public.guest_register (
  booking_id, guest_name, guest_phone, guest_email, room_id, property_name, 
  check_in, check_out, num_guests, source, status, total_amount, paid_amount, 
  balance_amount, payout_amount, payment_status, airbnb_reservation_code, is_direct
) VALUES
  -- 1. Green Leaf Corner (Tahshin: 6 Nights, ₹18,314.37)
  ('RR-NOV-01', 'Tahshin', '+91 98765 43210', 'tahshin.guest@airbnb.com', 'RST-102', 
   'Green leaf Corner: 2Bhk in Lucknow', '2026-11-04', '2026-11-10', 4, 'Airbnb', 'confirmed', 
   18314.37, 18314.37, 0, 15500.00, 'paid', 'HM-TAHSHIN-NOV', false),

  -- 2. Moon Light House (Vandana: 2 Nights, ₹2,097.86)
  ('RR-NOV-02', 'Vandana', '+91 97654 32109', 'vandana.guest@airbnb.com', 'RST-103', 
   'Moon Light House: 3Bhk with garden', '2026-11-09', '2026-11-11', 2, 'Airbnb', 'confirmed', 
   4195.72, 4195.72, 0, 3600.00, 'paid', 'HM-VANDANA-NOV', false),

  -- 3. Palladium Loft (Saurabh Shukla: 1-5 Nov, ₹15,200.00)
  ('RR-NOV-03', 'Saurabh Shukla', '+91 96543 21098', 'saurabh@gmail.com', 'RST-104', 
   'Palladium Loft: Medanta Hospital | LuLu | Ekana', '2026-11-01', '2026-11-05', 3, 'Airbnb', 'confirmed', 
   15200.00, 15200.00, 0, 13200.00, 'paid', 'HM-SAURABH-NOV', false),

  -- 4. Peaceful Nest (Mohd Monis: 5-8 Nov, ₹9,750.00)
  ('RR-NOV-04', 'Mohd Monis', '+91 95432 10987', 'monis@gmail.com', 'RST-105', 
   'Peaceful Nest', '2026-11-05', '2026-11-08', 2, 'Airbnb', 'confirmed', 
   9750.00, 9750.00, 0, 8400.00, 'paid', 'HM-MONIS-NOV', false),

  -- 5. The Awadh Retreat (Anjali Chaudhary: 6-10 Nov, ₹14,400.00)
  ('RR-NOV-05', 'Anjali Chaudhary', '+91 94321 09876', 'anjali@gmail.com', 'RST-106', 
   'The Awadh Retreat | Amity University', '2026-11-06', '2026-11-10', 4, 'Airbnb', 'confirmed', 
   14400.00, 14400.00, 0, 12600.00, 'paid', 'HM-ANJALI-NOV', false),

  -- 6. The Comfort Corner (Santosh Yadav: 7-12 Nov, ₹13,195.00)
  ('RR-NOV-06', 'Santosh Yadav', '+91 93210 98765', 'santosh@gmail.com', 'RST-107', 
   'The Comfort Corner: 2BHK Centrally located', '2026-11-07', '2026-11-12', 4, 'Airbnb', 'confirmed', 
   13195.00, 13195.00, 0, 11500.00, 'paid', 'HM-SANTOSH-NOV', false),

  -- 7. The Grand Alcove (Naresh Belani: 1-4 Nov, ₹19,500.00)
  ('RR-NOV-07', 'Naresh Belani', '+91 92109 87654', 'naresh@gmail.com', 'RST-111', 
   'The Grand Alcove : Krishnam Villa', '2026-11-01', '2026-11-04', 6, 'Direct', 'confirmed', 
   19500.00, 19500.00, 0, 19500.00, 'paid', 'DIR-NARESH-NOV', true),

  -- 8. The Luxe Haven (Aakash Kumar: 4-8 Nov, ₹16,800.00)
  ('RR-NOV-08', 'Aakash Kumar', '+91 91098 76543', 'aakash@gmail.com', 'RST-112', 
   'The Luxe Haven : Gomti Nagar Extension', '2026-11-04', '2026-11-08', 4, 'Airbnb', 'confirmed', 
   16800.00, 16800.00, 0, 14800.00, 'paid', 'HM-AAKASH-NOV', false)
ON CONFLICT (booking_id) DO UPDATE SET
  guest_name   = EXCLUDED.guest_name,
  check_in     = EXCLUDED.check_in,
  check_out    = EXCLUDED.check_out,
  total_amount = EXCLUDED.total_amount,
  status       = EXCLUDED.status;

-- Sync initial payments into public.payment_history
INSERT INTO public.payment_history (
  booking_id, amount, payment_date, payment_method, payment_type, notes
)
SELECT 
  booking_id, total_amount, check_in, 'Online / Airbnb Payout', 'full_payment', 'November 2026 seed booking'
FROM public.guest_register
WHERE booking_id LIKE 'RR-NOV%'
ON CONFLICT DO NOTHING;

