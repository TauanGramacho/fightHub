-- FightHub - Vitrine premium para atletas
-- Campos de solicitacao, aprovacao e publicacao da Vitrine.

alter table if exists public.fighters
  add column if not exists showcase_enabled boolean not null default false;

alter table if exists public.fighters
  add column if not exists showcase_status text not null default 'hidden';

alter table if exists public.fighters
  add column if not exists showcase_plan text not null default 'free';

alter table if exists public.fighters
  add column if not exists showcase_requested_at timestamptz;

alter table if exists public.fighters
  add column if not exists showcase_approved_at timestamptz;

alter table if exists public.fighters
  add column if not exists showcase_expires_at timestamptz;

alter table if exists public.fighters
  add column if not exists showcase_priority integer not null default 0;

do $$
begin
  alter table public.fighters
    add constraint fighters_showcase_status_check
    check (showcase_status in ('hidden', 'pending', 'approved', 'rejected'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.fighters
    add constraint fighters_showcase_plan_check
    check (showcase_plan in ('free', 'premium'));
exception
  when duplicate_object then null;
end $$;

create index if not exists fighters_showcase_status_idx
  on public.fighters(showcase_status, showcase_enabled, showcase_priority desc);

with ranked as (
  select
    id,
    row_number() over (
      order by wins desc, losses asc, draws desc, coalesce(rank, 999999) asc, id asc
    ) as showcase_pos
  from public.fighters
  where coalesce(wins, 0) + coalesce(losses, 0) + coalesce(draws, 0) > 0
)
update public.fighters f
set
  showcase_enabled = true,
  showcase_status = 'approved',
  showcase_plan = 'premium',
  showcase_priority = greatest(0, 9 - ranked.showcase_pos),
  showcase_approved_at = coalesce(f.showcase_approved_at, now())
from ranked
where f.id = ranked.id
  and ranked.showcase_pos <= 8
  and (f.showcase_status is null or f.showcase_status = 'hidden');
