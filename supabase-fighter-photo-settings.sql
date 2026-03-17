-- FightHub - Persistencia de enquadramento da foto do lutador
-- Rode no Supabase SQL Editor se quiser salvar position/zoom no banco.

alter table if exists public.fighters
  add column if not exists photo_position text default '50% 50%';

alter table if exists public.fighters
  add column if not exists photo_zoom numeric default 1;
