# Setup Guide

Complete guide to setting up Drinkly for local development.

---

## Prerequisites

| Software | Minimum Version | Check Command |
|----------|-----------------|---------------|
| Node.js | 18.17+ | `node -v` |
| npm | 9.0+ | `npm -v` |
| PostgreSQL | 14+ | `psql --version` |
| Git | 2.0+ | `git --version` |

Optional:
- Docker (for containerized setup)
- pnpm or yarn (alternative package managers)

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-org/drinkly.git
cd drinkly
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Prisma, NextAuth, and UI dependencies.

---

## 3. Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/drinkly` |
| `AUTH_SECRET` | Secret for NextAuth JWT signing. Generate with `npx auth secret` | `your-random-secret-here` |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` |

### Payment (Stripe)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret API key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe dashboard |

### File Storage (AWS S3)

| Variable | Description |
|----------|-------------|
| `AWS_S3_BUCKET` | S3 bucket name for file uploads |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |

### SMS (Twilio)

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number for sending SMS |

### Email (Resend)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender email address |

### Maps (Google Maps)

| Variable | Description |
|----------|-------------|
| `GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |

---

## 4. Database Setup

### Option A: Local PostgreSQL

1. Create a database:

```sql
CREATE DATABASE drinkly;
```

2. Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
```

### Option B: Docker PostgreSQL

```bash
docker run -d --name drinkly-db \
  -e POSTGRES_USER=drinkly \
  -e POSTGRES_PASSWORD=drinkly \
  -e POSTGRES_DB=drinkly \
  -p 5432:5432 \
  postgres:16-alpine
```

Then set `DATABASE_URL=postgresql://drinkly:drinkly@localhost:5432/drinkly` in `.env.local`.

### Using Migrations (Recommended for Teams)

```bash
npx prisma migrate dev --name init
```

---

## 5. Seed the Database

```bash
npx prisma db seed
```

This creates:
- Admin user (`admin@drinkly.com` / `admin123`)
- Retailer user (`retailer@drinkly.com` / `retailer123`)
- Customer user (`customer@drinkly.com` / `customer123`)
- Sample categories, products, and stores

---

## 6. Start Development Server

```bash
npm run dev
```

The application runs at [http://localhost:3000](http://localhost:3000).

---

## 7. Stripe Webhooks (for payment testing)

Install the Stripe CLI and forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret output by the CLI to `STRIPE_WEBHOOK_SECRET`.

---

## Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Run linting
npm run typecheck     # Run type checking
```

---

## Common Issues

### Prisma Generate Fails

```bash
npx prisma generate
# If it fails, delete node_modules and reinstall
rm -rf node_modules
npm install
npx prisma generate
```

### Database Connection Refused

1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
3. Ensure the database exists

### Port 3000 Already in Use

```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### NextAuth Configuration Error

Ensure `AUTH_SECRET` and `NEXTAUTH_URL` are set in `.env.local`. Generate a secret:

```bash
npx auth secret
```

### Type Errors After Pulling

```bash
npx prisma generate
npx next build
```

### Stripe Webhook Not Receiving Events

1. Ensure Stripe CLI is running and listening
2. Verify `STRIPE_WEBHOOK_SECRET` matches the CLI output
3. Check webhook endpoint URL in Stripe dashboard

---

## Docker Setup (Alternative)

Start the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This starts:
- The Next.js app on port 3000
- PostgreSQL on port 5432

To rebuild after changes:

```bash
docker-compose up -d --build
```

To stop:

```bash
docker-compose down
```

---

## IDE Setup

### VS Code

Install recommended extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense

Enable format on save in settings.
