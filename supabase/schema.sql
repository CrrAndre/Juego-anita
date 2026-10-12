-- Shelf Sprint: esquema inicial para Supabase/PostgreSQL
create extension if not exists pgcrypto;

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  current_round smallint not null default 1,
  total_rounds smallint not null default 10,
  created_at timestamptz not null default now()
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  avatar_initials text not null,
  total_points integer not null default 0,
  correct_answers integer not null default 0,
  average_response_ms integer,
  joined_at timestamptz not null default now(),
  unique(room_id, display_name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  category text not null,
  subcategory text not null,
  unit text not null,
  description text not null,
  brand text not null,
  reference text not null,
  characteristics jsonb not null default '{}'::jsonb,
  image_url text,
  active boolean not null default true
);

create table public.round_products (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  product_id uuid not null references public.products(id),
  round_number smallint not null,
  unique(room_id, round_number)
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  product_id uuid not null references public.products(id),
  selected_category text not null,
  is_correct boolean not null,
  response_ms integer not null check (response_ms >= 0),
  points_awarded integer not null default 0,
  answered_at timestamptz not null default now()
);

create index answers_room_score_idx on public.answers(room_id, points_awarded desc);
create index players_room_score_idx on public.players(room_id, total_points desc);

alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.products enable row level security;
alter table public.round_products enable row level security;
alter table public.answers enable row level security;

-- Para el MVP: lectura pública de catálogo y salas; las escrituras deben pasar por Edge Functions.
create policy "catalog is readable" on public.products for select using (active = true);
create policy "rooms are readable" on public.rooms for select using (true);
create policy "players are readable" on public.players for select using (true);
create policy "round products are readable" on public.round_products for select using (true);

create or replace function public.calculate_points(is_correct boolean, response_ms integer)
returns integer language sql immutable as $$
  select case when is_correct then 100 + greatest(0, 60 - floor(response_ms / 1000.0)::integer * 5) else 0 end;
$$;

-- Realtime: activar estas tablas desde Database > Replication en el panel de Supabase.
