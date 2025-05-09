# Tech Stack Document for Golden HomeShare Marketplace

This document explains the technologies we chose for the Golden HomeShare Marketplace in simple terms. Each section covers a part of the project’s setup, why we picked certain tools, and how they work together to deliver a smooth, secure, and reliable experience.

## 1. Frontend Technologies

We want users to enjoy a fast, responsive, and attractive interface when browsing or creating homeshare listings. Here’s what we’re using on the front end:

*   **Next.js (React framework)**

    *   Builds pages with a mix of server-side rendering (SSR) and client-side interactivity.
    *   Improves performance by pre-rendering key pages and lazy-loading others.

*   **React**

    *   Delivers reusable UI components and a fast user interface.

*   **Tailwind CSS**

    *   A utility-first styling toolkit that speeds up design with ready-made classes.
    *   Ensures consistency and easy customization without writing long custom stylesheets.

*   **Radix UI**

    *   Provides accessible, unstyled UI building blocks (like dialogs, menus, form elements).
    *   Lets us apply our Tailwind themes while keeping components keyboard- and screen-reader-friendly.

*   **Reusable UI Helpers**

    *   **Class Variance Authority & Tailwind Merge**: Helps manage and merge Tailwind class combinations in a predictable way.
    *   **Lucide React**: A lightweight icon library for clear, consistent iconography.
    *   **Embla Carousel**: A simple, touch-friendly carousel for image slideshows.
    *   **Next Themes**: Enables light/dark mode switching.
    *   **Sonner**: A toast notification library to show quick feedback messages (e.g., “Listing created!”).

*   **TipTap**

    *   A rich-text editor for hosts to write detailed listing descriptions (bold text, bullet lists, links).

*   **Zod**

    *   Validates data on the client side before it’s sent to the server (e.g., making sure price is a number, description isn’t empty).

Together, these tools create a polished, mobile-friendly interface that adapts to phones, tablets, and desktops while keeping our code organized and maintainable.

## 2. Backend Technologies

The backend powers data storage, business logic, and integrations. Here’s what we rely on:

*   **Next.js API Routes (Node.js)**

    *   Serves as our backend server without spinning up a separate Node service.
    *   Handles all data requests, authentication checks, and calls to external services.

*   **Prisma (ORM)**

    *   Connects to PostgreSQL with type-safe, auto-generated database queries.
    *   Simplifies creating, reading, updating, and deleting records (users, listings, orders).

*   **PostgreSQL**

    *   A reliable relational database for storing user profiles, homeshare listings, and transactions.
    *   Used in a managed service (e.g., Supabase or AWS RDS) for automated backups and scaling.

*   **Kinde**

    *   Manages user sign-up, login, and secure sessions (OAuth under the hood).
    *   Keeps authentication logic out of our own codebase, reducing security risks.

*   **Stripe + Stripe Connect**

    *   Processes listing bookings via Stripe Checkout.
    *   Collects platform fees and routes payouts directly to hosts’ connected Stripe accounts.
    *   Handles webhooks to confirm payments and update order status.

*   **UploadThing**

    *   Handles file and image uploads from users.
    *   Provides secure, time-limited URLs for storing and retrieving assets.

*   **Resend**

    *   Sends transactional emails after successful bookings (e.g., email with a download link for the listing’s contract template).

*   **Zod (backend)**

    *   Validates incoming API data to ensure safety (prevents bad or malicious data from hitting our database).

These components work together to securely manage data, process payments, and exchange files and emails without slowing down the user.

## 3. Infrastructure and Deployment

We use modern cloud services and workflows to deploy and maintain the application reliably:

*   **Version Control: Git & GitHub**

    *   All code lives in GitHub repositories, enabling collaboration, code reviews, and history tracking.

*   **Hosting & Deployment: Vercel**

    *   Automatically builds and deploys the Next.js app on every commit to the main branch.
    *   Provides global edge locations for fast content delivery (CDN).

*   **CI/CD Pipeline**

    *   Every pull request runs linting, type checks, and tests.
    *   Merged code is automatically deployed to production—no manual steps required.

*   **Database Hosting**

    *   PostgreSQL is hosted as a managed service (Supabase, AWS RDS, or similar).
    *   Includes automated backups, failover, and vertical/horizontal scaling options.

*   **Environment Management**

    *   Secrets (API keys, database URLs) stored securely in Vercel’s environment variables.
    *   Different variables for development, staging, and production to prevent accidental data leaks.

*   **Monitoring & Logging**

    *   (Optional) Services like Sentry or Logflare can be added to track errors and performance in real time.

This setup ensures that new features reach users quickly, keep downtime to a minimum, and let us roll back safely if something goes wrong.

## 4. Third-Party Integrations

To speed up development and rely on battle-tested services, we integrate with several third parties:

*   **Kinde** for user authentication and session management.
*   **Stripe** (and Stripe Connect) for secure, compliant payment processing and host payouts.
*   **UploadThing** for reliable image and file uploads with built-in security.
*   **Resend** for sending transactional emails (booking confirmations and download links).
*   **TipTap** (embedded as an npm package) for rich-text editing in listing descriptions.
*   **Radix UI, Embla, Lucide, Sonner** (npm packages) for UI components, carousels, icons, and toasts.

Benefits:

*   Offloads complex areas (security, compliance, scaling) to specialized providers.
*   Lets us focus on core homesharing features.
*   Increases trust and reliability by using services with strong uptime SLAs.

## 5. Security and Performance Considerations

Security and speed are top priorities. Here’s how we address them:

*   **Authentication & Data Protection**

    *   HTTPS everywhere by default (enforced by Vercel).
    *   JWT or session tokens stored in httpOnly cookies to prevent JavaScript access.
    *   Kinde ensures password management, multi-factor support, and OAuth best practices.

*   **API & Webhook Safety**

    *   Zod schema validation on every API route.
    *   CSRF protection via same-site cookies.
    *   Stripe webhooks use signature checks to prevent spoofed events.

*   **Performance Optimizations**

    *   Next.js Image component for automatic image resizing, optimization, and lazy-loading.
    *   Server-side rendering (SSR) for faster first-page loads and SEO benefits.
    *   Automatic code splitting so users only download the JS they need.
    *   CDN caching for static assets and pages.

*   **Payment Compliance**

    *   Stripe handles PCI compliance—no sensitive card data touches our servers.

*   **Monitoring & Error Handling**

    *   Optionally integrate Sentry (or similar) to capture runtime errors and performance bottlenecks.
    *   Automated alerts for 5xx responses or slow API endpoints.

## 6. Conclusion and Overall Tech Stack Summary

Golden HomeShare Marketplace combines best-in-class tools to deliver a secure, high-performance homesharing platform with minimal operational overhead. Here’s a quick recap:

*   **Frontend**: Next.js, React, Tailwind CSS, Radix UI, TipTap, and supporting UI libraries (Embla, Lucide React, Sonner).
*   **Backend**: Next.js API routes, Prisma + PostgreSQL, Kinde, Stripe + Stripe Connect, UploadThing, Resend.
*   **Infrastructure**: GitHub + Git for version control, Vercel for CI/CD and hosting, managed database services, secure environment variables.
*   **Security & Performance**: HTTPS, httpOnly cookies, schema validation, SSR, image optimization, CDN caching, Stripe PCI compliance.

This stack aligns with our goals to provide:

*   A user-friendly, responsive interface for homeshare hosts and seekers.
*   Secure, compliant handling of personal data, payments, and file uploads.
*   A reliable deployment process that scales as more people join the platform.

By relying on proven frameworks and services, we reduce development time, minimize risks, and ensure that Golden HomeShare Marketplace can grow smoothly as we welcome more users.
