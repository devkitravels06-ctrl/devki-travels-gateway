create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.contact_queries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_queries enable row level security;
create policy "anyone submit query" on public.contact_queries for insert to anon, authenticated with check (true);
create policy "admins read queries" on public.contact_queries for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update queries" on public.contact_queries for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete queries" on public.contact_queries for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  vehicle text not null,
  pickup_location text not null,
  drop_location text not null,
  pickup_date date not null,
  pickup_time text,
  passengers int default 1,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "anyone book" on public.bookings for insert to anon, authenticated with check (true);
create policy "admins read bookings" on public.bookings for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update bookings" on public.bookings for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete bookings" on public.bookings for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create sequence public.bill_number_seq start 72;
create table public.bills (
  id uuid primary key default gen_random_uuid(),
  bill_number int not null default nextval('public.bill_number_seq'),
  bill_date date not null default current_date,
  customer_name text not null,
  customer_address text,
  gstin text default '05AUIPB6150A1ZC',
  particulars jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  less_advance numeric(12,2) default 0,
  cgst_percent numeric(5,2) default 0,
  sgst_percent numeric(5,2) default 0,
  igst_percent numeric(5,2) default 0,
  cgst_amount numeric(12,2) default 0,
  sgst_amount numeric(12,2) default 0,
  igst_amount numeric(12,2) default 0,
  grand_total numeric(12,2) not null default 0,
  amount_in_words text,
  bank_name text,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.bills enable row level security;
create policy "admins all bills" on public.bills for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy "anyone read content" on public.site_content for select to anon, authenticated using (true);
create policy "admins write content" on public.site_content for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.site_content (key, value) values
  ('mission', '{"text":"To provide safe, reliable, and professional travel services across Uttarakhand, with an unwavering commitment to government departments and discerning clients who demand the highest standards of integrity and punctuality."}'::jsonb),
  ('vision', '{"text":"To be Uttarakhand''s most trusted travel partner — recognized for our 8+ years of distinguished service to the Government of Uttarakhand and our role in connecting the state through dependable mobility."}'::jsonb),
  ('about', '{"text":"Devki Travels has proudly served the Government of Uttarakhand for over 8 years, delivering premium fleet services with unmatched reliability. Headquartered in Doiwala, Dehradun, we operate a modern fleet including Innova Crysta, Fortuner, Scorpio, Honda Amaze, Tempo Traveller and more."}'::jsonb);

create table public.founders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.founders enable row level security;
create policy "anyone read founders" on public.founders for select to anon, authenticated using (true);
create policy "admins write founders" on public.founders for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.founders (name, role, bio, display_order) values
  ('Mr. Devki Nandan', 'Founder & CEO', 'Visionary founder with over 8 years of experience serving the Government of Uttarakhand. Built Devki Travels from a single vehicle into Uttarakhand''s most trusted government travel partner.', 1),
  ('Co-Founder', 'Co-Founder & Operations Director', 'Drives day-to-day operations and client relations, ensuring every journey meets the highest standards of safety and professionalism.', 2);

insert into storage.buckets (id, name, public) values ('founders', 'founders', true) on conflict do nothing;
create policy "public read founders bucket" on storage.objects for select using (bucket_id = 'founders');
create policy "admins upload founders" on storage.objects for insert to authenticated with check (bucket_id = 'founders' and public.has_role(auth.uid(),'admin'));
create policy "admins update founders" on storage.objects for update to authenticated using (bucket_id = 'founders' and public.has_role(auth.uid(),'admin'));
create policy "admins delete founders" on storage.objects for delete to authenticated using (bucket_id = 'founders' and public.has_role(auth.uid(),'admin'));