# Backend Structure Document

This document describes the backend setup for the Golden HomeShare Marketplace. It uses simple language and clear sections so anyone can understand how data flows, how we host and secure the system, and how we keep it running smoothly.

## 1. Backend Architecture

### Architecture Overview
- We use Next.js API Routes (Node.js) instead of a separate server. This means our frontend and backend live in the same codebase but run in different contexts.
- Business logic (authentication, payments, uploads) sits in these API Routes and calls external services (Kinde, Stripe, UploadThing, Resend).
- We follow a layered design:
  - **API Layer:** Handles HTTP requests, authentication, and input validation.
  - **Service Layer:** Contains business rules (e.g., creating a Stripe session, sending emails).
  - **Data Layer:** Uses Prisma ORM to talk to our PostgreSQL database.

### Design Patterns & Frameworks
- **Prisma (ORM):** Provides type-safe database queries and migrations.
- **Zod:** Validates and parses incoming API data to prevent bad or malicious input.
- **Third-Party SDKs:** Kinde for auth, Stripe for payments, UploadThing for file uploads, Resend for emails.

### Scalability, Maintainability & Performance
- **Scalability:** Next.js on Vercel auto-scales API Routes based on traffic. Managed PostgreSQL scales vertically or horizontally (read replicas) as needed.
- **Maintainability:** Clear separation between controllers, services, and database models. Type safety (TypeScript + Prisma) reduces bugs.
- **Performance:** Edge caching of static assets/CDN for images and compiled pages. API Routes are serverless functions that spin up quickly.

## 2. Database Management

### Database Technology
- **Type:** Relational (SQL)
- **System:** PostgreSQL (hosted as a managed service like Supabase or AWS RDS)

### Data Structure & Practices
- Data is organized into tables for users, listings, images, files, and purchases.
- We use Prisma Migrate for versioned schema changes and automated migrations.
- Daily automated backups and point-in-time recovery (managed by the database provider).
- Connection pooling to manage database connections efficiently.

## 3. Database Schema

Below is a human-readable summary and the corresponding SQL schema.

### Human-Readable Schema
- **User**: Each person with a profile, login credentials (via Kinde), and an optional connected Stripe account.
- **Listing**: A homeshare offer created by a host, including title, descriptions, price, category, and timestamps.
- **ListingImage**: One image per row linked to a listing, storing the image URL.
- **ListingFile**: One downloadable file per listing (e.g., contract template), storing the file URL.
- **Purchase**: Records of completed bookings, links buyer, listing, Stripe session IDs, and timestamps.

### SQL Schema (PostgreSQL)
```sql
-- 1. Users
table users (
  id            serial primary key,
  kinde_user_id varchar not null unique,
  first_name    varchar,
  last_name     varchar,
  stripe_account_id varchar,  -- for Stripe Connect
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- 2. Listings
table listings (
  id             serial primary key,
  host_id        integer references users(id) on delete cascade,
  title          varchar not null,
  short_desc     varchar not null,
  full_desc      text not null,
  price_cents    integer not null,
  category       varchar not null,  -- e.g., 'Housemate', 'Private Room', 'ADU'
  created_at     timestamp with time zone default now(),
  updated_at     timestamp with time zone default now()
);

-- 3. Listing Images
table listing_images (
  id         serial primary key,
  listing_id integer references listings(id) on delete cascade,
  url        varchar not null
);

-- 4. Listing Files
table listing_files (
  id         serial primary key,
  listing_id integer references listings(id) on delete cascade,
  url        varchar not null,
  filename   varchar not null
);

-- 5. Purchases
table purchases (
  id                serial primary key,
  buyer_id          integer references users(id) on delete set null,
  listing_id        integer references listings(id) on delete set null,
  stripe_session_id varchar not null,
  amount_cents      integer not null,
  payment_status    varchar not null,  -- e.g., 'paid', 'pending'
  created_at        timestamp with time zone default now()
);
```

## 4. API Design and Endpoints

We follow RESTful conventions. All endpoints live under `/api` in Next.js.

### Authentication (Kinde)
- `GET /api/auth/login`: Redirects users to Kinde login.
- `GET /api/auth/callback`: Handles Kinde callback and sets session cookie.
- `POST /api/auth/logout`: Clears the session.

### Users
- `GET /api/users/me`: Returns current user profile.
- `PUT /api/users/me`: Updates first and last name.
- `POST /api/users/stripe-connect`: Creates a Stripe Connect account link.

### Listings
- `GET /api/listings`: Lists all listings (supports `?category=` filter and sorting).
- `GET /api/listings/[id]`: Retrieves one listing’s details.
- `POST /api/listings`: Creates a new listing (host only).
- `PUT /api/listings/[id]`: Updates a listing (host only).
- `DELETE /api/listings/[id]`: Deletes a listing (host only).

### File Uploads (UploadThing)
- `POST /api/uploads/images`: Returns signed URLs for image uploads.
- `POST /api/uploads/files`: Returns signed URL for the single listing file.

### Purchases & Payments
- `POST /api/purchases/checkout-session`: Creates a Stripe Checkout session for a listing.
- `POST /api/purchases/webhook`: Receives Stripe webhook events and records purchases.
- `GET /api/purchases/[id]`: Retrieves purchase details (buyer only).

### Emails (Resend)
- Sent internally by services after a successful webhook event.

## 5. Hosting Solutions

- **Vercel**: Hosts the Next.js app (frontend + API Routes). Automatically scales serverless functions and provides a global CDN.
- **PostgreSQL**: Managed by Supabase or AWS RDS for automated backups, monitoring, and scaling.
- **UploadThing Storage**: Uses a cloud provider (S3-compatible) managed by UploadThing.
- **Resend Email Infrastructure**: Hosted by Resend’s service (high deliverability and SLAs).

**Benefits**
- High reliability with auto-scaling and failover.
- Predictable costs via serverless pricing and managed database tiers.
- Global performance through edge caching (Vercel CDN).

## 6. Infrastructure Components

- **Load Balancing & Serverless Functions**: Vercel routes each API request to the nearest serverless instance.
- **CDN**: Static assets, optimized images, and compiled pages are cached at edge locations.
- **Caching**: Next.js ISR (Incremental Static Regeneration) for frequently accessed pages; HTTP cache headers for images and assets.
- **Database Connection Pool**: Uses a connection pooler (pgbouncer) where needed to manage PostgreSQL connections.
- **Webhooks Listener**: A dedicated serverless function handles Stripe webhooks, ensuring idempotent updates.

## 7. Security Measures

- **Authentication**: Outsourced to Kinde (OAuth 2.0 / OpenID Connect). No passwords stored locally.
- **Authorization**: API routes check user session and roles (host vs. visitor) before allowing data changes.
- **Data Encryption**
  - TLS enforced on all endpoints (HTTPS).
  - Database encryption at rest (managed by provider).
  - Signed URLs for file access with time-limited tokens.
- **Input Validation**: Zod schemas on every route to block malformed or malicious data.
- **Cookie Security**: `httpOnly`, `secure`, and `sameSite` flags on session cookies.
- **Stripe Webhook Verification**: Verifies signatures to ensure events are legitimate.
- **CORS & CSRF**: Same-site cookies and Vercel’s default CORS protections.

## 8. Monitoring and Maintenance

### Monitoring
- **Vercel Analytics & Logs**: Track function execution times, errors, and request volumes.
- **Database Metrics**: Monitor CPU, memory, query performance via Supabase/AWS dashboards.
- **Error Tracking (Optional)**: Integrate Sentry or Logflare to capture exceptions and slow transactions.

### Maintenance Strategies
- **Automated Testing**: CI runs linting, type checks, and unit/integration tests on each pull request.
- **Automated Deployments**: Merges to main branch trigger Vercel deployments with zero-downtime.
- **Database Migrations**: Managed by Prisma Migrate with reviewable SQL scripts.
- **Backups & Restore**: Daily automated backups and manual restore drills.
- **Dependency Updates**: Monthly review of npm packages, security patches applied ASAP.

## 9. Conclusion and Overall Backend Summary

The backend for Golden HomeShare Marketplace combines Next.js API Routes, a managed PostgreSQL database (via Prisma), and a set of trusted external services (Kinde, Stripe, UploadThing, Resend). This architecture:

- Scales automatically with demand.
- Keeps sensitive operations secure and compliant.
- Separates concerns so teams can maintain and extend features with confidence.

Unique strengths include serverless functions coexisting with a relational database, and the use of specialized services to offload complex areas like authentication, payments, and file storage. The result is a robust, performant, and secure backend that meets the project’s goals and user needs.