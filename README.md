# Drinkly — Order Responsibly. Delivered Legally.

> A full-stack alcohol delivery platform with built-in compliance, age verification, and retailer management.

Drinkly is a modern e-commerce platform specializing in alcohol delivery. It enforces legal compliance across jurisdictions, verifies age and retailer licenses, manages delivery restrictions, and provides a seamless ordering experience for customers while ensuring responsible alcohol distribution.

---

## Features

- **Age Verification** — Mandatory age gating at registration and checkout
- **Compliance Engine** — Jurisdiction-based rules for dry days, operating hours, and delivery restrictions
- **Retailer Management** — License verification, onboarding, and store management
- **Product Catalog** — Category management, inventory tracking, and search
- **Shopping Cart & Checkout** — Full cart flow with address validation
- **Payment Processing** — Stripe integration for secure payments
- **Order Management** — Real-time order tracking and status updates
- **Delivery Integration** — Distance calculation and delivery slot management
- **Admin Dashboard** — Analytics, user management, and compliance monitoring
- **Role-Based Access** — Customer, Retailer, Delivery, and Admin roles
- **Notification System** — Email, SMS, and push notifications
- **Audit Logging** — Complete trail of compliance-relevant actions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Validation | Zod |
| Payments | Stripe |
| Storage | AWS S3 |
| SMS | Twilio |
| Email | Resend |
| Maps | Google Maps API |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Deployment | Vercel / Docker |

---

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL 14 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/your-org/drinkly.git
cd drinkly
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your values (see SETUP.md for full reference)
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@drinkly.com | admin123 |
| Retailer | retailer@drinkly.com | retailer123 |
| Customer | customer@drinkly.com | customer123 |

> These accounts are created by the seed script. Do not use in production.

---

## Project Structure

```
drinkly/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard pages
│   ├── (shop)/             # Customer-facing shop pages
│   ├── admin/              # Admin panel
│   ├── api/                # API route handlers
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
├── lib/                    # Utilities, configurations, helpers
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── stripe.ts           # Stripe client
│   ├── compliance/         # Compliance engine
│   └── validations/        # Zod schemas
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Seed script
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # Production Docker image
└── package.json
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth secret for JWT signing |
| `NEXTAUTH_URL` | Yes | Application base URL |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `AWS_S3_BUCKET` | Yes | S3 bucket for file uploads |
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Yes | Twilio sender phone number |
| `RESEND_API_KEY` | Yes | Resend API key for emails |
| `GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key |

See [SETUP.md](./SETUP.md) for the full environment variable reference.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited. See [LICENSE](./LICENSE) for details.
