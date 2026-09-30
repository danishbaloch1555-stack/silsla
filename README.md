# RIVA Streetwear | Official E-Commerce Storefront

> **SLOGAN: MADE TO STAND OUT**  
> Premium Pakistani Streetwear brand with international ambitions. Heavyweight cotton essentials for Men, Women and Kids. Designed in Pakistan, crafted for the world.

---

## 🏛️ Brand Aesthetic & Palette
- **Palette**: Monochromatic luxury — Onyx Black (`#0A0A0C`), Washed Charcoal (`#1A1A1E`), Bone Beige (`#E8E4DB`), Raw Ecru (`#F5F2EB`).
- **Typography**: Architectural Display (`Syne`), Editorial Body (`Plus Jakarta Sans`), Tabular Numerals (`Space Grotesk`).
- **Textiles**: 300 to 460 GSM custom-milled loopback French terry and dense combed cotton. Cut & sewn in Lahore and Faisalabad.

---

## 🚀 Pages & Features Built

1. **Home**: Cinematic editorial fashion hero, 3 curated collection gateways (Men, Women, Kids), sample product showcase, brand manifesto, value propositions, newsletter subscription, and responsive footer.
2. **Men Collection**: Architectural drop-shoulder hoodies, 300 GSM oversized tees, raw seam relaxed tees, utility fleece joggers, wide-leg raw bottoms, matching fleece sets, and heavy canvas totes.
3. **Women Collection**: Boxy cropped tees, contemporary asymmetric tops, cocoon hoodies, modest floor-length kimono dusters, high-waist cargo trousers, and two-piece sweat sets.
4. **Kids Collection**: Scaled-down street staples with age-appropriate neck safety (zero choking drawcords), reinforced knees, and soft organic cotton (Ages 4-14Y).
5. **New Arrivals & Shop All**: Complete catalog with live multi-criteria filtering (Category, Price range, Sizes, Colours) and real-time sorting.
6. **Product Detail Page (PDP)**: Contiguous purchase module with multi-angle gallery, color swatches, size selector, interactive Size & Fit Guide (cm/inches), GSM and textile breakdown accordion, garment care instructions, and instant bag feedback.
7. **Persistent Bag / Cart Drawer**: Dynamic free shipping progress meter (Free shipping over PKR 7,500 across Pakistan), quantity steppers, promo code test (`STANDOUT10`), subtotal/total calculations.
8. **Cash on Delivery (COD) Checkout**: Form validation for Pakistan mobile/WhatsApp (`0300...` or `+92...`), city selector, street address, and delivery instructions. Marked clearly with **DEMO** notices.
9. **Admin Dashboard (Protected)**:
   - Hidden from public storefront with zero public links or buttons
   - Direct operator access via URL `/#admin` or keyboard shortcut `Ctrl+Shift+A` (`Cmd+Shift+A`)
   - Cryptographic SHA-256 verification with brute-force rate-limiting and temporary lockout
   - Inventory & stock controls (+ / - quick buttons)
   - Add new product & edit existing product modal
   - Order pipeline with status workflow (`Pending Verification` -> `Packed` -> `Dispatched` -> `Delivered`)
   - Supabase Architecture & SQL Migration viewer with 1-click copy
   - Free deployment guides for Vercel, Netlify, Cloudflare Pages, and GitHub Pages
10. **Information & Policy Pages**: About, Contact & Showrooms, Shipping & Delivery (TCS/Trax/DHL), 14-Day Returns & Doorstep Exchanges, Privacy Policy, Terms of Service. All with editable placeholders.

---

## 🔍 Real vs. Demo Audit

| Subsystem | State | Live Mechanism | Production Next Step |
| :--- | :--- | :--- | :--- |
| **Catalog Browsing & Filters** | **REAL** | Reactive filtering pipeline & state | Connect to Supabase REST / GraphQL |
| **Persistent Cart** | **REAL** | Browser `localStorage` (v1) | Keep in localStorage or sync to user profile |
| **Product & Stock Editor** | **REAL** | In-memory + `localStorage` persistence | Saved directly to Supabase `products` table |
| **Cash on Delivery (COD)** | **DEMO** | Records order in local browser + Admin | Connect courier webhook (Trax, TCS, Call Courier) |
| **Online Card Gateway** | **DEMO** | Simulated checkout gateway | Connect Safepay PK, PayFast, or Stripe |
| **Supabase PostgreSQL & Auth** | **PREPARED** | `supabase-schema.sql` with RLS & Triggers | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` |

---

## 🗄️ Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase-schema.sql` in this repo, copy the contents, and run it.
   - Creates `profiles`, `products`, `orders`, and `order_items` tables.
   - Applies Row Level Security (RLS) policies.
   - Installs server-side trigger `trigger_deduct_stock_on_order_item` to automatically deduct product stock when orders are confirmed.
4. In your `.env` or hosting provider settings:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 🌐 Free Deployment Instructions

### Option 1: Vercel (Recommended)
1. Push this project to GitHub.
2. Visit [vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your repository. Framework preset will auto-detect **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Option 2: Netlify
1. Log in to [netlify.com](https://netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy Site**.

### Option 3: Cloudflare Pages
1. In Cloudflare dashboard, navigate to **Compute (Workers & Pages)** > **Create application** > **Pages**.
2. Connect your Git repository.
3. Build preset: **Vite**. Output: `dist`.
4. Click **Save and Deploy**.
