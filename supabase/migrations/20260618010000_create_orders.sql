create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null check (char_length(trim(customer_name)) > 0),
  email text not null check (char_length(trim(email)) > 0),
  phone text not null check (char_length(trim(phone)) > 0),
  address text not null check (char_length(trim(address)) > 0),
  quantity integer not null default 0 check (quantity >= 0),
  amount numeric(12, 2) not null check (amount >= 0),
  payment_method text not null check (char_length(trim(payment_method)) > 0),
  status text not null default 'Confirmed' check (char_length(trim(status)) > 0),
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.orders
  add column if not exists status text not null default 'Confirmed',
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists updated_at timestamp with time zone not null default now();

update public.orders
set
  status = coalesce(nullif(trim(status), ''), 'Confirmed'),
  items = coalesce(items, '[]'::jsonb),
  updated_at = coalesce(updated_at, created_at, now());

alter table public.orders
  alter column status set default 'Confirmed',
  alter column items set default '[]'::jsonb,
  alter column updated_at set default now(),
  alter column status set not null,
  alter column items set not null,
  alter column updated_at set not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;
