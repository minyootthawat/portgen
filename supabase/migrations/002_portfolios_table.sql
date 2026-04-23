-- ============================================================
-- Portfolio Generator — Portfolios Table (Task 7 EVEN)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (if not already enabled in 001)
create extension if not exists "uuid-ossp";

-- ============================================================
-- PORTFOLIOS TABLE
-- ============================================================
create table public.portfolios (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  subdomain text unique not null,
  jsx_code text default '',
  theme text not null default 'gradient-dark',
  skills jsonb default '[]',
  published boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint subdomain_length check (char_length(subdomain) >= 3 and char_length(subdomain) <= 50),
  constraint subdomain_format check (subdomain ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$')
);

-- Indexes
create index idx_portfolios_user_id on public.portfolios(user_id);
create index idx_portfolios_subdomain on public.portfolios(subdomain);
create index idx_portfolios_published on public.portfolios(published) where published = true;

-- ============================================================
-- ROW-LEVEL SECURITY POLICIES (user ownership)
-- ============================================================
alter table public.portfolios enable row level security;

-- Users can view own portfolios
create policy "portfolios_select_own"
  on public.portfolios for select
  using (auth.uid() = user_id);

-- Users can insert own portfolios
create policy "portfolios_insert_own"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

-- Users can update own portfolios
create policy "portfolios_update_own"
  on public.portfolios for update
  using (auth.uid() = user_id);

-- Users can delete own portfolios
create policy "portfolios_delete_own"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.update_portfolios_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger update_portfolios_updated_at
  before update on public.portfolios
  for each row execute procedure public.update_portfolios_updated_at();
