-- DaFoExpress starter backend for Supabase.
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  email text,
  role text not null default 'customer' check (role in ('customer', 'driver', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default 'fast-food',
  created_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  rating numeric(2, 1) not null default 4.5,
  delivery_time text not null default '20-30 min',
  price_level text not null default 'GNF',
  address text not null default 'Conakry',
  image_color text not null default '#EAD2C6',
  icon text not null default 'fast-food',
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists menu_items_restaurant_name_key
on public.menu_items (restaurant_id, name);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  restaurant_name text not null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references auth.users(id) on delete set null,
  status text not null default 'placed' check (
    status in ('placed', 'accepted', 'preparing', 'picked_up', 'delivered', 'cancelled')
  ),
  payment_method text not null check (payment_method in ('orange', 'card', 'cash')),
  order_type text not null default 'delivery' check (order_type in ('delivery', 'pickup')),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total >= 0),
  delivery_code text not null,
  delivery_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  quantity integer not null check (quantity > 0)
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Profiles are readable by their owner" on public.profiles;
create policy "Profiles are readable by their owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Catalog is public" on public.categories;
create policy "Catalog is public"
on public.categories for select
using (true);

drop policy if exists "Restaurants are public" on public.restaurants;
create policy "Restaurants are public"
on public.restaurants for select
using (true);

drop policy if exists "Menus are public" on public.menu_items;
create policy "Menus are public"
on public.menu_items for select
using (true);

drop policy if exists "Customers can read their orders" on public.orders;
create policy "Customers can read their orders"
on public.orders for select
using (auth.uid() = customer_id or auth.uid() = driver_id);

drop policy if exists "Customers can place orders" on public.orders;
create policy "Customers can place orders"
on public.orders for insert
with check (auth.uid() = customer_id);

drop policy if exists "Drivers and customers can update visible orders" on public.orders;
create policy "Drivers and customers can update visible orders"
on public.orders for update
using (auth.uid() = customer_id or auth.uid() = driver_id)
with check (auth.uid() = customer_id or auth.uid() = driver_id);

drop policy if exists "Users can read items from their orders" on public.order_items;
create policy "Users can read items from their orders"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.customer_id = auth.uid() or orders.driver_id = auth.uid())
  )
);

drop policy if exists "Customers can add items to their orders" on public.order_items;
create policy "Customers can add items to their orders"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.customer_id = auth.uid()
  )
);

insert into public.categories (id, name, icon) values
  ('11111111-1111-4111-8111-111111111111', 'Pizza', 'pizza'),
  ('22222222-2222-4222-8222-222222222222', 'Burger', 'fast-food'),
  ('33333333-3333-4333-8333-333333333333', 'Sushi', 'fish'),
  ('44444444-4444-4444-8444-444444444444', 'Coffee', 'cafe')
on conflict (id) do update set name = excluded.name, icon = excluded.icon;

insert into public.restaurants (id, name, slug, category_id, rating, delivery_time, price_level, address, image_color, icon) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'The Burger Palace', 'burger-palace', '22222222-2222-4222-8222-222222222222', 4.8, '15-25 min', 'GNF', 'Kaloum, Conakry', '#EAD2C6', 'fast-food'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Pizza Hut', 'pizza-hut', '11111111-1111-4111-8111-111111111111', 4.5, '20-30 min', 'GNF', 'Dixinn, Conakry', '#F0DFD3', 'pizza')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  category_id = excluded.category_id,
  rating = excluded.rating,
  delivery_time = excluded.delivery_time,
  price_level = excluded.price_level,
  address = excluded.address,
  image_color = excluded.image_color,
  icon = excluded.icon;

insert into public.menu_items (restaurant_id, name, description, price) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Classic Cheeseburger', 'Beef, cheddar, pickles, and our secret sauce.', 45000),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Bacon Deluxe', 'Double patty with crispy bacon and BBQ sauce.', 55000),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Truffle Fries', 'Hand-cut fries with truffle oil and parmesan.', 25000),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Pepperoni Feast', 'Loaded with pepperoni and extra mozzarella.', 70000),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Veggie Supreme', 'Fresh peppers, onions, mushrooms, and olives.', 65000),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Garlic Breadsticks', 'Baked fresh with garlic butter dipping sauce.', 20000)
on conflict (restaurant_id, name) do update set
  description = excluded.description,
  price = excluded.price;