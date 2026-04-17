# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
USW Festival 2026 admin site (`festival-admin`) — React 18 + TypeScript + Vite + React Router v6. Deployed to Cloudflare Pages.

## Commands
- `npm install` — install dependencies
- `npm run dev` — Vite dev server
- `npm run build` — `tsc && vite build` (type-check then bundle into `dist/`)
- `npm run preview` — preview the production build

No test framework or linter is configured in `package.json`.

## Architecture

**Routing & auth gate (`src/App.tsx`)**
- `BrowserRouter` → `AuthProvider` → `Routes`.
- Public: `/` (Dashboard), `/login`.
- Protected via `PrivateRoute`: `/general` (총학생회), `/booth` (과학생회). Unauthenticated users are redirected to `/login`.

**Auth & role model (`src/context/AuthContext.tsx`)**
- Single source of truth for `isLoggedIn` and `role: 'general' | 'booth'`.
- `login()` currently short-circuits: `id === 'booth' ? 'booth' : 'general'` (any password). Temp accounts: `general` / `booth`. Replace with a real call to `api.post('/auth/login', …)` when backend lands — this is the documented integration point.
- Role determines which protected page the UI routes to after login.

**API layer (`src/services/`)**
- `api.ts` exports a single Axios instance with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`. All domain services (`notice.ts`, `booth.ts`, `lost.ts`) must import from here so cookie-based auth and base URL stay consistent.
- Set `VITE_API_URL` via `.env` files (gitignored).

**Pages & capabilities**
- `Dashboard.tsx` — public landing.
- `General.tsx` — notices CRUD, lost-item registration & pickup toggle, events. Uses `services/notice.ts`, `services/lost.ts`.
- `Booth.tsx` — booth details/images, menu CRUD, sold-out toggle. Uses `services/booth.ts`.
- `Login.tsx` — credentials form; calls `AuthContext.login`.

**Shared UI (`src/components/`)**
- `Layout.tsx` wraps authenticated pages with `Sidebar` + `TopBar`.
- `Modal.tsx` is the shared modal primitive — reuse it for any new dialog.
- Clicking the dashboard entry in `Sidebar` always returns to `/`.

## Repository layout notes
- `src/` is the only active code path.
- `legacy/` holds the pre-React HTML/JS prototype (`legacy/{css,js,pages,login.html}`). It is **not** referenced by the React build and should not be imported from `src/`. Treat it as archival.
- Root `index.html` is the Vite entry and loads `/src/main.tsx` — do not move it.
- `public/` is served as-is by Vite; `dist/` is build output (gitignored).

## Conventions
- Write all new UI in TypeScript under `src/`. Do not add new files to `legacy/`.
- New API calls go through `src/services/*.ts` using the shared `api` instance, never a fresh Axios client.
- Korean is the primary language for user-facing strings, commit messages, and README.
