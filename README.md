# GlamShot

GlamShot is a full-stack ecommerce storefront built with Next.js, TypeScript, Tailwind CSS, and Supabase. Customers can browse the live catalog, view product details, manage a cart, complete checkout, and see an order confirmation. Store admins can manage products and review orders, customers, and analytics.

## Features

- Responsive storefront with light and dark themes
- Product catalog and product detail pages
- Cart, checkout, order confirmation, and order email handoff
- Supabase-backed products and orders
- Supabase Auth email/password login for admin access
- Admin dashboard with product management, orders, customers, and analytics
- TypeScript and ESLint validation

## Requirements

- Node.js 20 or newer
- A Supabase project with the migrations in `supabase/migrations` applied

## Local setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create `.env.local` with the existing Supabase project values and admin allowlist:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAILS=admin@example.com,ops@example.com
```

`ADMIN_EMAIL` may be used instead of `ADMIN_EMAILS` for a single admin account. Keep service-role credentials server-only and never expose them through `NEXT_PUBLIC_*` variables.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/` | App Router pages and API route handlers |
| `components/` | Storefront, cart, product, auth, layout, and admin UI |
| `lib/` | Supabase clients, auth helpers, services, and pricing utilities |
| `types/` | Shared TypeScript types |
| `supabase/migrations/` | Products and orders schema migrations |
| `public/images/` | Fallback product artwork and static assets |

## Useful commands

```bash
npm run dev      # development server
npm run lint     # ESLint
npm run build    # production build
npm run start    # serve the production build
```

## Deployment

Build the application with `npm run build`, then run it with `npm run start` or deploy it to a Next.js-compatible host. Configure the same environment variables in the deployment environment and apply the Supabase migrations before serving customer traffic.
