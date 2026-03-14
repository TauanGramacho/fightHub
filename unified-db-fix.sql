-- ============================================================
-- FightHub — Unified Database Fix
-- This script creates the missing 'users' and 'championships' tables.
-- Execute in Supabase: SQL Editor → New query → Run.
-- ============================================================

-- 1. Table: users (Sync with Auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique not null,
  email text unique not null,
  full_name text,
  role text default 'Fã / Espectador',
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. Table: championships (As requested)
create table if not exists public.championships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  modality text, -- You can link this to a modalities table later
  created_at timestamptz default now()
);

-- 3. Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.championships enable row level security;

-- 4. RLS Policies
create policy "users_select_public" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = auth_id);

create policy "championships_select_public" on public.championships for select using (true);
create policy "championships_all_admin" on public.championships for all using (true); -- Public for now

-- 5. Trigger to Sync Auth Users to public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (auth_id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'Fã / Espectador')
  )
  on conflict (auth_id) do update
  set 
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Sample Data (Optional)
insert into public.championships (name, modality) values 
('Campeonato Brasileiro 2025', 'Kickboxing K1'),
('Copa do Mundo de Artes Marciais', 'Full Contact')
on conflict do nothing;

-- 7. Grant access for some systems that might need it
-- Ensure regular tables are there too (from previous migrations)
-- teams, fighters, events, fights, rankings should be created by supabase-full-migration.sql
