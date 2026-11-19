-- Foundation for production-grade data model. Apply in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text, created_at timestamptz not null default now());
create table if not exists public.products (id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, description text not null default '', price_cents integer not null check(price_cents>=0), currency text not null default 'BRL', active boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text not null unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_total integer not null check (amount_total >= 0),
  currency text not null default 'brl',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid not null references public.products(id), quantity integer not null check(quantity between 1 and 5), unit_price_cents integer not null check(unit_price_cents>=0));
create table if not exists public.digital_keys (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id), encrypted_key text not null, order_item_id uuid unique references public.order_items(id), created_at timestamptz not null default now());
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.digital_keys enable row level security;
create policy "Profiles read own" on public.profiles for select to authenticated using (auth.uid()=id);
create policy "Profiles update own" on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);
create policy "Products public active" on public.products for select to anon,authenticated using (active=true);
create policy "Orders read own" on public.orders for select to authenticated using (auth.uid()=user_id);
create policy "Order items read own" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
-- Digital keys intentionally have no client-facing select policy.
-- Orders, payment status and key allocation must be written by trusted server code only.
