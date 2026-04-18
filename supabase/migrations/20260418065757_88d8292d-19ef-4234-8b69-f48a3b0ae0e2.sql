-- Add length checks to public-write tables to deter abuse
alter table public.contact_queries
  add constraint contact_queries_lengths check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 200
    and (phone is null or char_length(phone) <= 30)
    and (subject is null or char_length(subject) <= 200)
    and char_length(message) between 1 and 4000
  );

alter table public.bookings
  add constraint bookings_lengths check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 200
    and char_length(phone) between 5 and 30
    and char_length(vehicle) between 1 and 100
    and char_length(pickup_location) between 1 and 300
    and char_length(drop_location) between 1 and 300
    and (notes is null or char_length(notes) <= 2000)
  );

-- Replace broad public read policy with one that requires explicit object name (no listing)
drop policy if exists "public read founders bucket" on storage.objects;
create policy "public read founders objects by name"
  on storage.objects for select
  using (
    bucket_id = 'founders'
    and coalesce(current_setting('request.method', true), '') <> 'LIST'
  );