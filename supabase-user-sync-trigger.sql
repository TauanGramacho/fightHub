-- ============================================================
-- FightHub — Trigger para sincronizar auth.users → public.users
-- Execute no Supabase: SQL Editor → New query → Cole e rode.
-- ============================================================

-- 1. Função trigger: ao criar um novo usuário no auth, insere em public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, auth_id, email, role, full_name, phone, avatar_url, created_at)
  values (
    gen_random_uuid(),
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'Fã / Espectador'),
    coalesce(
      concat_ws(' ',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
      ),
      split_part(new.email, '@', 1)
    ),
    new.phone,
    new.raw_user_meta_data ->> 'avatar_url',
    now()
  );
  return new;
end;
$$;

-- 2. Dropar trigger existente (se houver)
drop trigger if exists on_auth_user_created on auth.users;

-- 3. Criar trigger no auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Habilitar RLS na tabela users
alter table public.users enable row level security;

-- 5. Policies para public.users
-- Leitura: qualquer um autenticado pode ler
drop policy if exists "users_select" on public.users;
create policy "users_select" on public.users for select using (true);

-- Atualizar: apenas o próprio usuário
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = auth_id);

-- Inserção: apenas via trigger (service role)
drop policy if exists "users_insert" on public.users;
create policy "users_insert" on public.users
  for insert with check (true);

-- 6. Sincronizar usuários já existentes no auth que não estão em public.users
insert into public.users (id, auth_id, email, role, full_name, created_at)
select
  gen_random_uuid(),
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data ->> 'role', 'Fã / Espectador'),
  coalesce(
    concat_ws(' ',
      au.raw_user_meta_data ->> 'first_name',
      au.raw_user_meta_data ->> 'last_name'
    ),
    split_part(au.email, '@', 1)
  ),
  au.created_at
from auth.users au
where not exists (
  select 1 from public.users pu where pu.auth_id = au.id
);

-- DONE! Trigger criado e usuários sincronizados.
