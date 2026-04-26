# Portfolio Generator

AI-powered portfolio builder with Stripe billing and Supabase auth.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database/Auth:** Supabase
- **Payments:** Stripe
- **Deployment:** Vercel

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd portgen
pnpm install
```

### 2. Environment variables

Copy `.env.production.example` to `.env.local` and fill in your values:

```bash
cp .env.production.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_live_...`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Production app URL (e.g. `https://portgen.vercel.app`) |

### 3. Database setup (Supabase)

Run migrations in order in the [Supabase SQL Editor](https://supabase.com/dashboard):

1. `supabase/migrations/001_initial_schema.sql` — profiles, auth trigger, subscriptions, helper functions
2. `supabase/migrations/002_portfolios_table.sql` — portfolios table + RLS

### 4. Stripe setup

1. Create a Stripe account and get your API keys
2. Go to **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Vercel deployment

```bash
pnpm vercel --prod
```

Or connect your GitHub repo to Vercel and set environment variables in the dashboard under **Settings → Environment Variables**.

Required environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL` = `https://your-vercel-subdomain.vercel.app` (or custom domain)

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Local dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run linter |
| `pnpm test` | Run tests (Vitest) |
