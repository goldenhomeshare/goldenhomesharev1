# Security Guidelines for Golden HomeShare Marketplace

This document outlines the security-by-design principles and best practices tailored for the Golden HomeShare Marketplace (a Next.js application using Kinde, Stripe, UploadThing, Resend, Prisma/PostgreSQL, etc.). Adherence to these guidelines ensures a robust, resilient, and trustworthy platform.

## 1. Core Security Principles

*   **Security by Design**: Embed security into every phase—from requirements through coding, testing, and deployment.
*   **Least Privilege**: Grant services, components, and users only the permissions they strictly need.
*   **Defense in Depth**: Layer controls (network, app, data, endpoint) so one failure doesn’t compromise the system.
*   **Fail Securely**: On errors or exceptions, fail into a safe state; do not leak sensitive details.
*   **Keep Security Simple**: Choose clear and maintainable controls over excessive complexity.
*   **Secure Defaults**: Ship with the most restrictive settings and allow opt-in for weaker configurations if ever needed.

## 2. Authentication & Authorization

### 2.1 Kinde Integration

*   Enforce strong password policies (minimum length, complexity) where Kinde allows customization.
*   Protect tokens in **HttpOnly**, **Secure** cookies with `SameSite=Strict`.
*   Validate and rotate refresh tokens regularly; implement strict session timeouts.
*   Prevent session fixation by regenerating session identifiers after login.

### 2.2 Role-Based Access Control (RBAC)

*   Define roles (`guest`, `user`, `host`, `admin`) with explicit permissions.
*   Enforce server-side authorization checks on every API route (Next.js middleware or in-handler guards).
*   Never rely on client-side checks for sensitive operations.

### 2.3 Multi-Factor Authentication (MFA)

*   Encourage or require MFA for host accounts or high-value transactions.
*   Integrate TOTP or SMS-based second factors via Kinde or an external provider.

## 3. Input Validation & Output Encoding

### 3.1 Schema Validation

*   Use **Zod** schemas on both client and server to enforce types, lengths, formats.
*   Never trust client input—validate in Next.js API routes before any business logic or database call.

### 3.2 Injection Prevention

*   Use **Prisma** or parameterized queries only—never interpolate user input into SQL strings.
*   Sanitize dynamic values in templates; avoid direct `dangerouslySetInnerHTML` unless sanitized via a whitelist sanitizer.

### 3.3 XSS Mitigation

*   Apply context-aware output encoding (HTML, attribute, URL) for all user-supplied data rendered in React components.
*   Deploy a strict [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) via `next.config.js` or HTTP headers.

### 3.4 CSRF Protection

*   For state-changing requests (POST/PUT/DELETE), use anti-CSRF tokens (e.g., `next-csrf` or double-submit cookies).
*   Validate the token server-side before processing.

## 4. Data Protection & Privacy

### 4.1 Encryption

*   Enforce **TLS 1.2+** for all client↔server and server↔third-party communications (Kinde, Stripe, UploadThing, Resend).
*   Encrypt sensitive fields at rest (e.g., user PII) using AES-256 if supported by the database or an application-level encryption library.

### 4.2 Secrets Management

*   **Do not** hardcode API keys, DB passwords, or JWT secrets.
*   Store secrets in environment variables managed by Vercel, AWS Secrets Manager, or Vault.
*   Rotate secrets on a regular schedule and upon suspected compromise.

### 4.3 Data Minimization & Masking

*   Only collect fields required for operations (e.g., no unnecessary PII).
*   Mask PII in logs (e.g., show only last four digits of phone numbers, hash email in trace logs).

## 5. API & Service Security

### 5.1 HTTPS & Transport Security

*   Redirect all HTTP traffic to HTTPS at the CDN or load balancer level.
*   Disable TLS 1.0/1.1; enforce strong cipher suites.

### 5.2 Rate Limiting & Throttling

*   Implement per-IP and per-user rate limits on Next.js API routes (e.g., via `express-rate-limit` or Vercel Edge middleware).
*   Protect login, token refresh, and payment endpoints from brute-force attempts.

### 5.3 CORS Configuration

*   Restrict CORS to known front-end origins.
*   Avoid wildcard (`*`) in production.

### 5.4 Webhook Security

*   Verify Stripe webhook signatures using the Stripe SDK.
*   Enforce idempotency: store processed event IDs and ignore duplicates.

### 5.5 Least-Privileged Service Accounts

*   Create dedicated Stripe API keys only for required scopes (e.g., `write_payments`, `read_disputes`).
*   Use DB users with separate roles: one for migrations/admin, one for the API with only CRUD on needed tables.

## 6. Web Application Security Hygiene

### 6.1 Security Headers

Configure in `next.config.js` or Vercel Edge:

`module.exports = { async headers() { return [ { source: '/(.*)', headers: [ { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, { key: 'X-Frame-Options', value: 'DENY' }, { key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'no-referrer' }, { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' https://<uploadthing-domain>;" } ] } ] } }`

### 6.2 Secure Cookies

*   Set `Secure`, `HttpOnly`, and `SameSite=Strict` on all session or auth cookies.
*   Use short lifetimes for refresh tokens and rotate them after use.

### 6.3 File Upload Hardening

*   Validate file MIME types, extensions, and size on both client and server.
*   Store uploads outside the webroot or use object storage buckets with restricted public access.
*   Generate time-limited, signed URLs for downloads.

### 6.4 Client-Side Storage

*   Avoid `localStorage` for tokens; prefer **HttpOnly** cookies.
*   For non-sensitive state (UI preferences), consider `localStorage` only after CSRF risk assessment.

## 7. Infrastructure & Configuration Management

*   **Harden OS & Runtime**: Keep Node.js, OS, and dependencies patched.
*   **Disable Debug**: Remove or disable Next.js debug logs and verbose error traces in production.
*   **Restrict Ports**: Expose only HTTPS (443) and internal health checks.
*   **Automated Backups**: Schedule daily backups for PostgreSQL and verify restores.
*   **Network Controls**: Use VPCs, security groups, and firewall rules to isolate databases and services.

## 8. Dependency Management & CI/CD Security

*   Employ lockfiles (`package-lock.json`) and pin major versions.
*   Integrate SCA tools (e.g., GitHub Dependabot, Snyk) to detect vulnerabilities continuously.
*   Run linting, unit tests, and security scans in CI (e.g., ESLint, Jest, OWASP ZAP).
*   Deploy only from signed, passing builds; use role-based access in CI/CD pipelines.

## 9. Monitoring, Logging & Incident Response

*   Centralize logs (application, auth, payments) in a secure SIEM.
*   Mask sensitive fields; retain logs according to privacy policies.
*   Set up alerts for anomalous patterns (rate spikes, error surges, failed logins).
*   Define an incident response plan: triage, contain, eradicate, recover, post-mortem.

**By following these guidelines, Golden HomeShare Marketplace will uphold strong security posture, protect user data, and maintain trust while facilitating homesharing transactions safely and reliably.**
