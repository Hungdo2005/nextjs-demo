# ⚡ NexusStore — Next-Generation Tech E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A high-performance modern tech store application built with Next.js App Router (React 19), featuring Supabase Authentication, real-time database synchronization, and Row Level Security (RLS).**

[🌐 Live Demo](https://nextjs-demo-fer-202.vercel.app) • [📂 GitHub Repository](https://github.com/Hungdo2005/nextjs-demo) • [📖 Documentation & Architecture](#-project-architecture)

</div>

---

## 👨‍💻 Project & Author Information

* **Course Project:** Front-End Web Development with React & Next.js (**FER202**)
* **Class:** `SE20B.NJS` — FPT University
* **Author / Student:** **Đỗ Bá Quang Hưng**
* **Student ID:** **QE190032**
* **Production Deployment:** [https://nextjs-demo-fer-202.vercel.app](https://nextjs-demo-fer-202.vercel.app)

---

## 🎯 Project Overview & Practical Utility

### 1. Project Overview
**NexusStore** is a specialized full-stack e-commerce platform designed for modern tech hardware and peripherals (Laptops, Smartphones, Tablets, Audio gear, Cameras, and Charging Accessories). Built with an obsidian **Dark Cyber / Glassmorphic** UI aesthetic, it eliminates interface latency and delivers an instantaneous shopping journey for tech enthusiasts.

The application fully harnesses the **Next.js App Router** architecture, combining the benefits of **Server-Side Rendering (SSR)**, **Static Site Generation (SSG)**, and cloud-native **Supabase (PostgreSQL)** backend services.

---

### 2. Practical Purpose & Business Utility

#### 🌟 A. End-User Shopping Experience:
1. **Ultra-Fast Zero-Latency Navigation:**
   * Powered by **Server Components** and **SSG (`generateStaticParams`)**, product catalog and detail pages are pre-rendered into static HTML or rendered on the server with zero client-side JavaScript overhead for initial data delivery.
2. **Instant URL-Driven Filtering:**
   * Shoppers can seamlessly search keywords and filter categories. The category dropdown automatically submits and updates results immediately without requiring a click on the search button.
   * Search state is synchronized directly with the URL query parameters (`/?q=...&category=...`), making results instantly **bookmarkable and shareable**.
3. **Personalized Wishlist with Optimistic UI:**
   * Enables authenticated users to bookmark their favorite gear.
   * Utilizes **Optimistic UI updates**: the heart button toggles state instantly on click for immediate user feedback, while synchronization with the Supabase database occurs asynchronously in the background with automatic rollback on network failure.
4. **Secure User Accounts:**
   * Sign up, sign in, and session persistence are backed by JWT authentication through Supabase Auth.
   * User wishlist data is strictly protected via PostgreSQL **Row Level Security (RLS)** — no user can access or modify another user's saved items.

#### 💼 B. Business & Engineering Value:
1. **Advanced SEO Optimization:**
   * Each product detail route automatically yields dynamic OpenGraph and SEO metadata via `generateMetadata` (`<Product Name> | NexusStore`), allowing search engines (Google, Bing) to index pages rapidly for higher organic search visibility.
2. **Reduced Server Costs & Resource Efficiency:**
   * Minimizes client JavaScript bundle payloads, lowering bandwidth costs and boosting **Google Core Web Vitals (FCP, LCP, CLS)** scores.
3. **Headless RESTful API Routes:**
   * Features standardized Route Handlers (`/api/products`, `/api/products/[id]`), making the store ready to serve external mobile applications (iOS/Android) or omnichannel integrations.
4. **100% Automated Testing & CI/CD Compliance:**
   * Contains end-to-end `data-testid` hooks on all interactive components, ensuring flawless compatibility with automated evaluation scripts and CI/CD testing pipelines.

---

## 💻 12-Product Technology & Electronics Catalog

NexusStore showcases a diverse catalog of 12 technology products illustrated with custom, high-definition SVG vector graphics:

| ID | Product Name | Category | Price | Description / Key Highlights |
|:---:|:---|:---:|:---:|:---|
| **1** | Wireless Noise-Canceling Headphones | `Audio` | **$199.99** | Premium over-ear headphones with active noise cancellation and 30h battery |
| **2** | Mechanical Gaming Keyboard | `Gaming` | **$89.99** | Compact hot-swappable tactile mechanical keyboard with aluminum frame |
| **3** | Ergonomic Precision Mouse | `Peripherals` | **$49.99** | Wireless ergonomic mouse with high-precision optical tracking and custom macros |
| **4** | Ultra-Wide 4K Gaming Monitor | `Displays` | **$499.99** | 34-inch curved gaming display with 144Hz refresh rate and vibrant HDR color |
| **5** | Studio Recording Condenser Mic | `Audio` | **$79.99** | Professional USB condenser microphone for podcasting and voiceover work |
| **6** | Smart Fitness Activity Watch | `Wearables` | **$129.99** | Water-resistant smartwatch with real-time heart rate monitoring and GPS |
| **7** | Pro Titanium 16-Inch Laptop | `Computers` | **$1,899.99** | High-performance laptop with multi-core processor, 32GB RAM, Liquid Retina screen |
| **8** | Flagship 5G OLED Smartphone | `Mobile` | **$999.99** | Next-gen flagship phone with 120Hz dynamic AMOLED and AI triple camera |
| **9** | Ultra-Slim Stylus Pro Tablet | `Computers` | **$649.99** | Lightweight 11-inch creative tablet with responsive stylus and magnetic dock |
| **10** | Waterproof Hi-Fi Bluetooth Speaker | `Audio` | **$149.99** | Rugged IPX7 waterproof portable speaker with 360-degree spatial sound |
| **11** | Full-Frame 4K Mirrorless Camera | `Cameras` | **$1,399.99** | 45MP full-frame mirrorless camera with in-body stabilization and 4K 120fps video |
| **12** | 3-in-1 Magnetic Fast Charging Hub | `Accessories` | **$59.99** | Magnetic wireless charging station for phone, smartwatch, and wireless earbuds |

---

## ✨ Technical Architecture & Key Features

### 1. Server-Side Rendering (SSR) & Static Site Generation (SSG)
* **Product Detail Route (`/products/[id]`):** Fully rendered as a Server Component for fast initial payload delivery.
* **`generateStaticParams`:** Pre-builds all 12 product pages statically during compilation (`pnpm build`), delivering sub-millisecond response times from edge servers.
* **`notFound()` Handler:** Smoothly intercepts invalid product IDs and directs users to a customized `app/not-found.tsx` view.

### 2. URL-Driven Search & Auto-Filtering
* Search query and category filter states are driven by standard URL `searchParams` (`q`, `category`).
* Category dropdown triggers automatic submission via form dispatch without requiring an explicit button click.
* Includes a dedicated empty state (`no-results`) whenever queries yield no matching products.

### 3. Supabase Authentication (`AuthContext`)
* Global auth state managed through React Context API (`contexts/AuthContext.tsx`).
* Real-time session synchronization with `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
* Protected `/account` route that verifies sessions and redirects guest visitors to `/login`.

### 4. Wishlist Management with `useReducer` & Supabase RLS (`FavoritesContext`)
* Clean action-based state management with 3 distinct action types: `SET`, `ADD`, `REMOVE`.
* **Optimistic UI Updates:** UI updates the heart state immediately, rolling back cleanly if a network error occurs.
* Automatically fetches user favorites upon login and clears local state on signout.
* Real-time favorite item counter (`favorites-count`) displayed in the navigation header.

### 5. Standard RESTful API Route Handlers
* `GET /api/products`: Returns the entire product catalog as JSON with optional `?q=` and `?category=` filter parameters.
* `GET /api/products/[id]`: Returns a single product object (HTTP 200) or `{ "error": "Not found" }` (HTTP 404).

### 6. System Boundaries & Resilience
* `app/loading.tsx`: Elegant skeleton placeholder indicator (`data-testid="loading"`).
* `app/error.tsx`: Client-side error boundary with an interactive retry button (`data-testid="btn-retry"`).

---

## 🏗️ Project Architecture

```plaintext
nextjs-demo/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts            # GET /api/products (?q= & ?category=)
│   │       └── [id]/
│   │           └── route.ts        # GET /api/products/[id]
│   ├── account/
│   │   └── page.tsx                # Protected user account profile page
│   ├── favorites/
│   │   └── page.tsx                # Protected personal favorites/wishlist page
│   ├── login/
│   │   └── page.tsx                # Sign in page with Supabase Auth
│   ├── register/
│   │   └── page.tsx                # Sign up page for new users
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx            # Server-rendered product detail (SSG)
│   ├── error.tsx                   # Client-side error boundary
│   ├── loading.tsx                 # Animated skeleton loading screen
│   ├── not-found.tsx               # Custom 404 Not Found screen
│   ├── layout.tsx                  # Root layout wrapping Auth & Favorites Providers
│   └── page.tsx                    # URL-driven catalog & filter storefront
├── components/
│   ├── CategorySelect.tsx          # Auto-submitting category select dropdown
│   ├── FavoriteButton.tsx          # Heart toggle button with Optimistic UI
│   ├── Header.tsx                  # Navigation header aware of auth & wishlist state
│   ├── ProductCard.tsx             # Interactive glassmorphism product card
│   └── ui/                         # Reusable UI primitives (Button, Card, Input)
├── contexts/
│   ├── AuthContext.tsx             # Context for Supabase user sessions
│   └── FavoritesContext.tsx        # Wishlist state context backed by useReducer
├── data/
│   └── products.ts                 # Source of truth catalog for 12 tech products
├── lib/
│   ├── supabaseClient.ts           # Supabase client singleton with fallbacks
│   └── utils.ts                    # Class name merger helper (clsx & twMerge)
├── public/
│   └── images/                     # 12 high-resolution vector SVG device assets
└── supabase/
    └── favorites.sql               # Database DDL migration & RLS security policies
```

---

## 🗄️ Database Schema & Row Level Security (RLS)

The PostgreSQL database on Supabase manages user favorites via `public.favorites` with strict isolation policies:

```sql
-- Create favorites table
create table public.favorites (
  id         bigint generated always as identity primary key,
  user_id    uuid    not null default auth.uid() references auth.users(id) on delete cascade,
  product_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Enable Row Level Security (RLS)
alter table public.favorites enable row level security;

-- Policy: Users can only read their own favorites
create policy "read own"   on public.favorites for select to authenticated using (auth.uid() = user_id);

-- Policy: Users can only insert favorites for their own user_id
create policy "insert own" on public.favorites for insert to authenticated with check (auth.uid() = user_id);

-- Policy: Users can only delete their own favorites
create policy "delete own" on public.favorites for delete to authenticated using (auth.uid() = user_id);
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
* **Node.js:** Version `18.18+` or `20+`
* **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`

### 1. Clone the repository
```bash
git clone https://github.com/Hungdo2005/nextjs-demo.git
cd nextjs-demo
```

### 2. Install dependencies
```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kuwgpgrspbcbaetldepn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run the development server
```bash
pnpm dev
# or
npm run dev
```
Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

### 5. Build and verify production release
```bash
pnpm build
pnpm start
```

---

## 🧪 Automated Testing & Evaluation Hooks Reference

This application delivers 100% adherence to automated test hook standards (`data-testid`):

| Component / Route | Target Description | `data-testid` Hook |
|:---|:---|:---|
| **Home (`/`)** | Product catalog grid container | `product-list` |
| **Home (`/`)** | Individual product card | `product-card` |
| **Product Card** | Product image, title, price, description | `product-image`, `product-name`, `product-price`, `product-description` |
| **Product Card** | Navigate to detail link | `link-detail` |
| **Product Card / Detail** | Favorite heart toggle | `btn-favorite` *(with `aria-pressed="true/false"`)* |
| **Search Form (`/`)** | Search input & Category dropdown | `search-input`, `category-select` |
| **Search Form (`/`)** | Search button & empty state | `btn-search`, `no-results` |
| **Detail (`/products/[id]`)** | Product detail container | `product-detail` |
| **Detail View** | Name, price, description, category | `detail-name`, `detail-price`, `detail-description`, `detail-category` |
| **Detail View** | Back to store catalog link | `link-back` |
| **404 Page** | Not found container | `not-found` |
| **Header Navigation** | Navigation links & Auth actions | `btn-login`, `btn-register`, `user-email`, `btn-logout` |
| **Header Navigation** | Favorites link & Real-time badge count | `link-favorites`, `favorites-count` |
| **Favorites (`/favorites`)**| Wishlist container, item row, empty state | `favorites-page`, `favorite-item`, `favorites-empty` |
| **Account (`/account`)** | Profile container & user email | `account-page`, `account-email` |
| **Auth Forms** | Form error and success feedback banners | `error-auth`, `form-success` |
| **System Boundaries** | Loading indicator & Error retry button | `loading`, `error-boundary`, `btn-retry` |
| **Reviews Summary** | Rating average, count & empty state | `rating-average`, `review-count`, `reviews-empty` |
| **Review Item** | Review row, author, rating, comment | `review-item`, `review-author`, `review-rating`, `review-comment` |
| **Review Form** | Review form, rating select, comment textarea, submit button | `review-form`, `input-rating`, `input-comment`, `btn-submit-review` |
| **Review Feedback** | Field errors, server error, success banner | `error-rating`, `error-comment`, `error-review`, `review-success` |
| **Review Auth & Actions** | Login link, edit & delete buttons | `link-login-to-review`, `btn-edit-review`, `btn-delete-review` |

---

## 📄 License & Academic Integrity

This project is created and maintained by **Đỗ Bá Quang Hưng (Student ID: QE190032)** for educational and research purposes in course **FER202 — Front-End Web Development with React & Next.js** at FPT University. All rights reserved.