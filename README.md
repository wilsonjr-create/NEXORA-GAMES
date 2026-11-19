# 🎮 NEXORA GAMES

### Full-Stack Gaming E-Commerce Platform

NEXORA GAMES is a modern gaming storefront developed as a full-stack portfolio project.

Built with Next.js, React, TypeScript, Supabase, and Stripe, the application demonstrates e-commerce architecture, authentication, payment integration, and database-backed purchase history.

> **Portfolio demonstration only.** All prices are illustrative. Payments use Stripe test mode. No real purchases or game keys are delivered.

## ✨ Features

### Gaming Storefront
- Responsive dark-themed interface
- Game catalog with platform and genre filters
- Search and sorting functionality
- Individual game pages
- Shopping cart with quantity controls
- Server-side checkout price validation

### Authentication
- Supabase authentication
- User account dashboard
- Authenticated account access

### Payments & Orders
- Stripe Checkout integration in test mode
- Server-side checkout endpoint
- Stripe webhook endpoint
- Purchase history displayed in the account dashboard
- Payment status tracking

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Payments | Stripe Checkout |
| Icons | Lucide React, React Icons |
| Version Control | Git, GitHub |
| Deployment | Vercel (planned) |

## 📸 Screenshots

Screenshots of the storefront, game catalog, checkout flow, and account dashboard will be added to this section.

## 🏗 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   └── webhooks/stripe/
│   ├── auth/callback/
│   ├── jogo/[id]/
│   ├── login/
│   ├── minha-conta/
│   └── success/
├── components/
├── contexts/
└── lib/

supabase/
└── schema.sql
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Supabase project
- Stripe test account

### Installation

```bash
git clone https://github.com/wilsonjr-create/NEXORA-GAMES.git
cd NEXORA-GAMES
npm install
cp .env.example .env.local
```

Configure the required environment variables in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit credentials or `.env.local` to version control.

### Development

```bash
npm run dev
```

Open http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
```

## 🔐 Security

The project includes authentication, database access controls, and server-side checkout handling.

Payment processing is restricted to Stripe test mode.

Production deployment requires appropriate environment configuration, secure credential management, and validation of the complete payment flow.

## 🗺 Roadmap

- [x] Responsive gaming storefront
- [x] Game catalog and filtering
- [x] Shopping cart
- [x] Supabase authentication
- [x] User account dashboard
- [x] Stripe test checkout integration
- [x] Purchase history
- [ ] Automated game-key allocation and delivery
- [ ] Administrative inventory dashboard
- [ ] Transactional email notifications
- [ ] Production-ready commercial integrations

## ⚠️ Disclaimer

NEXORA GAMES is an independent educational and portfolio project.

It is not affiliated with or endorsed by game publishers, storefronts, or platform owners. Game names and imagery belong to their respective rights holders.

The application does not sell or distribute real game activation keys.

## 👨‍💻 Developer

**Wilson Jr — Full-Stack Developer**

GitHub: https://github.com/wilsonjr-create

---

Built with Next.js, TypeScript, Supabase, and Stripe.
