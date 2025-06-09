# Environment Variables Setup

This document explains how to configure environment variables for Golden HomeShare.

## Background Check Configuration

### Automated Background Checks (Checkr API)
Set these variables to enable automated background checks through Checkr:

```env
# Enable automated background checks
CHECKR_API_ENABLED="true"
NEXT_PUBLIC_CHECKR_API_ENABLED="true"

# Checkr API Configuration
CHECKR_API_KEY="your_checkr_api_key"
CHECKR_BASE_URL="https://api.checkr-staging.com/v1"  # Staging
# CHECKR_BASE_URL="https://api.checkr.com/v1"       # Production
CHECKR_WEBHOOK_SECRET="your_webhook_secret"
```

### Manual Background Checks (Contact-Based)
Set these variables to disable Checkr API and show contact information instead:

```env
# Disable automated background checks
CHECKR_API_ENABLED="false"
NEXT_PUBLIC_CHECKR_API_ENABLED="false"

# Checkr variables not needed when disabled
# CHECKR_API_KEY=""
# CHECKR_BASE_URL=""
# CHECKR_WEBHOOK_SECRET=""
```

## Contact Information

When `CHECKR_API_ENABLED="false"`, users will see these contact methods:

- **Email**: support@goldenhomeshare.com
- **Phone**: (816) 433-2979

Update these in the following files when you get your real contact information:
- `app/background-check/page.tsx`
- `app/components/BackgroundCheckCard.tsx`

## Switching Between Modes

### To Enable Checkr API (when you get live keys):
1. Set `CHECKR_API_ENABLED="true"`
2. Set `NEXT_PUBLIC_CHECKR_API_ENABLED="true"`
3. Add your Checkr API keys
4. Restart your application

### To Disable Checkr API (manual processing):
1. Set `CHECKR_API_ENABLED="false"`
2. Set `NEXT_PUBLIC_CHECKR_API_ENABLED="false"`
3. Restart your application

## Other Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/goldenhomeshare"

# Kinde Authentication
KINDE_CLIENT_ID=""
KINDE_CLIENT_SECRET=""
KINDE_ISSUER_URL=""
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/api/auth/success"

# Stripe Keys (LIVE MODE)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Stripe Webhooks (LIVE MODE)
STRIPE_SECRET_WEBHOOK="whsec_..."
STRIPE_CONNECT_WEBHOOK_SECRET="whsec_..."

# Email Service
RESEND_API_KEY=""

# File Upload Service
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# App Configuration
NEXT_PUBLIC_APP_URL="https://goldenhomeshare.com"
NODE_ENV="production"
```

## Notes

- The `NEXT_PUBLIC_` prefix is required for environment variables used in client-side components
- Both `CHECKR_API_ENABLED` and `NEXT_PUBLIC_CHECKR_API_ENABLED` should have the same value
- When switching modes, always restart your Next.js application for changes to take effect
- In production, make sure to use live Stripe keys and production Checkr URLs 