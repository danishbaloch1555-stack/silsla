import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, OrderStatus, CartItem, ProductColor } from '../types';

/**
 * RIVA Streetwear - Supabase Production Integration
 *
 * Project URL: https://nohmukmrxobjiveipfay.supabase.co
 * Key source: process.env.VITE_SUPABASE_ANON_KEY (from .env or hosting environment variables)
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

const DEFAULT_SUPABASE_URL = 'https://nohmukmrxobjiveipfay.supabase.co';

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  
  // 1. Check Vite / AI Studio Environment variable
  let anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  // 2. Check browser local storage fallback
  if (!anonKey || anonKey.trim().length <= 15) {
    try {
      const savedKey = localStorage.getItem('riva_supabase_anon_key');
      if (savedKey && savedKey.trim().length > 15) {
        anonKey = savedKey.trim();
      }
    } catch {}
  }

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !anonKey.includes('YOUR_') &&
    anonKey.trim().length > 15
  );

  return {
    url,
    anonKey,
    isConfigured,
  };
};

let _clientInstance: SupabaseClient | null = null;
let _cachedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!_clientInstance || _cachedKey !== config.anonKey) {
    _cachedKey = config.anonKey;
    _clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return _clientInstance;
}

export function saveBrowserSupabaseKey(key: string): void {
  try {
    if (key && key.trim().length > 15) {
      localStorage.setItem('riva_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('riva_supabase_anon_key');
    }
    _clientInstance = null;
    _cachedKey = '';
  } catch {}
}

export function clearBrowserSupabaseKey(): void {
  try {
    localStorage.removeItem('riva_supabase_anon_key');
    _clientInstance = null;
    _cachedKey = '';
  } catch {}
}

// Dynamic Supabase Proxy that delegates to the active client
export const supabase: SupabaseClient | null = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) return undefined;
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});

// =========================================================================
// DATA MAPPERS (POSTGRESQL SNAKE_CASE <-> TYPESCRIPT CAMELCASE)
// =========================================================================

export function mapSupabaseToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    collection: row.collection,
    category: row.category,
    categoryLabel: row.category_label || row.title,
    pricePKR: Number(row.price_pkr),
    compareAtPricePKR: row.compare_at_price_pkr ? Number(row.compare_at_price_pkr) : undefined,
    description: row.description || '',
    fabricDetails: {
      gsm: Number(row.gsm || 400),
      composition: row.fabric_composition || '100% Combed Cotton',
      weave: row.fabric_weave || 'Heavy Knit',
      origin: row.origin || 'Lahore, Pakistan',
    },
    features: Array.isArray(row.features) ? row.features : [],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : ['S', 'M', 'L', 'XL'],
    colors: Array.isArray(row.colors)
      ? row.colors
      : [{ name: 'Standard', hex: '#0B0B0D', code: 'standard' }],
    images: Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'],
    stockQuantity: Number(row.stock_quantity ?? 0),
    isDraftSample: Boolean(row.is_draft_sample),
    featured: Boolean(row.featured),
    isNewArrival: Boolean(row.is_new_arrival),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapProductToSupabase(p: Partial<Product>): Record<string, any> {
  const payload: Record<string, any> = {};
  if (p.id !== undefined) payload.id = p.id;
  if (p.slug !== undefined) payload.slug = p.slug;
  if (p.title !== undefined) payload.title = p.title;
  if (p.collection !== undefined) payload.collection = p.collection;
  if (p.category !== undefined) payload.category = p.category;
  if (p.categoryLabel !== undefined) payload.category_label = p.categoryLabel;
  if (p.pricePKR !== undefined) payload.price_pkr = p.pricePKR;
  if (p.compareAtPricePKR !== undefined) payload.compare_at_price_pkr = p.compareAtPricePKR;
  if (p.description !== undefined) payload.description = p.description;
  if (p.fabricDetails) {
    if (p.fabricDetails.gsm !== undefined) payload.gsm = p.fabricDetails.gsm;
    if (p.fabricDetails.composition !== undefined) payload.fabric_composition = p.fabricDetails.composition;
    if (p.fabricDetails.weave !== undefined) payload.fabric_weave = p.fabricDetails.weave;
    if (p.fabricDetails.origin !== undefined) payload.origin = p.fabricDetails.origin;
  }
  if (p.features !== undefined) payload.features = p.features;
  if (p.careInstructions !== undefined) payload.care_instructions = p.careInstructions;
  if (p.sizes !== undefined) payload.sizes = p.sizes;
  if (p.colors !== undefined) payload.colors = p.colors;
  if (p.images !== undefined) payload.images = p.images;
  if (p.stockQuantity !== undefined) payload.stock_quantity = p.stockQuantity;
  if (p.isDraftSample !== undefined) payload.is_draft_sample = p.isDraftSample;
  if (p.featured !== undefined) payload.featured = p.featured;
  if (p.isNewArrival !== undefined) payload.is_new_arrival = p.isNewArrival;
  return payload;
}

// =========================================================================
// DATABASE OPERATIONS (LIVE SUPABASE WITH RESILIENT FALLBACK)
// =========================================================================

/**
 * Fetch catalog products from Supabase
 */
export async function fetchSupabaseProducts(): Promise<{ data: Product[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };
    return { data: (data || []).map(mapSupabaseToProduct), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Add product to Supabase
 */
export async function createSupabaseProduct(product: Product): Promise<{ success: boolean; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: new Error('Supabase not configured') };
  try {
    const payload = mapProductToSupabase(product);
    const { error } = await client.from('products').insert([payload]);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Update product in Supabase
 */
export async function updateSupabaseProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: new Error('Supabase not configured') };
  try {
    const payload = mapProductToSupabase(updates);
    const { error } = await client.from('products').update(payload).eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Delete product in Supabase
 */
export async function deleteSupabaseProduct(id: string): Promise<{ success: boolean; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Update stock count in Supabase
 */
export async function updateSupabaseStock(id: string, stockQuantity: number): Promise<{ success: boolean; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await client
      .from('products')
      .update({ stock_quantity: Math.max(0, stockQuantity), updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Bulk sync catalog products into Supabase products table
 */
export async function syncCatalogToSupabase(products: Product[]): Promise<{ success: boolean; count: number; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, count: 0, error: new Error('Supabase not configured') };
  try {
    const payload = products.map(mapProductToSupabase);
    const { error, data } = await client
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select('id');

    if (error) return { success: false, count: 0, error };
    return { success: true, count: data?.length || payload.length };
  } catch (err) {
    return { success: false, count: 0, error: err };
  }
}

/**
 * Atomic Server-Side Order Placement RPC (Guest & Authenticated)
 * Executes through public.place_order() with row-level locks and price validation
 */
export async function placeSupabaseOrder(params: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerAddress: string;
  postalCode?: string;
  deliveryNotes?: string;
  paymentMethod: 'cod' | 'card_demo' | 'bank_transfer';
  promoCode?: string;
  items: CartItem[];
}): Promise<{
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    guestToken: string;
    subtotalPKR: number;
    shippingFeePKR: number;
    discountPKR: number;
    totalPKR: number;
    status: OrderStatus;
  };
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const itemsPayload = params.items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor.name,
    }));

    const { data, error } = await client.rpc('place_order', {
      p_customer_name: params.customerName.trim(),
      p_customer_phone: params.customerPhone.trim(),
      p_customer_email: params.customerEmail.trim(),
      p_customer_city: params.customerCity.trim(),
      p_customer_address: params.customerAddress.trim(),
      p_postal_code: params.postalCode?.trim() || null,
      p_delivery_notes: params.deliveryNotes?.trim() || null,
      p_payment_method: params.paymentMethod,
      p_promo_code: params.promoCode?.trim() || null,
      p_items: itemsPayload,
    });

    if (error) {
      console.error('Supabase place_order RPC error:', error);
      return { success: false, error: error.message || 'Server-side order placement failed.' };
    }

    if (data && data.success) {
      return {
        success: true,
        order: {
          id: data.order_id,
          orderNumber: data.order_number,
          guestToken: data.guest_token,
          subtotalPKR: data.subtotal_pkr,
          shippingFeePKR: data.shipping_fee_pkr,
          discountPKR: data.discount_pkr,
          totalPKR: data.total_pkr,
          status: data.status,
        },
      };
    }

    return { success: false, error: 'Unexpected response from database.' };
  } catch (err: any) {
    console.error('placeSupabaseOrder catch error:', err);
    return { success: false, error: err.message || 'Network error during order placement.' };
  }
}

/**
 * Fetch all orders with their items for Admin and Warehouse staff
 */
export async function fetchSupabaseOrders(): Promise<{ data: Order[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: new Error('Supabase not configured') };

  try {
    const { data: ordersData, error: ordersErr } = await client
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (ordersErr) return { data: null, error: ordersErr };

    const mapped: Order[] = (ordersData || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      guestToken: o.guest_token,
      customer: {
        fullName: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email,
        city: o.customer_city,
        address: o.customer_address,
        postalCode: o.postal_code || undefined,
        notes: o.delivery_notes || undefined,
      },
      subtotalPKR: Number(o.subtotal_pkr),
      shippingFeePKR: Number(o.shipping_fee_pkr),
      discountPKR: Number(o.discount_pkr),
      totalPKR: Number(o.total_pkr),
      paymentMethod: o.payment_method,
      status: o.status,
      isDemo: Boolean(o.is_demo),
      items: (o.order_items || []).map((oi: any) => ({
        id: oi.id,
        selectedSize: oi.selected_size,
        selectedColor: { name: oi.selected_color, hex: '#111111', code: 'default' },
        quantity: oi.quantity,
        product: {
          id: oi.product_id,
          slug: oi.product_id,
          title: oi.product_title,
          collection: 'men',
          category: 'hoodies',
          categoryLabel: 'Apparel',
          pricePKR: Number(oi.unit_price_pkr),
          description: '',
          fabricDetails: { gsm: 400, composition: 'Cotton', weave: 'Knit', origin: 'Pakistan' },
          features: [],
          careInstructions: [],
          sizes: [oi.selected_size],
          colors: [{ name: oi.selected_color, hex: '#111111', code: 'default' }],
          images: [],
          stockQuantity: 10,
          isDraftSample: true,
          createdAt: o.created_at,
        },
      })),
    }));

    return { data: mapped, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Update order fulfillment status in Supabase (triggers stock auto-restoration on cancel)
 */
export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Track guest or authenticated order using order_number + guest_token
 */
export async function trackSupabaseOrder(orderNumber: string, guestToken: string): Promise<{ data: any | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await client.rpc('get_guest_order', {
      p_order_number: orderNumber.trim(),
      p_guest_token: guestToken.trim(),
    });
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Authenticate staff/admin with Supabase Auth and check profile role
 */
export async function signInSupabaseAdmin(email: string, password: string): Promise<{
  success: boolean;
  role?: 'admin' | 'warehouse_staff';
  user?: any;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Authentication failed: User record not returned by Supabase.' };
    }

    // Verify role in public.profiles:
    // 1. Try finding profile by user id (authData.user.id)
    let profile: { id?: string; role: string; full_name?: string; email?: string } | null = null;
    const { data: profileById, error: profError } = await client
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileById) {
      profile = profileById;
    } else if (authData.user.email) {
      // 2. Fallback: check if profile was created by email with custom/mismatched id
      const { data: profileByEmail } = await client
        .from('profiles')
        .select('id, role, full_name, email')
        .ilike('email', authData.user.email.trim())
        .maybeSingle();

      if (profileByEmail) {
        profile = profileByEmail;
      }
    }

    // 3. If profile row doesn't exist yet, insert it automatically
    if (!profile && authData.user.email) {
      const { data: createdProfile, error: insertError } = await client
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email.toLowerCase().trim(),
          full_name: authData.user.user_metadata?.full_name || '',
          role: 'customer',
        })
        .select('id, role, full_name, email')
        .maybeSingle();

      if (!insertError && createdProfile) {
        profile = createdProfile;
      }
    }

    if (!profile) {
      await client.auth.signOut();
      return {
        success: false,
        error: `Profile not found for user ${authData.user.email}. In Supabase SQL Editor run: INSERT INTO public.profiles (id, email, role) VALUES ('${authData.user.id}', '${authData.user.email}', 'admin');`,
      };
    }

    if (profile.role !== 'admin' && profile.role !== 'warehouse_staff') {
      await client.auth.signOut();
      return {
        success: false,
        error: `Access denied. Account "${authData.user.email}" has role "${profile.role}". To grant administrator rights, run in Supabase SQL Editor: UPDATE public.profiles SET role = 'admin' WHERE id = '${authData.user.id}';`,
      };
    }

    return {
      success: true,
      role: profile.role as 'admin' | 'warehouse_staff',
      user: authData.user,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
}

/**
 * Sign out Supabase session
 */
export async function signOutSupabaseSession(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
}

/**
 * Get current authenticated user's profile and role
 */
export async function getCurrentSupabaseRole(): Promise<'admin' | 'warehouse_staff' | 'customer' | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return null;

    const { data: profile } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role || 'customer';
  } catch {
    return null;
  }
}

/**
 * Hardened SQL Schema for Supabase PostgreSQL
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- RIVA STREETWEAR (PAKISTAN / INTERNATIONAL) - SUPABASE POSTGRESQL SCHEMA
-- PRODUCTION-GRADE HARDENED ARCHITECTURE WITH ROW LEVEL SECURITY (RLS),
-- ATOMIC SERVER-SIDE ORDER PLACEMENT, STOCK LOCKS, AND ROLE-BASED ACCESS
-- =========================================================================

-- 0. EXTENSIONS SETUP
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
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

alter table public.profiles enable row level security;

create or replace function public.get_auth_role()
returns text as $$
declare
  v_role text;
begin
  select role into v_role from public.profiles where id = auth.uid();
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

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Staff can view all profiles" on public.profiles;
create policy "Staff can view all profiles" on public.profiles for select using (public.is_staff());

drop policy if exists "Users can update own profile data" on public.profiles;
create policy "Users can update own profile data" on public.profiles for update using (auth.uid() = id)
with check (
  auth.uid() = id and (
    role = (select p.role from public.profiles p where p.id = auth.uid()) or public.is_admin()
  )
);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile" on public.profiles for update using (public.is_admin());

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  title text not null,
  collection text not null check (collection in ('men', 'women', 'kids')),
  category text not null,
  category_label text not null,
  price_pkr integer not null check (price_pkr > 0),
  compare_at_price_pkr integer,
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

alter table public.products enable row level security;
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products" on public.products for select using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update using (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete using (public.is_admin());

-- 3. ORDERS TABLE
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid default gen_random_uuid() not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_city text not null,
  customer_address text not null,
  postal_code text,
  delivery_notes text,
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  shipping_fee_pkr integer not null default 0 check (shipping_fee_pkr >= 0),
  discount_pkr integer not null default 0 check (discount_pkr >= 0),
  total_pkr integer not null check (total_pkr >= 0),
  payment_method text not null check (payment_method in ('cod', 'card_demo', 'bank_transfer')),
  status text not null default 'pending_verification' check (status in ('pending_verification', 'packed', 'dispatched', 'delivered', 'cancelled')),
  is_demo boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Staff can view all orders" on public.orders;
create policy "Staff can view all orders" on public.orders for select using (public.is_staff());

drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders" on public.orders for update using (public.is_staff());

-- 4. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) not null,
  product_title text not null,
  selected_size text not null,
  selected_color text not null,
  quantity integer not null check (quantity > 0 and quantity <= 50),
  unit_price_pkr integer not null check (unit_price_pkr > 0),
  total_price_pkr integer not null check (total_price_pkr > 0)
);

alter table public.order_items enable row level security;
drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items" on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and ((auth.uid() is not null and o.user_id = auth.uid()) or public.is_staff())
  )
);
`;
