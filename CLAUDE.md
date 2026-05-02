# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
USW Festival 2026 admin site (`festival-admin`) — React 18 + TypeScript + Vite + React Router v6. Deployed to Cloudflare Pages.

## Commands
- `npm install` — install dependencies
- `npm run dev` — Vite dev server
- `npm run build` — `tsc && vite build` (type-check then bundle into `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` / `npm run lint:fix` — ESLint over `src/` (flat config in `eslint.config.js`)
- `npm run format` — Prettier over `src/`
- `npm run test` / `npm run test:watch` — Vitest (jsdom)

## Architecture

**Routing & auth gate (`src/App.tsx`)**
- `ErrorBoundary` → `BrowserRouter` → `AuthProvider` → `Routes`.
- Public: `/` (Login). `/login` 요청은 `/`로 redirect.
- Protected via `PrivateRoute requiredRole`: `/general` (총학생회만), `/booth` (과학생회만). 비로그인 사용자는 `/`로, 잘못된 역할은 본인 역할 경로로 redirect.

**Auth & role model (`src/context/AuthContext.tsx`)**
- Single source of truth for `isLoggedIn`, `userRole: 'general' | 'booth' | null`.
- 초기 역할은 `localStorage`(hint)에서 동기적으로 읽어 들임. 백엔드 세션은 쿠키로 서버가 강제하며, 잘못된 hint나 위·변조된 역할은 첫 보호 API 호출 시 `api.ts` 401 인터셉터가 localStorage를 정리하고 `/`로 redirect.
- `login()`은 `USE_MOCK=true`일 때만 `id === 'booth' ? 'booth' : 'general'`로 분기. 실 환경에서는 `api.post('/api/admin/auth/login', …)` 후 `normalizeRole`로 백엔드 역할(`DEPARTMENT_COUNCIL`/`STUDENT_COUNCIL` 등)을 매핑하며 알 수 없는 값은 throw.
- Role determines which protected page the UI routes to after login.

**API layer (`src/services/`)**
- `api.ts` exports a single Axios instance with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`. All domain services (`notice.ts`, `booth.ts`, `lost.ts`) must import from here so cookie-based auth and base URL stay consistent.
- Set `VITE_API_URL` via `.env` files (gitignored).
- `supabase.ts`는 이미지 업로드용. MIME/확장자 화이트리스트(`image/jpeg|png|webp|gif`)를 강제하고 SVG는 명시 차단. 클라이언트 검증은 우회 가능하므로 동일 제한이 Supabase Storage 정책(RLS)/백엔드에서도 강제되어야 함.

**Cloudflare Pages headers (`public/_headers`)**
- 빌드 시 `dist/_headers`로 복사되어 Pages가 응답 헤더로 적용. CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, HSTS 등을 포함. 백엔드/Supabase 도메인이 바뀌면 `connect-src`/`img-src`를 갱신.

**Pages & capabilities**
- `Login.tsx` — `/`에 마운트되는 로그인 폼. `AuthContext.login`을 호출하고 역할에 따라 `/general` 또는 `/booth`로 navigate.
- `General.tsx` — notices CRUD, lost-item registration & pickup toggle, events. Uses `services/notice.ts`, `services/lost.ts`.
- `Booth.tsx` — booth details/images, menu CRUD, sold-out toggle. Uses `services/booth.ts`.

**Shared UI (`src/components/`)**
- `Layout.tsx` wraps authenticated pages with `Sidebar` + `TopBar`.
- `Modal.tsx` is the shared modal primitive — `role=dialog`/`aria-modal`/`aria-labelledby`/Escape 닫기/포커스 트랩/포커스 복원 포함. 새 다이얼로그는 이걸 재사용.
- `ErrorBoundary.tsx` — App 루트 오류 경계. 렌더 단계 예외 발생 시 새로고침 fallback.

## Repository layout notes
- `src/` is the only active code path.
- `legacy/` holds the pre-React HTML/JS prototype (`legacy/{css,js,pages,login.html}`). It is **not** referenced by the React build and should not be imported from `src/`. Treat it as archival.
- Root `index.html` is the Vite entry and loads `/src/main.tsx` — do not move it.
- `public/` is served as-is by Vite; `dist/` is build output (gitignored).

## Conventions
- Write all new UI in TypeScript under `src/`. Do not add new files to `legacy/`.
- New API calls go through `src/services/*.ts` using the shared `api` instance, never a fresh Axios client.
- Korean is the primary language for user-facing strings, commit messages, and README.
