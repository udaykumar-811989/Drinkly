# Deployment Guide

---

## Deployment Options

| Method | Best For | Complexity |
|--------|----------|------------|
| Vercel | Quick deployment, automatic scaling | Low |
| Docker | Self-hosted, full control | Medium |
| Self-hosted | On-premises, custom infrastructure | High |

---

## 1. Vercel Deployment

### Prerequisites

- Vercel account
- GitHub repository connected
- PostgreSQL database (Vercel Postgres, Supabase, Neon, or AWS RDS)

### Steps

1. **Push code to GitHub**

2. **Import project in Vercel**
   - Go to vercel.com/new
   - Select your repository
   - Framework preset: Next.js

3. **Configure environment variables**
   - Add all required variables (see Environment Variables section)
   - Use Vercel's encrypted environment variables

4. **Deploy**
   - Vercel auto-deploys on push to main
   - Preview deployments for pull requests

5. **Custom domain**
   - Add domain in Vercel project settings
   - Configure DNS records as instructed
   - SSL certificate auto-provisioned

### Vercel-Specific Configuration

```json
// vercel.json (optional overrides)
{
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/cron/compliance-check",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 2. Docker Deployment

### docker-compose.yml

See `docker-compose.yml` at project root for the complete configuration.

### Build and Run

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build --force-recreate
```

### Production Docker Setup

For production, use a dedicated PostgreSQL instance instead of the containerized database:

1. Set up managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
2. Update `DATABASE_URL` in environment
3. Remove the `db` service from compose
4. Use a reverse proxy (nginx, Traefik) for SSL

### Dockerfile Explanation

The multi-stage Dockerfile:

1. **base** — Node.js 20 Alpine image
2. **deps** — Install production dependencies only
3. **builder** — Build the Next.js application
4. **runner** — Minimal production image with only build artifacts

Benefits:
- Small final image size (~150MB)
- No dev dependencies in production
- Runs as non-root user (nextjs)
- Optimized for Next.js standalone output

---

## 3. Self-Hosted Deployment

### Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 2GB | 4GB |
| Storage | 20GB | 50GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 LTS |

### Installation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and build
git clone https://github.com/your-org/drinkly.git
cd drinkly
npm install
npx prisma generate
npm run build

# Start with PM2
pm2 start npm --name "drinkly" -- start
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/drinkly?sslmode=require` |
| `AUTH_SECRET` | NextAuth secret | Random 32+ character string |
| `NEXTAUTH_URL` | Application URL | `https://your-domain.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `AWS_S3_BUCKET` | S3 bucket name | `drinkly-uploads` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Secret |
| `TWILIO_ACCOUNT_SID` | Twilio SID | `AC...` |
| `Twilio_AUTH_TOKEN` | Twilio auth token | Secret |
| `TWILIO_PHONE_NUMBER` | Twilio number | `+1234567890` |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `EMAIL_FROM` | Sender email | `noreply@your-domain.com` |
| `GOOGLE_MAPS_API_KEY` | Google Maps key | `AIza...` |

---

## Database Setup for Production

### Managed PostgreSQL Options

| Provider | Free Tier | Recommended Plan |
|----------|-----------|------------------|
| Supabase | 500MB free | Pro ($25/mo) |
| Neon | 512MB free | Launch ($19/mo) |
| Vercel Postgres | 5GB free | Pro ($20/mo) |
| AWS RDS | 12mo free tier | db.t4g.micro |
| Railway | $5 credit | Hobby ($5/mo) |

### Setup Steps

1. Create database instance
2. Note connection string (with SSL)
3. Set `DATABASE_URL` in production environment
4. Run migrations:

```bash
npx prisma migrate deploy
```

5. Seed initial data (optional):

```bash
npx prisma db seed
```

### Connection Pooling

For production, use connection pooling:

- **Prisma Accelerate**: Add `?accelerate=true` to connection string
- **PgBouncer**: Deploy alongside database
- **Built-in pooling**: Some managed services provide pooling URLs

---

## Object Storage Setup (AWS S3)

### Create S3 Bucket

1. Go to AWS S3 Console
2. Create bucket: `drinkly-uploads`
3. Disable public access (use presigned URLs)
4. Enable versioning

### Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/drinkly-app"
      },
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::drinkly-uploads/*"
    }
  ]
}
```

### CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

---

## Payment Provider Setup (Stripe)

1. Create Stripe account at stripe.com
2. Get API keys from dashboard:
   - Publishable key (client-side)
   - Secret key (server-side)
   - Webhook signing secret

3. Configure webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

4. Test with Stripe test mode before going live

---

## SMS Provider Setup (Twilio)

1. Create Twilio account
2. Purchase phone number
3. Note credentials:
   - Account SID
   - Auth Token
   - Phone number

4. Configure messaging service (optional for better deliverability)

---

## Email Provider Setup (Resend)

1. Create Resend account
2. Generate API key
3. Verify domain in Resend dashboard:
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification

4. Set `EMAIL_FROM` to verified domain address

---

## Maps Provider Setup (Google Maps)

1. Create Google Cloud project
2. Enable Maps JavaScript API and Geocoding API
3. Create API key with restrictions:
   - HTTP referrers: `https://your-domain.com/*`
   - APIs: Maps JavaScript, Geocoding

4. Set billing account (required even for free tier)

---

## Domain and SSL Setup

### Domain Configuration

1. Register domain or use existing
2. Point DNS to your hosting:
   - **Vercel**: CNAME to `cname.vercel-dns.com`
   - **Self-hosted**: A record to server IP

### SSL Certificate

- **Vercel**: Automatic via Let's Encrypt
- **Self-hosted**: Use Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

- Auto-renewal configured by Certbot

---

## Monitoring and Logging

### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Web vitals and traffic
- **Uptime Robot**: Uptime monitoring

### Log Management

- Structured JSON logging
- Log aggregation: Datadog, Logtail, or Papertrail
- Error alerts via email/Slack

### Health Checks

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

---

## Performance Optimization

### Next.js

- Enable standalone output for smaller Docker images
- Use ISR (Incremental Static Regeneration) for product pages
- Implement edge caching for API responses
- Optimize images with Next.js Image component

### Database

- Add indexes for frequently queried fields
- Use connection pooling
- Implement read replicas for analytics
- Monitor slow queries

### CDN

- Vercel Edge Network (automatic)
- Cloudflare for self-hosted deployments
- Cache static assets aggressively

---

## Scaling Considerations

### Horizontal Scaling

- Next.js stateless (sessions in cookies/DB)
- Multiple app instances behind load balancer
- Database read replicas

### Vertical Scaling

- Increase server resources as needed
- Upgrade database instance tier
- Add Redis for caching layer

### Auto-Scaling

- Vercel: Automatic
- Docker: Kubernetes or Docker Swarm
- AWS: ECS with auto-scaling

---

## Backup and Disaster Recovery

### Database Backups

- **Automated**: Daily backups via managed provider
- **Point-in-time recovery**: Enable for production
- **Manual**: Weekly pg_dump to S3

```bash
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://drinkly-backups/
```

### Application Backups

- Git repository (source code)
- Environment variables documented
- Docker images tagged and stored

### Recovery Procedures

1. Restore database from backup
2. Redeploy application
3. Verify environment variables
4. Run health checks
5. Notify stakeholders

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pipeline Stages

1. **Lint** — Code quality checks
2. **Type Check** — TypeScript validation
3. **Test** — Unit and integration tests
4. **Build** — Production build
5. **Deploy** — Deploy to staging/production
6. **Verify** — Health check and smoke tests

---

## Checklist

Before going live:

- [ ] All environment variables set in production
- [ ] Database migrations applied
- [ ] Stripe in live mode with real keys
- [ ] Domain configured with SSL
- [ ] Email domain verified (SPF, DKIM)
- [ ] S3 bucket configured and accessible
- [ ] Twilio phone number active
- [ ] Google Maps API key with billing
- [ ] Error monitoring configured (Sentry)
- [ ] Uptime monitoring configured
- [ ] Backup system tested
- [ ] Compliance rules configured for target jurisdictions
- [ ] Admin accounts created with strong passwords
- [ ] Rate limiting configured
- [ ] Security headers verified
- [ ] Performance benchmarks established
