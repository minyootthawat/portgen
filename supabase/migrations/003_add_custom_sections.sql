-- ============================================================
-- Add custom_sections to portfolios
-- ============================================================
alter table public.portfolios add column if not exists custom_sections jsonb default '[]'::jsonb;
