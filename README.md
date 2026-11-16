# NEXORA GAMES

Premium gaming storefront — Full Stack portfolio foundation.

## Included in this first implementation

- Original responsive dark premium storefront
- Fictional game catalog, platform/genre filters, search, sorting
- Cart with quantity controls (maximum five per item)
- Server-side price calculation and item validation
- Stripe Checkout **test mode only** (BRL)
- Success page with explicit sandbox disclaimer
- Supabase PostgreSQL schema with row-level security foundations

**Not yet implemented:** actual user sign-up/login screens, persisted carts/orders, verified payment webhooks, key allocation, international currency checkout, admin dashboard, email, actual fulfillment and licensed catalog integration. These are future phases, not currently working features.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The storefront and cart work without API keys. Checkout requires a Stripe **test** secret key in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never use live payment keys for this demo. Never commit `.env.local`. Stripe-hosted checkout supports payment methods enabled for the test account and region; not every payment method is automatically available.

## Database foundation

Run `supabase/schema.sql` in your Supabase project SQL editor. Tables and RLS policies are a foundation only; the UI does not yet connect to these tables. Do not store plaintext game keys; `encrypted_key` requires application-layer encryption and secure key management before real usage.

## Roadmap

1. Supabase Auth, account pages and profiles
2. Persistent cart, inventory and server-side orders
3. Stripe webhook signature verification, idempotency and durable payment state
4. Secure fictional key allocation, delivery library and emails
5. Admin RBAC, audit logs, refund workflow and tests
6. Internationalization, country-specific currencies and payment methods
7. Licensed product feeds and approved distribution partners for any commercial launch

## Licensing

All games and cover art in this demo are fictional, and the current artwork is CSS-generated. No third-party game logos or copyrighted cover images are redistributed.
