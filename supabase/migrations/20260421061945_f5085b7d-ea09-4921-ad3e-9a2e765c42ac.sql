CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.service_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  discount_label TEXT,
  price_label TEXT,
  whatsapp_message TEXT NOT NULL DEFAULT 'Hi, I want to Book a CAB',
  whatsapp_number TEXT NOT NULL DEFAULT '917895049876',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.service_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers" ON public.service_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins view all offers" ON public.service_offers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert offers" ON public.service_offers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update offers" ON public.service_offers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete offers" ON public.service_offers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_offers_updated_at
BEFORE UPDATE ON public.service_offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO storage.buckets (id, name, public) VALUES ('service-offers', 'service-offers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read service offer images" ON storage.objects FOR SELECT USING (bucket_id = 'service-offers');
CREATE POLICY "Admins upload service offer images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'service-offers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update service offer images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'service-offers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete service offer images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'service-offers' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.service_offers (title, subtitle, discount_label, price_label, display_order) VALUES
('Delhi To Mussoorie', 'One Way Pick/Drop', '18% OFF', 'From ₹5,299/-', 1),
('Dehradun To Delhi Taxi Service', 'One Way Pick/Drop', '35% OFF', 'From ₹2,998/-', 2),
('Dehradun To Airport', 'One Way Pick/Drop', '25% OFF', 'From ₹899/-', 3);