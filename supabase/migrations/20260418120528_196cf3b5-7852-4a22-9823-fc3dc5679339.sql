-- Drivers registration table
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  date_of_birth date,
  address text,
  city text,
  experience_years integer DEFAULT 0,
  vehicle_types text,
  license_number text NOT NULL,
  license_expiry date,
  aadhaar_number text,
  aadhaar_url text,
  license_url text,
  photo_url text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone register driver" ON public.drivers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admins read drivers" ON public.drivers
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins update drivers" ON public.drivers
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete drivers" ON public.drivers
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for driver documents (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('driver-docs', 'driver-docs', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anyone upload driver-docs" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'driver-docs');

CREATE POLICY "admins read driver-docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'driver-docs' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete driver-docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'driver-docs' AND has_role(auth.uid(), 'admin'::app_role));