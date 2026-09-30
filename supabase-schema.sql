-- =========================================================================
-- RIVA STREETWEAR (PAKISTAN / INTERNATIONAL) - SUPABASE POSTGRESQL SCHEMA
-- PRODUCTION-GRADE HARDENED ARCHITECTURE WITH ROW LEVEL SECURITY (RLS),
-- ATOMIC SERVER-SIDE ORDER PLACEMENT, STOCK LOCKS, AND ROLE-BASED ACCESS
-- =========================================================================

-- 0. EXTENSIONS SETUP
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. PROFILES TABLE (Linked with Supabase Auth users)
-- =========================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin', 'warehouse_staff')),
  full_name text,
  phone text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Security Definer helper functions to avoid infinite RLS recursion on profiles
create or replace function public.get_auth_role()
returns text as $$
declare
  v_role text;
begin
  select role into v_role
  from public.profiles
  where id = auth.uid();
  return coalesce(v_role, 'anon');
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.is_admin()
returns boolean as $$
begin
  return public.get_auth_role() = 'admin';
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.is_staff()
returns boolean as $$
begin
  return public.get_auth_role() in ('admin', 'warehouse_staff');
end;
$$ language plpgsql security definer set search_path = public;

-- Profiles RLS Policies:
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Staff can view all profiles" on public.profiles;
create policy "Staff can view all profiles"
  on public.profiles for select
  using (public.is_staff());

drop policy if exists "Users can update own profile data" on public.profiles;
create policy "Users can update own profile data"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id and (
      -- Regular users cannot escalate their own role
      role = (select p.role from public.profiles p where p.id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create profile upon Supabase Auth sign up
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();


-- =========================================================================
-- 2. PRODUCTS TABLE
-- =========================================================================
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  title text not null,
  collection text not null check (collection in ('men', 'women', 'kids')),
  category text not null,
  category_label text not null,
  price_pkr integer not null check (price_pkr > 0),
  compare_at_price_pkr integer check (compare_at_price_pkr is null or compare_at_price_pkr >= price_pkr),
  description text not null,
  gsm integer not null check (gsm > 0),
  fabric_composition text not null,
  fabric_weave text not null,
  origin text not null default 'Lahore, Pakistan',
  features jsonb not null default '[]'::jsonb,
  care_instructions jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_draft_sample boolean not null default true,
  featured boolean not null default false,
  is_new_arrival boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on products
alter table public.products enable row level security;

-- Products Policies:
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
  on public.products for select
  using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());


-- =========================================================================
-- 3. ORDERS TABLE
-- =========================================================================
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid default gen_random_uuid() not null,
  customer_name text not null check (length(trim(customer_name)) >= 2),
  customer_phone text not null check (length(trim(customer_phone)) >= 7),
  customer_email text not null check (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  customer_city text not null,
  customer_address text not null,
  postal_code text,
  delivery_notes text,
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  shipping_fee_pkr integer not null default 0 check (shipping_fee_pkr >= 0),
  discount_pkr integer not null default 0 check (discount_pkr >= 0),
  total_pkr integer not null check (total_pkr = (subtotal_pkr + shipping_fee_pkr - discount_pkr) and total_pkr >= 0),
  payment_method text not null check (payment_method in ('cod', 'card_demo', 'bank_transfer')),
  status text not null default 'pending_verification' check (status in ('pending_verification', 'packed', 'dispatched', 'delivered', 'cancelled')),
  is_demo boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders Policies:
-- 1. Authenticated users can view their own orders
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() is not null and auth.uid() = user_id);

-- 2. Staff and admins can view all orders
drop policy if exists "Staff can view all orders" on public.orders;
create policy "Staff can view all orders"
  on public.orders for select
  using (public.is_staff());

-- 3. Only staff and admins can update order status
drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

-- Direct public INSERT into orders is disabled via RLS.
-- Orders MUST be placed via the atomic server-side RPC function: public.place_order()
-- This completely prevents price manipulation, fake totals, and inventory overselling.


-- =========================================================================
-- 4. ORDER ITEMS TABLE
-- =========================================================================
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) not null,
  product_title text not null,
  selected_size text not null,
  selected_color text not null,
  quantity integer not null check (quantity > 0 and quantity <= 50),
  unit_price_pkr integer not null check (unit_price_pkr > 0),
  total_price_pkr integer not null check (total_price_pkr = (unit_price_pkr * quantity))
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Order Items Policies:
drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (
        (auth.uid() is not null and o.user_id = auth.uid())
        or public.is_staff()
      )
    )
  );


-- =========================================================================
-- 5. ATOMIC SERVER-SIDE ORDER PLACEMENT RPC (SECURE GUEST & USER CHECKOUT)
-- =========================================================================
create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_city text,
  p_customer_address text,
  p_postal_code text default null,
  p_delivery_notes text default null,
  p_payment_method text default 'cod',
  p_promo_code text default null,
  p_items jsonb default '[]'::jsonb
)
returns jsonb as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_guest_token uuid;
  v_user_id uuid;
  v_item jsonb;
  v_product_id text;
  v_quantity integer;
  v_size text;
  v_color text;
  v_real_title text;
  v_real_price integer;
  v_current_stock integer;
  v_subtotal_pkr integer := 0;
  v_shipping_pkr integer := 0;
  v_discount_pkr integer := 0;
  v_total_pkr integer := 0;
  v_item_total integer := 0;
  v_rand integer;
begin
  -- 1. Validate customer input parameters
  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Customer name must be at least 2 characters.';
  end if;

  if length(trim(coalesce(p_customer_phone, ''))) < 7 then
    raise exception 'Valid Pakistani mobile/phone number is required.';
  end if;

  if p_customer_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'Valid email address is required.';
  end if;

  if p_payment_method not in ('cod', 'card_demo', 'bank_transfer') then
    raise exception 'Invalid payment method: %', p_payment_method;
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Shopping cart cannot be empty.';
  end if;

  -- 2. Generate unique order number (RIVA-XXXXX)
  loop
    v_rand := floor(10000 + random() * 90000)::integer;
    v_order_number := 'RIVA-' || v_rand::text;
    exit when not exists (select 1 from public.orders where order_number = v_order_number);
  end loop;

  v_order_id := gen_random_uuid();
  v_guest_token := gen_random_uuid();
  v_user_id := auth.uid(); -- NULL for guest checkouts

  -- 3. Validate each item against database, lock rows, and deduct stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item->>'product_id';
    v_quantity := (v_item->>'quantity')::integer;
    v_size := coalesce(v_item->>'size', 'Standard');
    v_color := coalesce(v_item->>'color', 'Default');

    if v_quantity is null or v_quantity <= 0 or v_quantity > 50 then
      raise exception 'Invalid quantity: %', v_quantity;
    end if;

    -- Lock product row FOR UPDATE to prevent concurrent overselling race conditions
    select title, price_pkr, stock_quantity
    into v_real_title, v_real_price, v_current_stock
    from public.products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'Product not found or unavailable in catalog: %', v_product_id;
    end if;

    if v_current_stock < v_quantity then
      raise exception 'Insufficient stock for "%". Available: %, Requested: %', v_real_title, v_current_stock, v_quantity;
    end if;

    -- Compute true unit and item prices server-side
    v_item_total := v_real_price * v_quantity;
    v_subtotal_pkr := v_subtotal_pkr + v_item_total;

    -- Deduct stock atomically
    update public.products
    set stock_quantity = stock_quantity - v_quantity,
        updated_at = timezone('utc'::text, now())
    where id = v_product_id;
  end loop;

  -- 4. Server-Side Shipping Calculation (Free over PKR 7,500 across Pakistan)
  if v_subtotal_pkr >= 7500 then
    v_shipping_pkr := 0;
  else
    v_shipping_pkr := 250;
  end if;

  -- 5. Server-Side Promo Discount Validation
  if upper(trim(coalesce(p_promo_code, ''))) = 'STANDOUT10' then
    v_discount_pkr := floor(v_subtotal_pkr * 0.10)::integer;
  else
    v_discount_pkr := 0;
  end if;

  v_total_pkr := v_subtotal_pkr + v_shipping_pkr - v_discount_pkr;

  -- 6. Insert Order Record
  insert into public.orders (
    id,
    order_number,
    user_id,
    guest_token,
    customer_name,
    customer_phone,
    customer_email,
    customer_city,
    customer_address,
    postal_code,
    delivery_notes,
    subtotal_pkr,
    shipping_fee_pkr,
    discount_pkr,
    total_pkr,
    payment_method,
    status,
    is_demo
  ) values (
    v_order_id,
    v_order_number,
    v_user_id,
    v_guest_token,
    trim(p_customer_name),
    trim(p_customer_phone),
    lower(trim(p_customer_email)),
    trim(p_customer_city),
    trim(p_customer_address),
    nullif(trim(p_postal_code), ''),
    nullif(trim(p_delivery_notes), ''),
    v_subtotal_pkr,
    v_shipping_pkr,
    v_discount_pkr,
    v_total_pkr,
    p_payment_method,
    'pending_verification',
    false
  );

  -- 7. Insert Order Items Record
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item->>'product_id';
    v_quantity := (v_item->>'quantity')::integer;
    v_size := coalesce(v_item->>'size', 'Standard');
    v_color := coalesce(v_item->>'color', 'Default');

    select title, price_pkr
    into v_real_title, v_real_price
    from public.products
    where id = v_product_id;

    insert into public.order_items (
      order_id,
      product_id,
      product_title,
      selected_size,
      selected_color,
      quantity,
      unit_price_pkr,
      total_price_pkr
    ) values (
      v_order_id,
      v_product_id,
      v_real_title,
      v_size,
      v_color,
      v_quantity,
      v_real_price,
      v_real_price * v_quantity
    );
  end loop;

  -- 8. Return Confirmation Payload
  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'guest_token', v_guest_token,
    'subtotal_pkr', v_subtotal_pkr,
    'shipping_fee_pkr', v_shipping_pkr,
    'discount_pkr', v_discount_pkr,
    'total_pkr', v_total_pkr,
    'status', 'pending_verification'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Grant execution permission to anonymous and authenticated users
grant execute on function public.place_order to anon, authenticated;


-- =========================================================================
-- 6. STOCK RESTORATION TRIGGER (ON ORDER CANCELLATION)
-- =========================================================================
create or replace function public.handle_order_cancellation()
returns trigger as $$
begin
  -- If order status transitions to 'cancelled', return items back to inventory
  if old.status <> 'cancelled' and new.status = 'cancelled' then
    update public.products p
    set stock_quantity = p.stock_quantity + oi.quantity,
        updated_at = timezone('utc'::text, now())
    from public.order_items oi
    where oi.order_id = new.id and p.id = oi.product_id;
  end if;

  -- If a previously cancelled order is reactivated, deduct stock again
  if old.status = 'cancelled' and new.status <> 'cancelled' then
    update public.products p
    set stock_quantity = greatest(0, p.stock_quantity - oi.quantity),
        updated_at = timezone('utc'::text, now())
    from public.order_items oi
    where oi.order_id = new.id and p.id = oi.product_id;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trigger_restore_stock_on_cancel on public.orders;
create trigger trigger_restore_stock_on_cancel
  after update of status on public.orders
  for each row execute function public.handle_order_cancellation();


-- =========================================================================
-- 7. SECURE GUEST ORDER TRACKING RPC (PROTECTS CUSTOMER PRIVACY)
-- =========================================================================
create or replace function public.get_guest_order(
  p_order_number text,
  p_guest_token uuid
)
returns jsonb as $$
declare
  v_order jsonb;
  v_items jsonb;
begin
  select to_jsonb(o) into v_order
  from public.orders o
  where o.order_number = trim(p_order_number)
    and o.guest_token = p_guest_token;

  if v_order is null then
    return null;
  end if;

  select jsonb_agg(to_jsonb(oi)) into v_items
  from public.order_items oi
  where oi.order_id = (v_order->>'id')::uuid;

  return jsonb_build_object(
    'order', v_order,
    'items', coalesce(v_items, '[]'::jsonb)
  );
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.get_guest_order to anon, authenticated;


-- =========================================================================
-- 8. INITIAL SEED DATA (RIVA STREETWEAR BASELINE CATALOG)
-- =========================================================================
insert into public.products (
  id, slug, title, collection, category, category_label, price_pkr, compare_at_price_pkr,
  description, gsm, fabric_composition, fabric_weave, origin, stock_quantity,
  is_draft_sample, featured, is_new_arrival, images, sizes, colors
) values
(
  'riva-m-01',
  'heavyweight-oversized-hoodie-black',
  '460 GSM Heavyweight Boxy Hoodie',
  'men', 'hoodies', 'Hoodies', 8950, 10500,
  'Architectural drop-shoulder silhouette crafted from 460 GSM combed Pakistani cotton with plush loopback interior.',
  460, '100% Combed Pakistani Cotton', 'Heavy Loopback French Terry', 'Lahore, Pakistan', 18,
  false, true, true,
  '["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
  '["S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Onyx Black", "hex": "#0B0B0D", "code": "black"}]'::jsonb
),
(
  'riva-m-02',
  'raw-seam-heavy-tee-charcoal',
  '300 GSM Heavyweight Raw Edge Tee',
  'men', 'oversized-t-shirts', 'Oversized T-Shirts', 4850, null,
  'Substantial 300 GSM combed cotton jersey with distressed raw hem and high-density ribbed collar.',
  300, '100% Long-Staple Cotton', 'Dense Single Jersey', 'Lahore, Pakistan', 24,
  false, true, true,
  '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
  '["S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Washed Charcoal", "hex": "#27272A", "code": "charcoal"}]'::jsonb
),
(
  'riva-w-01',
  'contemporary-cocoon-duster-bone',
  'Architectural Cocoon Duster Robe',
  'women', 'modest-streetwear', 'Modest Streetwear', 9850, 11500,
  'Floor-length drape with drop shoulders and deep patch pockets, tailored from 380 GSM textured French terry.',
  380, '100% Pure Combed Cotton', 'Textured Knit', 'Lahore, Pakistan', 14,
  false, true, true,
  '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
  '["XS", "S", "M", "L"]'::jsonb,
  '[{"name": "Bone Beige", "hex": "#E4DFD3", "code": "beige"}]'::jsonb
)
on conflict (id) do nothing;
