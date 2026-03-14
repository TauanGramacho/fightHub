-- ============================================================
-- FightHub — Correção da Tabela de Usuários e Sincronização
-- Execute no Supabase SQL Editor para corrigir duplicatas e erros.
-- ============================================================

-- 1. Criar a tabela users corretamente se não existir
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

-- 2. Habilitar RLS
alter table public.users enable row level security;

-- 3. Função Trigger Otimizada (Evita duplicatas com ON CONFLICT)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (auth_id, email, full_name, role, avatar_url, created_at)
  values (
    new.id,
    new.email,
    coalesce(
      concat_ws(' ',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
      ),
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'role', 'Fã / Espectador'),
    new.raw_user_meta_data ->> 'avatar_url',
    now()
  )
  on conflict (auth_id) do update
  set 
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
    
  return new;
end;
$$;

-- 4. Recriar o trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Policies
drop policy if exists "Leitura Pública" on public.users;
create policy "Leitura Pública" on public.users for select using (true);

drop policy if exists "Update Próprio" on public.users;
create policy "Update Próprio" on public.users for update using (auth.uid() = auth_id);

-- 6. Limpar duplicatas existentes (Opcional - Use com cuidado)
-- delete from public.users a using public.users b 
-- where a.id < b.id and a.email = b.email;

-- DONE! Rode isso no Supabase para garantir que o Auth funciona 100%.
