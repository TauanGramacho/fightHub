-- FightHub - Seguidores reais de lutadores
-- Rode no Supabase SQL Editor.

create table if not exists public.fighter_follows (
  id uuid primary key default gen_random_uuid(),
  follower_auth_id uuid not null references auth.users(id) on delete cascade,
  followed_fighter_id bigint not null references public.fighters(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_auth_id, followed_fighter_id)
);

create index if not exists fighter_follows_followed_idx
  on public.fighter_follows(followed_fighter_id);

create index if not exists fighter_follows_follower_idx
  on public.fighter_follows(follower_auth_id);

alter table public.fighter_follows enable row level security;

drop policy if exists "fighter_follows_select_public" on public.fighter_follows;
create policy "fighter_follows_select_public"
on public.fighter_follows
for select
using (true);

drop policy if exists "fighter_follows_insert_own" on public.fighter_follows;
create policy "fighter_follows_insert_own"
on public.fighter_follows
for insert
with check (auth.uid() = follower_auth_id);

drop policy if exists "fighter_follows_delete_own" on public.fighter_follows;
create policy "fighter_follows_delete_own"
on public.fighter_follows
for delete
using (auth.uid() = follower_auth_id);
