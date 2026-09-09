# API Documentation

Base URL: `http://localhost:3000/api` (development) or `https://your-domain.com/api` (production)

---

## Authentication

### Obtaining a Token

```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "user": {
    "id": "clx1234...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

The session token is set as an HTTP-only cookie automatically by NextAuth.

### Using Authentication

Include the session cookie in requests. For API routes that require auth, the session is validated server-side via `getServerSession()`.

### Sign Out

```bash
POST /api/auth/signout
```

---

## Standard Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

Error response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

---

## Auth Endpoints

### POST /api/auth/register

Register a new user account.

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "phone": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "role": "CUSTOMER | RETAILER | DELIVERY"
}
```

**Validation:**
- Email must be valid format
- Password minimum 8 characters
- Date of birth must confirm user is 21+
- Phone in E.164 format

### POST /api/auth/signin

Sign in with email and password.

### POST /api/auth/signout

Sign out and destroy session.

### GET /api/auth/session

Get current session information.

---

## Store Endpoints

### GET /api/stores

List all active stores.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `lat` | number | Latitude for distance sorting |
| `lng` | number | Longitude for distance sorting |
| `radius` | number | Delivery radius in km |

### GET /api/stores/:id

Get store details by ID.

### POST /api/stores

Create a new store. (Retailer role required)

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "latitude": "number",
  "longitude": "number",
  "phone": "string",
  "licenseNumber": "string",
  "licenseExpiry": "YYYY-MM-DD",
  "operatingHours": {
    "monday": { "open": "09:00", "close": "22:00" },
    "tuesday": { "open": "09:00", "close": "22:00" }
  }
}
```

### PUT /api/stores/:id

Update store details. (Store owner or Admin)

### DELETE /api/stores/:id

Soft-delete a store. (Admin)

---

## Product Endpoints

### GET /api/products

List products with filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `storeId` | string | Filter by store |
| `category` | string | Filter by category slug |
| `search` | string | Full-text search |
| `minPrice` | number | Minimum price (cents) |
| `maxPrice` | number | Maximum price (cents) |
| `page` | number | Page number |
| `limit` | number | Items per page |
| `sort` | string | `price-asc`, `price-desc`, `name`, `newest` |

### GET /api/products/:id

Get product details including variants and inventory.

### POST /api/products

Create a new product. (Retailer role required)

**Body:**
```json
{
  "storeId": "string",
  "name": "string",
  "description": "string",
  "categoryId": "string",
  "price": 1299,
  "compareAtPrice": 1599,
  "sku": "string",
  "alcoholContent": 12.5,
  "volume": "750ml",
  "imageUrl": "string",
  "inventory": 100
}
```

### PUT /api/products/:id

Update a product. (Store owner)

### DELETE /api/products/:id

Remove a product. (Store owner)

---

## Category Endpoints

### GET /api/categories

List all product categories.

### GET /api/categories/:id

Get category with product count.

---

## Cart Endpoints

### GET /api/cart

Get current user's cart.

### POST /api/cart/items

Add item to cart.

**Body:**
```json
{
  "productId": "string",
  "quantity": 1,
  "storeId": "string"
}
```

### PUT /api/cart/items/:itemId

Update cart item quantity.

**Body:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/items/:itemId

Remove item from cart.

### DELETE /api/cart

Clear entire cart.

---

## Checkout & Order Endpoints

### POST /api/checkout

Initiate checkout process.

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "latitude": 39.7817,
    "longitude": -89.6501
  },
  "deliverySlot": {
    "date": "2024-01-15",
    "timeSlot": "14:00-16:00"
  },
  "paymentMethodId": "pm_stripe_token",
  "notes": "Ring doorbell twice"
}
```

**Validation checks performed:**
- Age verification status
- Compliance rules (dry day, operating hours)
- Delivery zone eligibility
- Store operating hours
- Product availability

### GET /api/orders

List user's orders. (Authenticated)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by order status |
| `page` | number | Page number |
| `limit` | number | Items per page |

### GET /api/orders/:id

Get order details.

### PUT /api/orders/:id/status

Update order status. (Retailer/Delivery/Admin)

**Body:**
```json
{
  "status": "CONFIRMED | PREPARING | OUT_FOR_DELIVERY | DELIVERED | CANCELLED",
  "note": "string"
}
```

### POST /api/orders/:id/cancel

Cancel an order. (Customer, within allowed window)

---

## Payment Endpoints

### POST /api/payments/create-intent

Create a Stripe payment intent.

**Body:**
```json
{
  "orderId": "string",
  "amount": 2599,
  "currency": "usd"
}
```

### POST /api/payments/confirm

Confirm payment after Stripe processes it.

### GET /api/payments/:orderId

Get payment status for an order.

### POST /api/webhooks/stripe

Stripe webhook handler. (Called by Stripe, not client)

---

## Retailer Endpoints

### GET /api/retailer/stores

List stores owned by the current retailer.

### GET /api/retailer/dashboard

Get retailer dashboard stats (order count, revenue, etc.).

### GET /api/retailer/orders

List orders for retailer's stores.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `storeId` | string | Filter by specific store |
| `status` | string | Filter by status |
| `from` | string | Start date (ISO 8601) |
| `to` | string | End date (ISO 8601) |

### POST /api/retailer/license

Submit or update retailer license for verification.

**Body:**
```json
{
  "licenseNumber": "string",
  "licenseType": "string",
  "issuingAuthority": "string",
  "issueDate": "YYYY-MM-DD",
  "expiryDate": "YYYY-MM-DD",
  "documentUrl": "string"
}
```

---

## Delivery Endpoints

### GET /api/delivery/available

List available delivery jobs. (Delivery role)

### POST /api/delivery/accept/:orderId

Accept a delivery job.

### PUT /api/delivery/status/:orderId

Update delivery status.

**Body:**
```json
{
  "status": "PICKED_UP | IN_TRANSIT | DELIVERED",
  "latitude": 39.7817,
  "longitude": -89.6501,
  "proofOfDeliveryUrl": "string"
}
```

### GET /api/delivery/history

Delivery person's delivery history.

### GET /api/delivery/slots

Get available delivery slots for a store and date.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `storeId` | string | Store ID |
| `date` | string | Date (YYYY-MM-DD) |
| `lat` | number | Delivery latitude |
| `lng` | number | Delivery longitude |

---

## Admin Endpoints

### GET /api/admin/users

List all users. (Admin)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role |
| `status` | string | Filter by status |
| `search` | string | Search name or email |

### PUT /api/admin/users/:id

Update user details or status.

### PUT /api/admin/users/:id/verify

Verify a user's age or retailer license.

**Body:**
```json
{
  "type": "AGE | RETAILER_LICENSE",
  "status": "VERIFIED | REJECTED",
  "notes": "string"
}
```

### GET /api/admin/orders

List all orders. (Admin)

### GET /api/admin/analytics

Get platform analytics and statistics.

### GET /api/admin/audit-log

View audit log entries.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Filter by action type |
| `userId` | string | Filter by user |
| `from` | string | Start date |
| `to` | string | End date |
| `page` | number | Page number |

### POST /api/admin/compliance/rules

Create or update compliance rules.

### GET /api/admin/compliance/rules

List all active compliance rules.

### PUT /api/admin/compliance/rules/:id

Update a compliance rule.

---

## Compliance Endpoints

### POST /api/compliance/verify

Verify if an order passes all compliance checks.

**Body:**
```json
{
  "storeId": "string",
  "shippingAddress": {
    "state": "IL",
    "city": "Springfield"
  },
  "deliveryDate": "YYYY-MM-DD",
  "deliveryTime": "14:00",
  "products": ["productId1", "productId2"]
}
```

### GET /api/compliance/rules

Public compliance rules for a jurisdiction.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | string | State code |
| `city` | string | City name |

### GET /api/compliance/dry-days

Get dry days for a jurisdiction.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | string | State code |
| `year` | number | Year |

---

## Notification Endpoints

### GET /api/notifications

List user's notifications. (Authenticated)

### PUT /api/notifications/:id/read

Mark a notification as read.

### PUT /api/notifications/read-all

Mark all notifications as read.

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `CONFLICT` | 409 | Resource already exists |
| `AGE_RESTRICTION` | 403 | User age verification failed |
| `COMPLIANCE_VIOLATION` | 403 | Order violates compliance rules |
| `STORE_CLOSED` | 400 | Store is currently closed |
| `DRY_DAY` | 400 | Delivery date is a dry day |
| `OUTSIDE_DELIVERY_ZONE` | 400 | Address outside delivery range |
| `INSUFFICIENT_INVENTORY` | 400 | Product out of stock |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Checkout | 10 requests | 1 minute |
| File Upload | 20 requests | 1 minute |

Rate limits are applied per IP address. Exceeding the limit returns `429 Too Many Requests` with a `Retry-After` header.
