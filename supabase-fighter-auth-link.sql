-- FightHub - Vinculo formal entre lutador e usuario autenticado
-- Rode no Supabase SQL Editor para formalizar ownership do perfil.

alter table if exists public.fighters
  add column if not exists auth_id uuid;

create index if not exists fighters_auth_id_idx on public.fighters(auth_id);
create unique index if not exists fighters_auth_id_unique_idx
  on public.fighters(auth_id)
  where auth_id is not null;

do $$
begin
  alter table public.fighters
    add constraint fighters_auth_id_fkey
    foreign key (auth_id)
    references auth.users(id)
    on delete set null;
exception
  when duplicate_object then null;
end $$;

-- Backfill simples por nome exato entre public.users.full_name e public.fighters.name.
update public.fighters f
set auth_id = u.auth_id
from public.users u
where f.auth_id is null
  and upper(trim(f.name)) = upper(trim(u.full_name));
