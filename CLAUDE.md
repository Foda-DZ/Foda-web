# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # TypeScript compile + Vite production build
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test runner is configured.

## Environment

Create `.env` (already present) with:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The production URL is `https://foda-backend-hyxw.onrender.com/api/v1`.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, MUI (icons + components), React Router v7, Axios, Framer Motion.

### Two distinct portals in one app

`src/App.tsx` defines two route trees with separate layouts and guards:

- **Buyer portal** — wrapped in `<Layout>` (Navbar + AuthModal + Footer per page). Routes: `/`, `/shop`, `/products/:id`, `/wishlist`, `/cart`, `/checkout`, `/profile`.
- **Seller portal** — wrapped in `<SellerLayout>` (its own sidebar nav). Routes under `/seller/*`. Sellers are redirected away from `/` on login.

Route guards: `RequireAuth` (any logged-in user), `RequireActiveSeller` (role === "seller").

### API layer (`src/lib/api.ts`)

Single Axios instance (`api`) pointed at `VITE_API_BASE_URL`. It:
- Attaches `Bearer` token from `localStorage` on every request.
- On 401, silently calls `/auth/refresh` (HTTP-only cookie), retries the original request, and queues concurrent 401s during the refresh. On refresh failure it clears local session state.

All service files (`src/services/`) use this `api` instance. Never import Axios directly in components.

### Auth (`src/context/AuthContext.tsx`)

Session is persisted in `localStorage` as `foda_session` (JSON) + `foda_access_token`. The context re-hydrates on load. Two roles exist: `"customer"` and `"seller"`.

Seller onboarding has a two-phase flow tracked in `localStorage` under `foda_seller_setup_<userId>` — `"pending"` until `completeSellerSetup()` is called.

The `openLogin()` / `openRegister()` functions accept `{ customerOnly, redirectTo }` and drive `AuthModal` state — use these instead of navigating to a login page.

### Internationalisation (`src/context/LangContext.tsx`)

Default language is **Arabic (`ar`)**, stored as `foda_lang` in `localStorage`. RTL/LTR is applied directly to `<html dir>`. Components access translations via `const { tr } = useLang()` — `tr` is a strongly-typed `Translations` object (defined in `src/translations/index.ts`). Check `tr.dir === "rtl"` for layout direction logic.

`src/utils/i18n.ts` is a separate flat key-value translation helper used only in the seller Meta Ads / Traffic Analytics pages.

### Data flow pattern

API responses use `ApiProduct` / `ApiAuthResponse` shapes (defined in `src/types/api.ts`). They are mapped to frontend types (`Product`, `SessionUser`, etc. in `src/types/index.ts`) via `src/lib/mappers.ts` before being stored in state. Never pass raw API shapes to UI components.

### Cart (`src/context/CartContext.tsx`)

Cart is server-side for authenticated customers (synced via `src/services/cartService.ts`). CartItem keys are `${productId}-${size}-${color}`.

### Styling conventions

- Tailwind utility classes throughout; no CSS modules.
- Brand colours: `#1A1A2E` (dark navy), `#C9A84C` (gold). Use `gold-gradient` and `btn-dark` utility classes (defined globally) for the primary CTAs.
- MUI components are styled inline via the `sx` prop, not via a theme override file (theme is in `src/lib/muiTheme.ts` but minimally used).
