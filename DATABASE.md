# Database Documentation

---

## Requirements

- PostgreSQL 14 or later
- UTF-8 encoding
- Connection pooling recommended for production (PgBouncer or Prisma Accelerate)

---

## Prisma Schema Overview

The database schema is defined in `prisma/schema.prisma` and managed through Prisma migrations.

```bash
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema to database (dev)
npx prisma migrate dev     # Create migration (dev)
npx prisma migrate deploy  # Apply migrations (production)
```

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │    Store     │       │   Category   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │◄──┐   │ id           │◄──┐   │ id           │
│ email        │   │   │ name         │   │   │ name         │
│ name         │   │   │ description  │   │   │ slug         │
│ password     │   │   │ address      │   │   │ description  │
│ phone        │   │   │ city         │   │   │ imageUrl     │
│ role         │   │   │ state        │   │   │ parentId     │──┐
│ dateOfBirth  │   │   │ zipCode      │   │   └──────────────┘  │
│ ageVerified  │   │   │ latitude     │   │                     │
│ status       │   │   │ longitude    │   │   ┌──────────────┐  │
└──────┬───────┘   │   │ phone        │   │   │   Product    │  │
       │           │   │ licenseNo    │   │   ├──────────────┤  │
       │           │   │ licenseExp   │   │   │ id           │  │
       │           │   │ licenseVerified│  │   │ storeId      │──┘
       │           │   │ operatingHours│  │   │ categoryId   │──┘
       │           │   │ ownerId      │──┘   │ name         │
       │           │   │ status       │      │ description  │
       │           │   └──────────────┘      │ price        │
       │           │                         │ sku          │
       │           │   ┌──────────────┐      │ alcoholContent│
       │           │   │     Cart     │      │ volume       │
       │           │   ├──────────────┤      │ imageUrl     │
       │           ├──▶│ id           │      │ inventory    │
       │           │   │ userId       │      │ status       │
       │           │   │ storeId      │──┘   └──────┬───────┘
       │           │   └──────┬───────┘             │
       │           │          │                     │
       │           │   ┌──────┴───────┐      ┌──────┴───────┐
       │           │   │   CartItem   │      │   OrderItem  │
       │           │   ├──────────────┤      ├──────────────┤
       │           │   │ id           │      │ id           │
       │           │   │ cartId       │      │ orderId      │──┐
       │           │   │ productId    │──┘   │ productId    │──┘
       │           │   │ quantity     │      │ quantity     │
       │           │   │ price        │      │ price        │
       │           │   └──────────────┘      └──────────────┘
       │           │
       │           │   ┌──────────────┐      ┌──────────────┐
       │           │   │    Order     │      │   Payment    │
       │           │   ├──────────────┤      ├──────────────┤
       │           ├──▶│ id           │◄─────│ id           │
       │           │   │ userId       │      │ orderId      │
       │           │   │ storeId      │      │ amount       │
       │           │   │ status       │      │ currency     │
       │           │   │ total        │      │ stripeId     │
       │           │   │ shippingAddr │      │ status       │
       │           │   │ deliverySlot │      └──────────────┘
       │           │   │ notes        │
       │           │   └──────┬───────┘
       │           │          │
       │           │   ┌──────┴───────┐
       │           │   │   Delivery   │
       │           │   ├──────────────┤
       │           │   │ id           │
       │           │   │ orderId      │
       │           │   │ driverId     │
       │           │   │ status       │
       │           │   │ proofUrl     │
       │           │   └──────────────┘
       │           │
       │           │   ┌──────────────┐
       │           │   │  AuditLog    │
       │           │   ├──────────────┤
       │           └──▶│ id           │
       │               │ userId       │
       │               │ action       │
       │               │ details      │
       │               │ ipAddress    │
       │               │ createdAt    │
       │               └──────────────┘
       │
       │           ┌──────────────┐
       │           │ Notification │
       │           ├──────────────┤
       └──────────▶│ id           │
                   │ userId       │
                   │ type         │
                   │ title        │
                   │ message      │
                   │ read         │
                   │ createdAt    │
                   └──────────────┘
```

---

## Models

### User
Stores user accounts with role-based access.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `email` | String | Unique email address |
| `name` | String | Full name |
| `password` | String | Bcrypt hashed password |
| `phone` | String? | Phone number (E.164) |
| `role` | Enum | CUSTOMER, RETAILER, DELIVERY, ADMIN |
| `dateOfBirth` | DateTime | Used for age verification |
| `ageVerified` | Boolean | Whether age has been verified |
| `status` | Enum | ACTIVE, SUSPENDED, PENDING |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### Store
Retailer store profiles with license information.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Store name |
| `description` | String? | Store description |
| `address` | String | Street address |
| `city` | String | City |
| `state` | String | State code |
| `zipCode` | String | ZIP/postal code |
| `latitude` | Float | Geographic latitude |
| `longitude` | Float | Geographic longitude |
| `phone` | String | Contact phone |
| `licenseNumber` | String | Alcohol license number |
| `licenseExpiry` | DateTime | License expiration date |
| `licenseVerified` | Boolean | Admin-verified license |
| `operatingHours` | Json | Weekly operating hours |
| `ownerId` | String | Foreign key to User |
| `status` | Enum | ACTIVE, INACTIVE, SUSPENDED |
| `createdAt` | DateTime | Creation timestamp |

### Category
Product categories with hierarchical structure.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Category name |
| `slug` | String | URL-friendly identifier |
| `description` | String? | Category description |
| `imageUrl` | String? | Category image |
| `parentId` | String? | Parent category for subcategories |

### Product
Alcohol products listed by retailers.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `storeId` | String | Foreign key to Store |
| `categoryId` | String | Foreign key to Category |
| `name` | String | Product name |
| `description` | String? | Product description |
| `price` | Int | Price in cents |
| `compareAtPrice` | Int? | Original price for sale display |
| `sku` | String | Stock keeping unit |
| `alcoholContent` | Float? | ABV percentage |
| `volume` | String? | Volume (e.g., "750ml") |
| `imageUrl` | String? | Product image URL |
| `inventory` | Int | Stock quantity |
| `status` | Enum | ACTIVE, OUT_OF_STOCK, DISCONTINUED |
| `createdAt` | DateTime | Creation timestamp |

### Cart / CartItem
Shopping cart with line items.

**Cart:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String | Foreign key to User |
| `storeId` | String? | Store context (carts are per-store) |

**CartItem:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `cartId` | String | Foreign key to Cart |
| `productId` | String | Foreign key to Product |
| `quantity` | Int | Item quantity |
| `price` | Int | Price at time of add (cents) |

### Order / OrderItem
Customer orders with line items.

**Order:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String | Foreign key to User |
| `storeId` | String | Foreign key to Store |
| `status` | Enum | PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED |
| `total` | Int | Order total in cents |
| `shippingAddress` | Json | Delivery address |
| `deliverySlot` | Json | Scheduled delivery window |
| `notes` | String? | Customer delivery notes |
| `createdAt` | DateTime | Order placement timestamp |
| `updatedAt` | DateTime | Last status update |

**OrderItem:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `orderId` | String | Foreign key to Order |
| `productId` | String | Foreign key to Product |
| `quantity` | Int | Quantity ordered |
| `price` | Int | Price at time of order (cents) |

### Payment
Payment records linked to orders.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `orderId` | String | Foreign key to Order |
| `amount` | Int | Amount in cents |
| `currency` | String | ISO 4217 currency code |
| `stripePaymentIntentId` | String? | Stripe payment intent |
| `stripeChargeId` | String? | Stripe charge ID |
| `status` | Enum | PENDING, SUCCEEDED, FAILED, REFUNDED |
| `createdAt` | DateTime | Payment timestamp |

### Delivery
Delivery tracking for orders.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `orderId` | String | Foreign key to Order |
| `driverId` | String? | Foreign key to User (delivery person) |
| `status` | Enum | PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED |
| `proofOfDeliveryUrl` | String? | Photo proof of delivery |
| `currentLatitude` | Float? | Real-time driver location |
| `currentLongitude` | Float? | Real-time driver location |
| `estimatedArrival` | DateTime? | ETA |
| `deliveredAt` | DateTime? | Actual delivery timestamp |

### AuditLog
Immutable audit trail for compliance.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String? | User who performed action |
| `action` | String | Action identifier |
| `resource` | String? | Resource type affected |
| `resourceId` | String? | Resource ID affected |
| `details` | Json? | Additional context |
| `ipAddress` | String? | Request IP address |
| `userAgent` | String? | Request user agent |
| `createdAt` | DateTime | Action timestamp |

### Notification
User notifications.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String | Foreign key to User |
| `type` | Enum | ORDER_UPDATE, PAYMENT, DELIVERY, PROMOTIONAL, SYSTEM |
| `title` | String | Notification title |
| `message` | String | Notification body |
| `read` | Boolean | Read status |
| `createdAt` | DateTime | Creation timestamp |

### ComplianceRule
Configurable compliance rules per jurisdiction.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Rule name |
| `jurisdiction` | String | State/city code |
| `type` | Enum | DRY_DAY, OPERATING_HOURS, DELIVERY_RESTRICTION, AGE_REQUIREMENT |
| `config` | Json | Rule configuration |
| `active` | Boolean | Whether rule is enabled |
| `createdAt` | DateTime | Creation timestamp |

---

## Key Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Store | One-to-Many | A retailer owns multiple stores |
| Store → Product | One-to-Many | A store lists multiple products |
| Category → Product | One-to-Many | A category contains multiple products |
| Category → Category | Self-referential | Parent/child category hierarchy |
| User → Cart | One-to-Each | Each user has one active cart per store |
| Cart → CartItem | One-to-Many | Cart contains multiple items |
| User → Order | One-to-Many | A customer places multiple orders |
| Store → Order | One-to-Many | A store receives multiple orders |
| Order → OrderItem | One-to-Many | Order contains multiple line items |
| Order → Payment | One-to-One | Each order has one payment record |
| Order → Delivery | One-to-One | Each order has one delivery record |
| User → Delivery | One-to-Many | A driver handles multiple deliveries |
| User → AuditLog | One-to-Many | A user generates multiple audit entries |
| User → Notification | One-to-Many | A user receives multiple notifications |

---

## Indexes

The following indexes are defined for performance:

| Model | Index | Fields | Purpose |
|-------|-------|--------|---------|
| User | `email_unique` | `email` | Login lookups |
| User | `role_idx` | `role` | Role-based queries |
| Store | `owner_idx` | `ownerId` | Retailer's stores |
| Store | `location_idx` | `latitude, longitude` | Geospatial queries |
| Store | `status_idx` | `status` | Active store filtering |
| Product | `store_idx` | `storeId` | Store product listings |
| Product | `category_idx` | `categoryId` | Category filtering |
| Product | `status_idx` | `status` | Active product filtering |
| Cart | `user_idx` | `userId` | User cart lookups |
| Order | `user_idx` | `userId` | User order history |
| Order | `store_idx` | `storeId` | Store order management |
| Order | `status_idx` | `status` | Status filtering |
| Order | `created_idx` | `createdAt` | Date range queries |
| Payment | `order_idx` | `orderId` | Order payment lookup |
| Delivery | `order_idx` | `orderId` | Order delivery lookup |
| Delivery | `driver_idx` | `driverId` | Driver delivery history |
| AuditLog | `user_idx` | `userId` | User audit trail |
| AuditLog | `action_idx` | `action` | Action filtering |
| AuditLog | `created_idx` | `createdAt` | Date range queries |
| Notification | `user_read_idx` | `userId, read` | Unread notifications |
| ComplianceRule | `jurisdiction_idx` | `jurisdiction` | Jurisdiction lookups |

---

## Migrations

### Creating a Migration

```bash
npx prisma migrate dev --name description_of_change
```

### Applying Migrations (Production)

```bash
npx prisma migrate deploy
```

### Resetting the Database (Development Only)

```bash
npx prisma migrate reset
```

### Viewing Migration History

```bash
npx prisma migrate status
```

---

## Backup Recommendations

### Automated Backups

- Use managed database backups (AWS RDS, Supabase, Neon)
- Schedule daily backups with 30-day retention
- Enable point-in-time recovery for production

### Manual Backup

```bash
pg_dump -U drinkly -d drinkly -F c -b -v -f backup_$(date +%Y%m%d).dump
```

### Restore

```bash
pg_restore -U drinkly -d drinkly -v backup_20240115.dump
```

---

## Performance Considerations

1. **Connection Pooling**: Use PgBouncer or Prisma Accelerate for production connection pooling
2. **Read Replicas**: Configure read replicas for analytics queries
3. **Query Optimization**: Use `select` and `include` to avoid N+1 queries
4. **Pagination**: Always paginate list endpoints
5. **Indexing**: Add indexes for frequently queried fields
6. **Caching**: Implement Redis caching for hot data (product listings, store info)
7. **Batch Operations**: Use `createMany` and `updateMany` for bulk operations
8. **Soft Deletes**: Use status fields instead of hard deletes to preserve data integrity
