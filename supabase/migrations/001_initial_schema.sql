-- ============================================================
-- Portfolio Generator — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  provider text check (provider in ('google', 'github', 'email')),
  stripe_customer_id text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PORTFOLIOS
-- ============================================================
create table public.portfolios (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  subdomain text unique not null,
  custom_domain text,

  -- Content
  name text not null,
  tagline text default '',
  about text default '',
  avatar_url text,

  -- JSON fields
  skills jsonb default '[]',
  projects jsonb default '[]',
  social_links jsonb default '[]',

  -- Theme
  theme text not null default 'gradient-dark',
  theme_config jsonb default '{}',

  -- Meta
  is_published boolean not null default false,
  is_deleted boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,

  -- Constraints
  constraint subdomain_length check (char_length(subdomain) >= 3 and char_length(subdomain) <= 50),
  constraint subdomain_format check (subdomain ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$')
);

-- Indexes
create index idx_portfolios_user_id on public.portfolios(user_id);
create index idx_portfolios_subdomain on public.portfolios(subdomain);
create index idx_portfolios_slug on public.portfolios(slug);
create index idx_portfolios_is_published on public.portfolios(is_published) where is_published = true;

-- RLS
alter table public.portfolios enable row level security;

create policy "Users can view own portfolios"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "Users can create own portfolios"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update own portfolios"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "Users can delete own portfolios"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_portfolios_updated_at
  before update on public.portfolios
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- SUBSCRIPTIONS (Stripe)
-- ============================================================
create table public.subscriptions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service can manage subscriptions"
  on public.subscriptions for all
  using (auth.uid() = user_id);

-- ============================================================
-- HELPER: Generate unique subdomain from name
-- ============================================================
create or replace function public.generate_subdomain(base_name text)
returns text as $$
declare
  base text;
  suffix text;
  final_subdomain text;
  counter integer := 0;
begin
  -- Strip special chars, lowercase, replace spaces with hyphens
  base := lower(regexp_replace(base_name, '[^a-z0-9 ]', '', 'g'));
  base := replace(base, ' ', '-');
  base := trim(both '-' from base);
  base := substring(base, 1, 40); -- max 40 chars

  -- Handle empty base
  if base = '' or base is null then
    base := 'portfolio';
  end if;

  final_subdomain := base;
  suffix := '';

  -- Keep trying until we find a unique subdomain
  while exists (select 1 from public.portfolios where subdomain = final_subdomain) loop
    counter := counter + 1;
    suffix := '-' || counter::text;
    final_subdomain := substring(base, 1, 40 - char_length(suffix)) || suffix;
  end loop;

  return final_subdomain;
end;
$$ language plpgsql security definer;

-- ============================================================
-- EXAMPLE: Check subdomain availability
-- ============================================================
create or replace function public.check_subdomain_available(check_subdomain text)
returns boolean as $$
begin
  return not exists (
    select 1 from public.portfolios
    where subdomain = check_subdomain
  );
end;
$$ language plpgsql security definer;
