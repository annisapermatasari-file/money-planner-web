-- Ultimate Money Planner Web — schema and row-level security policies.
-- Run once in the Supabase SQL editor for a new project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- monthly_summaries — aggregate totals used by the dashboard cards/charts
-- ---------------------------------------------------------------------

create table if not exists public.monthly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  income numeric(14, 2) not null default 0,
  expenses numeric(14, 2) not null default 0,
  savings numeric(14, 2) not null default 0,
  debt_balance numeric(14, 2) not null default 0,
  net_worth numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

alter table public.monthly_summaries enable row level security;

create policy "Users manage their own monthly summaries"
  on public.monthly_summaries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- transactions — raw income/expense entries a user logs
-- ---------------------------------------------------------------------

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  occurred_on date not null default current_date,
  category text not null,
  description text,
  amount numeric(14, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users manage their own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- budget_items — per-month category budget vs. actual, for the expense
-- breakdown table and donut chart
-- ---------------------------------------------------------------------

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  category text not null,
  budgeted numeric(14, 2) not null default 0,
  actual numeric(14, 2) not null default 0,
  unique (user_id, year, month, category)
);

alter table public.budget_items enable row level security;

create policy "Users manage their own budget items"
  on public.budget_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- savings_goals
-- ---------------------------------------------------------------------

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null,
  current_amount numeric(14, 2) not null default 0,
  target_date date,
  created_at timestamptz not null default now()
);

alter table public.savings_goals enable row level security;

create policy "Users manage their own savings goals"
  on public.savings_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- debts
-- ---------------------------------------------------------------------

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  initial_balance numeric(14, 2) not null,
  current_balance numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.debts enable row level security;

create policy "Users manage their own debts"
  on public.debts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
