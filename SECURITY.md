# Security Documentation

---

## Security Measures Overview

Drinkly implements multiple layers of security to protect user data, ensure safe transactions, and maintain platform integrity.

---

## Authentication and Authorization

### NextAuth.js

- Session-based authentication using NextAuth.js
- HTTP-only, secure, same-site cookies
- CSRF token validation on all auth endpoints
- Session expiration after 30 days of inactivity

### Password Security

- Passwords hashed with **bcrypt** (cost factor 12)
- Minimum password requirements enforced via Zod validation:
  - 8 characters minimum
  - At least one uppercase letter
  - At least one number
- Passwords never logged or stored in plain text
- Password reset via time-limited, single-use tokens

### Multi-Factor Authentication

- Optional MFA support via authenticator apps
- Backup codes generated for account recovery
- MFA required for admin accounts

---

## Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| CUSTOMER | Browse products, manage cart, place orders, view own orders |
| RETAILER | Manage own stores, products, view store orders, update order status |
| DELIVERY | View assigned deliveries, update delivery status, view delivery history |
| ADMIN | Full platform access, user management, compliance oversight, analytics |

Access checks are performed:
- Server-side in API route handlers
- Middleware-level for page routes
- Component-level for UI elements

---

## Input Validation

### Zod Schemas

All API inputs validated with Zod schemas before processing:

- Email format validation
- Phone number format (E.164)
- Date format validation
- String length limits
- Number range validation
- Enum value constraints
- Required field enforcement

### Request Body Validation

```typescript
// Example validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  dateOfBirth: z.coerce.date(),
});
```

---

## SQL Injection Prevention

- **Prisma ORM** used for all database queries
- Parameterized queries by default
- No raw SQL queries in application code
- Input never interpolated into query strings
- Prisma's query engine handles escaping

---

## Cross-Site Scripting (XSS) Prevention

- React's built-in JSX escaping
- Content Security Policy (CSP) headers configured
- HTTP-only cookies prevent JavaScript access to tokens
- Input sanitization for user-generated content
- Output encoding for rendered content

---

## Cross-Site Request Forgery (CSRF) Protection

- NextAuth CSRF token validation
- Same-site cookie attribute set to `Lax`
- Origin header validation on sensitive endpoints
- Custom CSRF tokens for state-changing operations

---

## Rate Limiting

| Endpoint Type | Limit | Window | Action |
|---------------|-------|--------|--------|
| Login attempts | 5 | 1 minute | Block IP 15 minutes |
| Registration | 3 | 1 hour | Reject request |
| Password reset | 3 | 1 hour | Reject request |
| General API | 100 | 1 minute | Return 429 |
| Checkout | 10 | 1 minute | Return 429 |
| File upload | 20 | 1 minute | Return 429 |

Rate limiting implemented via:
- In-memory store for development
- Redis-backed store for production
- Per-IP and per-user tracking

---

## Security Headers

Configured in Next.js middleware and `next.config.js`:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer data |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` | Restrict browser features |
| `Content-Security-Policy` | Defined policy | Control resource loading |

---

## File Upload Security

- File type validation (whitelist: jpg, png, webp, pdf)
- Maximum file size: 10MB
- Files scanned for malware (if integrated)
- Uploaded to isolated S3 bucket with no public write
- Presigned URLs with expiration for secure access
- File names sanitized and randomized
- No executable files allowed
- Content-Type validation on upload

---

## Payment Security (PCI Compliance)

### Stripe Integration

- **PCI DSS Level 1** compliant via Stripe
- No card data touches Drinkly servers
- Stripe Elements used for card input (iframe)
- Payment tokens (PaymentMethod IDs) used for transactions
- 3D Secure authentication supported
- Webhook signatures verified for all Stripe events

### Secure Practices

- Stripe test mode for development
- Webhook endpoint validated with signing secret
- Payment amounts validated server-side
- Idempotency keys for payment operations
- Refunds processed through Stripe dashboard or API

---

## Data Encryption

### At Rest

- Database encryption via managed PostgreSQL provider
- S3 bucket encryption enabled (AES-256)
- Sensitive fields encrypted before storage where applicable

### In Transit

- TLS 1.2+ for all connections
- HTTPS enforced via HSTS
- Database connections encrypted
- API communications over HTTPS only

---

## Session Management

- Sessions stored as encrypted JWTs in HTTP-only cookies
- Session invalidation on password change
- Concurrent session limits (configurable)
- Session timeout after inactivity
- Secure cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`

---

## API Security

### Request Validation

- Content-Type header validation
- Request body size limits
- Query parameter sanitization
- Header injection prevention

### Response Security

- No sensitive data in error messages
- Stack traces hidden in production
- CORS configured for allowed origins only
- API versioning for backward compatibility

---

## Environment Variable Security

- `.env.local` in `.gitignore` (never committed)
- Production secrets stored in hosting platform (Vercel, AWS)
- No secrets in client-side code
- Environment variables validated at startup
- Separate variables for development and production

---

## Audit Logging

All compliance-relevant actions logged:

| Action | Logged Data |
|--------|-------------|
| User registration | User ID, email, timestamp, IP |
| Age verification | User ID, verification method, result |
| License submission | Retailer ID, license details, timestamp |
| Order placement | Order ID, user ID, items, total, address |
| Payment processed | Order ID, amount, status, timestamp |
| Order status change | Order ID, old status, new status, changed by |
| Delivery status change | Order ID, driver ID, status, location |
| Compliance check | Order ID, rules checked, result |
| Admin actions | Admin ID, action, target, details |

Logs stored in:
- Database `AuditLog` table (queryable)
- Structured JSON logs (for log aggregation)
- Never include passwords, tokens, or PII beyond user ID

---

## Incident Response

### Detection

- Automated monitoring for unusual patterns
- Failed authentication alerts
- Rate limit trigger notifications
- Payment failure monitoring

### Response Procedures

1. Identify and contain the incident
2. Assess impact and affected users
3. Notify affected parties within 72 hours (GDPR requirement)
4. Remediate the vulnerability
5. Conduct post-incident review
6. Update security measures as needed

### Contact

Report security vulnerabilities to: security@drinkly.com

---

## Responsible Disclosure

If you discover a security vulnerability:

1. **Do not** disclose publicly
2. Email security@drinkly.com with details
3. Allow 90 days for remediation
4. We will acknowledge receipt within 48 hours
5. Valid reports eligible for bug bounty (details on request)

### Scope

- Authentication bypass
- SQL injection
- XSS vulnerabilities
- Payment manipulation
- Access control bypasses
- Data exposure

### Out of Scope

- Social engineering
- Physical attacks
- Denial of service attacks
- Third-party service vulnerabilities
