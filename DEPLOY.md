# Deploy to Vercel

## Prerequisites

- [Vercel account](https://vercel.com) connected to your GitHub
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)
- [Stripe account](https://stripe.com) for payments (optional)

---

## 1. Environment Variables

Set these in **Vercel dashboard → Settings → Environment Variables**:

| Name | Value | Notes |
|---|---|---|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | _(generate)_ | Run: `openssl rand -base64 32` |
| `MONGODB_URI` | _(see below)_ | MongoDB Atlas connection string |
| `STRIPE_SECRET_KEY` | `sk_live_...` | From Stripe dashboard (optional) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | From Stripe dashboard (optional) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe webhook setup (optional) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Same as NEXTAUTH_URL |

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user: **Settings → Database Access → Add New User**
   - Auth method: Password
   - Username: `portgen`
   - Password: _(use a strong password)_
   - Database Privileges: `readWrite`
3. Network access: **Settings → Network Access → Add IP Address**
   - Add `0.0.0.0/0` (allow all) or add Vercel's IP ranges
4. Get your connection string:
   - **Deployment → Database → Connect → Connect your application**
   - Driver: **Node.js**
   - Format: `mongodb+srv://<user>:<password>@<cluster>/portgen?appName=DCS`

---

## 2. Import to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo (`portgen`)
3. Framework: **Next.js** (detected automatically)
4. Root directory: `./` (default)
5. Build command: `npm run build` (default)
6. Environment Variables: paste from `.env.production.example` or add manually
7. Click **Deploy**

### Option B: Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 3. Configure Stripe Webhook (if using payments)

1. In Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Signing Secret** (`whsec_...`) → set as `STRIPE_WEBHOOK_SECRET` env var in Vercel

---

## 4. Post-Deploy Checks

- [ ] App loads at `https://your-app.vercel.app`
- [ ] Authentication (login/logout) works
- [ ] Database connection: create/view a portfolio
- [ ] Stripe checkout (if enabled): test with Stripe's test cards
  - Success: `4242 4242 4242 4242` — any future expiry, any CVC
  - Fail: `4000 0000 0000 0002`
- [ ] Check Vercel deployment logs for any runtime errors

---

## Troubleshooting

### 500 Error on first load
Check that `NEXTAUTH_URL` matches your Vercel deployment URL exactly (no trailing slash).

### MongoDB connection failed
- Verify `MONGODB_URI` is correct
- Check Atlas Network Access allows your IP (or `0.0.0.0/0`)
- Ensure database user password doesn't contain special chars (URL-encode if needed)

### Next.js version conflicts
Check `package.json` engines field matches your local Node version. Vercel uses Node 18.x by default.
