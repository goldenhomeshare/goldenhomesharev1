# Frontend Guideline Document for Golden HomeShare Marketplace

This document describes the architecture, design principles, technologies, and best practices used in the Golden HomeShare Marketplace frontend. It’s written in everyday language so that anyone—even without a deep technical background—can understand how the frontend is set up, why certain choices were made, and how to maintain and extend it.

## 1. Frontend Architecture

**Overall Structure**

*   Built on Next.js (a React framework) that handles both server-side rendering (SSR) and client-side interactions.
*   UI layer powered by React components.
*   Styles managed with Tailwind CSS utility classes.
*   Accessible, unstyled building blocks from Radix UI are styled with Tailwind for consistency.

**How It Works**

1.  **Page Rendering**

    *   **SSR & SSG**: The homepage and product listing pages are pre-rendered on the server or at build time for fast first loads and good SEO.
    *   **Client-side Navigation**: Once loaded, page transitions are handled by Next.js’s built-in router, giving a smooth, app-like feel.

2.  **API Routes**

    *   Next.js API routes live alongside pages to handle data fetching, form submissions, and third-party integrations (Stripe, UploadThing, Resend).

3.  **Code Organization**

    *   `/pages`: File-based routing—each file becomes a route.
    *   `/components`: Reusable UI pieces, organized into atoms, molecules, and organisms (see Component Structure below).
    *   `/lib` or `/utils`: Shared utilities (API clients, class-variant helpers, data validators).

4.  **Scalability & Maintainability**

    *   **Modular Components**: Each component does one thing and is easy to test.
    *   **Type Safety & Validation**: Although our code is in JavaScript, we use Zod to enforce the shape of data (forms, API responses).
    *   **Automatic Code Splitting**: Next.js only sends the code needed for the page you’re on, keeping downloads small.

**Performance**

*   **Lazy Loading**: Heavy components (TipTap editor, image carousels) are dynamically imported so they only load when needed.
*   **Image Optimization**: Next.js’s `<Image>` component resizes and compresses images and lazy-loads them.
*   **CDN Delivery**: Deployed on Vercel, so assets and pages are cached at edge locations worldwide.

## 2. Design Principles

1.  **Usability**

    *   Simple, clear flows: browsing, listing creation, and booking follow intuitive steps.
    *   Consistent component patterns (buttons, forms, cards) reduce the learning curve.

2.  **Accessibility**

    *   Components from Radix UI come with built-in ARIA roles and keyboard support.
    *   Color contrast meets WCAG 2.1 AA guidelines.
    *   Focus outlines and skip links ensure keyboard users can navigate easily.

3.  **Responsiveness**

    *   Mobile-first breakpoints in Tailwind make layouts adapt from phones to desktops.
    *   Touch-friendly elements (larger tap targets on buttons, swipe gestures in carousels).

4.  **Consistency**

    *   A shared design system: same colors, spacing scale, typography, and icons everywhere.
    *   Class Variance Authority (CVA) & `tailwind-merge` ensure variant logic (primary vs. secondary button) is centralized.

## 3. Styling and Theming

**Styling Approach**

*   **Tailwind CSS**: Utility-first classes (`bg-white`, `px-4`, `text-gray-800`) speed up styling without writing custom CSS files.
*   **Class Variance Authority & Tailwind Merge**: Manage component variants (e.g., `Button` can be `primary`, `secondary`, `outline`) in a predictable way.

**Theming**

*   **Next Themes**: Enables users to switch between light and dark modes.
*   CSS variables store core colors so switching themes updates the entire palette.

**Visual Style**

*   **Design Style**: Modern flat design with subtle glassmorphism accents (semi-transparent panels with soft backdrops on modals or cards).

*   **Color Palette**:

    *   Primary Gold: `#F5C544` (buttons, links, highlights)
    *   Dark Slate: `#2D3748` (text, headers)
    *   Accent Green: `#38A169` (success states, badges)
    *   Neutral Light: `#F7FAFC` (background)
    *   Neutral Medium: `#EDF2F7` (cards, forms)
    *   Text Dark: `#1A202C`

**Typography**

*   **Font Family**: Inter (a clean, modern sans-serif) loaded via Google Fonts.

*   **Scale**:

    *   H1: 2.25rem (36px)
    *   H2: 1.875rem (30px)
    *   Body: 1rem (16px)
    *   Small text: 0.875rem (14px)

## 4. Component Structure

**Folder Organization**

*   `/components/`shadcn/ui -- imported components from shadcn
*   `/components/molecules` — FormRow, Card, ModalHeader
*   `/components/organisms` — Navbar, Footer, ListingCardGrid
*   `/components/templates` — Page layouts (MainLayout, AuthLayout)

**Reusability & Encapsulation**

*   Each component has its own folder with JSX/TSX, optional styles file (if needed), and a Storybook story.
*   Props define everything the component needs—no hidden dependencies.

**UI Libraries**

*   **Radix UI** for accessibility-ready primitives (DropdownMenu, Dialog, Tabs).
*   **Lucide React** for consistent iconography.
*   **Embla Carousel** wrapped in a `Carousel` organism.
*   **Sonner** for toast notifications—triggered by custom hooks (e.g., `useToast`).

## 5. State Management

**Local State**

*   React’s `useState` and `useReducer` for component-specific state (form inputs, modal open/close).
*   TipTap editor state lives inside its own component.

**Global State**

*   **React Context** for:

    *   **Authentication** (user info, token)
    *   **Theme** (light/dark)
    *   **Toast notifications**

*   Context providers wrap the app in `_app.js` so any component can access state via custom hooks (`useAuth`, `useTheme`).

**Data Validation**

*   **Zod schemas** validate form inputs before sending to the API (e.g., price must be a positive number, description is required).
*   Errors are surfaced inline in form fields.

## 6. Routing and Navigation

**File-system Routing**

*   Pages live in `/pages`: `index.js` → `/`, `browse/[category].js` → `/browse/Housemate`, `listings/[id].js` → `/listings/123`.

**Navigation Structure**

*   `<Navbar>` with links: Home, Browse, Sell, Profile (changes if logged in or not).
*   **Breadcrumbs** on detail pages for context.
*   **Next.js **`<Link>` component for client-side transitions.

**Route Guards**

*   Protected pages (Sell, Settings) redirect to login if the user isn’t authenticated—handled in a custom `withAuth` HOC or hook in `_app.js`.

## 7. Performance Optimization

1.  **Code Splitting & Lazy Loading**

    *   Dynamic imports (`next/dynamic`) for heavy libraries (TipTap, Embla Carousel) so initial bundle stays small.

2.  **Image Optimization**

    *   Next.js `<Image>` for responsive sizing, automatic format selection (WebP), and lazy loading.

3.  **Tailwind Purge**

    *   Unused CSS classes are removed in production so stylesheet size stays tiny.

4.  **CDN & Caching**

    *   Vercel’s edge network caches static assets and SSR pages.
    *   HTTP headers configured for long-term caching of immutable assets.

5.  **Preloading & Prefetching**

    *   Critical CSS and fonts are inlined or preloaded.
    *   Next.js prefetches linked pages when links scroll into view.

## 8. Testing and Quality Assurance

**Unit Testing**

*   **Jest** + **React Testing Library** for testing component rendering, event handling, and basic logic.
*   Test files live alongside components (`ComponentName.test.jsx`).

**Integration Testing**

*   **Cypress** for critical user flows (signup → browse → book).
*   Runs against a staging environment with seeded test data.

**End-to-End (E2E) Testing**

*   Also handled by Cypress or **Playwright** for cross-browser compatibility checks.

**Storybook**

*   Isolates components to visually verify design, test variants, and document expected behavior.

**Linting & Formatting**

*   **ESLint** with Next.js and React plugins to enforce code quality.
*   **Prettier** for consistent code formatting.
*   Pre-commit hooks (Husky) run linting and tests before code is pushed.

**Continuous Integration**

*   On every pull request: run lint, unit tests, and Storybook build.
*   Merging to main triggers deployment to production.

## 9. Conclusion and Overall Frontend Summary

The Golden HomeShare Marketplace frontend combines Next.js, React, Tailwind CSS, and Radix UI to deliver a fast, accessible, and maintainable experience. Key takeaways:

*   **Architecture**: Modular, server-rendered pages + client-side navigation for speed and SEO.
*   **Design**: Modern flat style with glassmorphism accents, driven by usability and accessibility principles.
*   **Styling & Theming**: Tailwind CSS + Next Themes for light/dark modes and a consistent look.
*   **Components**: Atomic structure, reusable patterns, and clear folder organization.
*   **State & Data**: React Context for global state, Zod for validation, and minimal third-party state libs to keep complexity low.
*   **Performance**: Lazy loading, image optimization, code splitting, and CDN caching for snappy interactions.
*   **Quality**: Comprehensive testing (unit, integration, E2E), Storybook for visual validation, and automated CI checks.

By following these guidelines, any developer—technical or not—can understand how the frontend is put together, how to add new features safely, and how to keep the app performant and accessible as it grows.
