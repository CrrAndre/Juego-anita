-- Shelf Sprint: esquema idempotente para Supabase/PostgreSQL.
-- Puede ejecutarse varias veces sin borrar datos existentes.
create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  current_round smallint not null default 1,
  total_rounds smallint not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
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

create table if not exists public.products (
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

create table if not exists public.round_products (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  product_id uuid not null references public.products(id),
  round_number smallint not null,
  unique(room_id, round_number)
);

create table if not exists public.answers (
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

create index if not exists answers_room_score_idx on public.answers(room_id, points_awarded desc);
create index if not exists players_room_score_idx on public.players(room_id, total_points desc);

alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.products enable row level security;
alter table public.round_products enable row level security;
alter table public.answers enable row level security;

-- Para el MVP: lectura pública de catálogo y salas; las escrituras deben pasar por Edge Functions.
drop policy if exists "catalog is readable" on public.products;
drop policy if exists "rooms are readable" on public.rooms;
drop policy if exists "players are readable" on public.players;
drop policy if exists "round products are readable" on public.round_products;

create policy "catalog is readable" on public.products for select using (active = true);
create policy "rooms are readable" on public.rooms for select using (true);
create policy "players are readable" on public.players for select using (true);
create policy "round products are readable" on public.round_products for select using (true);

create or replace function public.calculate_points(is_correct boolean, response_ms integer)
returns integer language sql immutable as $$
  select case when is_correct then 100 + greatest(0, 60 - floor(response_ms / 1000.0)::integer * 5) else 0 end;
$$;

create or replace function public.join_room(
  p_code text,
  p_display_name text,
  p_avatar_initials text
)
returns table (room_id uuid, player_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_room public.rooms%rowtype;
  inserted_player public.players%rowtype;
begin
  select *
    into selected_room
    from public.rooms
   where upper(code) = upper(trim(p_code))
   limit 1;

  if selected_room.id is null then
    raise exception 'La sala no existe.';
  end if;

  if selected_room.status = 'finished' then
    raise exception 'La sala ya terminó.';
  end if;

  if exists (
    select 1
      from public.players
     where room_id = selected_room.id
       and lower(display_name) = lower(trim(p_display_name))
  ) then
    raise exception 'Ese usuario ya está en la sala.';
  end if;

  insert into public.players (room_id, display_name, avatar_initials)
  values (
    selected_room.id,
    trim(p_display_name),
    upper(trim(p_avatar_initials))
  )
  returning * into inserted_player;

  return query select selected_room.id, inserted_player.id;
end;
$$;

revoke all on function public.join_room(text, text, text) from public;
grant execute on function public.join_room(text, text, text) to anon, authenticated;

-- Realtime: algunas cuentas no muestran el selector en el Dashboard.
-- Este bloque agrega las tablas a la publicación sin duplicarlas.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.players;
    exception when duplicate_object then
      null;
    end;
    begin
      alter publication supabase_realtime add table public.rooms;
    exception when duplicate_object then
      null;
    end;
    begin
      alter publication supabase_realtime add table public.answers;
    exception when duplicate_object then
      null;
    end;
  end if;
end
$$;
