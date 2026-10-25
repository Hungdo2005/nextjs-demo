-- ==============================================================================
-- Supabase Schema: favorites table & Row Level Security (RLS) policies
-- Course: FER202 - Lab 3
-- Author: Đỗ Bá Quang Hưng (QE190032)
-- ==============================================================================

-- 1. Create table public.favorites
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.favorites enable row level security;

-- 3. Drop existing policies if any
drop policy if exists "read own" on public.favorites;
drop policy if exists "insert own" on public.favorites;
drop policy if exists "delete own" on public.favorites;

-- 4. Create RLS Policies
-- Policy: Users can only read their own favorites
create policy "read own"
  on public.favorites
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Policy: Users can only insert favorites for their own user_id
create policy "insert own"
  on public.favorites
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Users can only delete their own favorites
create policy "delete own"
  on public.favorites
  for delete
  to authenticated
  using (auth.uid() = user_id);
