# GitHub Copilot Instructions — StoryForge Kids Monorepo

> Read this file completely before generating any code, suggesting any refactor,
> or answering any architecture question. These instructions are the single source
> of truth for how this codebase is structured and how it must be extended.

---

## 1. Project Overview

**StoryForge Kids** is an AI-powered personalized children's storybook platform.
Parents enter a child's name, age, and theme; the app generates a custom story
starring that child using Google Gemini, then delivers it on web and mobile.

**Monetisation model:** Free tier (1 story/month) + paid subscription via Stripe
(monthly/yearly) for unlimited stories.

**Platforms:**
- `apps/web` — React SPA (Vite) deployed to Vercel
- `apps/api` — Express + tRPC API server (Node.js)
- `apps/mobile` — Expo / React Native (iOS + Android)

---

## 2. Monorepo Architecture

```
storyforge-kids/
├── apps/
│   ├── web/          @storyforge/web     — Vite + React 18 + Tailwind
│   ├── api/          @storyforge/api     — Express 4 + tRPC 11 + Drizzle ORM
│   └── mobile/       @storyforge/mobile  — Expo 54 + React Native 0.76
├── packages/
│   ├── tsconfig/     @storyforge/tsconfig     — TS config presets (base/react/node/rn)
│   ├── eslint-config/@storyforge/eslint-config — ESLint rule sets
│   ├── prettier-config/@storyforge/prettier-config — Prettier config
│   ├── types/        @storyforge/types    — Shared domain types (zero runtime)
│   ├── utils/        @storyforge/utils    — Pure utility functions
│   ├── ui/           @storyforge/ui       — Shared React component library
│   └── api-client/   @storyforge/api-client — tRPC client + React Query provider
├── turbo.json        — Turborepo v2 task pipeline
├── pnpm-workspace.yaml
└── package.json      — Root workspace (@storyforge/root)
```

**Package manager:** `pnpm` (v9+). Never use `npm` or `yarn` in this repo.
**Build orchestration:** Turborepo v2. Run tasks via `pnpm turbo run <task>` or
the root scripts in `package.json`.

---

## 3. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | 5.8+ |
| Web framework | React | 18.3 |
| Web bundler | Vite | 6.x |
| Mobile | Expo / React Native | 54 / 0.76 |
| API framework | Express | 4.x |
| API type-safety | tRPC | 11.x |
| Database ORM | Drizzle ORM | 0.44+ |
| Database | Supabase (PostgreSQL) | — |
| Auth | Custom session tokens (bcryptjs + crypto) | — |
| Payments | Stripe | 17.x |
| AI | Google Gemini (`gemini-1.5-flash`) | 0.24+ |
| Styling (web) | Tailwind CSS | 3.x |
| State / data fetching | TanStack React Query | 5.x |
| Validation | Zod | 3.x |
| Monorepo | Turborepo | 2.x |

---

## 4. Package Dependency Rules

These rules are **strict**. Never violate them.

```
tsconfig        → (no deps)
eslint-config   → (no deps)
prettier-config → (no deps)
types           → tsconfig
utils           → tsconfig, clsx, tailwind-merge, zod
ui              → tsconfig, utils, react (peer)
api-client      → tsconfig, types, trpc, react-query
apps/web        → ui, utils, types, api-client
apps/api        → types, utils  (NO react, NO ui)
apps/mobile     → utils, types, api-client  (NO ui — use RN primitives)
```

**Key rules:**
- `apps/api` must never import from `@storyforge/ui` or any browser-only package.
- `packages/types` must contain zero runtime code — types and `const` enums only.
- `packages/utils` must be isomorphic — no DOM APIs, no Node-only APIs.
- Never add a circular dependency between packages.

---

## 5. TypeScript Rules

- All code must be strictly typed. `noImplicitAny` is on.
- Use `type` imports for type-only imports: `import type { Foo } from "./foo.ts"`.
- Prefer `unknown` over `any`. If `any` is unavoidable, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why.
- Use `satisfies` operator for config objects where possible.
- All async functions must have explicit return types.
- Never use `!` non-null assertion without a comment explaining why it's safe.
- Path aliases are configured per-app in `tsconfig.json`. Use `@/*` for local imports.

---

## 6. API (tRPC) Conventions

### Router structure
```
apps/api/src/routers/
├── index.ts        — appRouter (combines all sub-routers)
├── auth.ts         — register, login, logout, me
├── books.ts        — list, get, create, delete
└── subscription.ts — status, createCheckoutSession, createPortalSession, plans
```

### Procedure rules
- Use `publicProcedure` only for: `auth.me`, `auth.register`, `auth.login`, `subscription.plans`.
- All other procedures must use `protectedProcedure`.
- Always validate input with Zod. Import schemas from `@storyforge/utils/validation` when they exist there.
- Never throw raw `Error` — always throw `TRPCError` with an appropriate `code`.
- Use these tRPC error codes consistently:
  - `UNAUTHORIZED` — not logged in
  - `FORBIDDEN` — logged in but not allowed (e.g. plan limit)
  - `NOT_FOUND` — resource doesn't exist or doesn't belong to user
  - `CONFLICT` — duplicate (e.g. email already registered)
  - `BAD_REQUEST` — invalid input not caught by Zod
  - `INTERNAL_SERVER_ERROR` — unexpected server error

### Context shape
```typescript
interface Context {
  req:  Request;
  res:  Response;
  db:   typeof db;       // Drizzle instance
  user: AuthUser | null; // null for public procedures
}
```

---

## 7. Database (Drizzle ORM) Conventions

- Schema lives in `apps/api/src/database/schema.ts`.
- All queries live in `apps/api/src/database/queries.ts` — never write raw SQL in routers.
- Use Drizzle's type-safe query builder. Never use `db.execute()` with raw strings.
- All IDs are `uuid` (PostgreSQL `gen_random_uuid()`).
- All timestamps use `timestamp with time zone`.
- Migrations are generated with `drizzle-kit generate` and applied with `drizzle-kit migrate`.
- Migration files live in `apps/api/supabase/migrations/`.
- Never edit migration files manually after they've been applied.

### Schema naming conventions
- Table names: `snake_case` plural (e.g. `users`, `books`, `chat_messages`)
- Column names: `snake_case` (e.g. `created_at`, `stripe_customer_id`)
- TypeScript field names: `camelCase` (Drizzle maps automatically)

---

## 8. Auth Conventions

- Sessions are stored in the `sessions` table (not JWT).
- Session token: 48 random bytes as hex string (`crypto.randomBytes(48).toString("hex")`).
- Session lifetime: 30 days.
- Token delivery: HttpOnly cookie (`session=<token>`) for web; `Authorization: Bearer <token>` header for mobile.
- `createContext()` in `apps/api/src/middleware/context.ts` reads both sources.
- Passwords are hashed with bcrypt (cost factor 12).
- Never store plain-text passwords. Never log passwords or tokens.

---

## 9. Subscription & Billing Conventions

- Subscription status values: `"free" | "active" | "canceled" | "past_due" | "trialing"`.
- Book limits per status are defined in `packages/types/src/book.ts` → `BOOK_LIMITS`.
- Always check `BOOK_LIMITS[user.subscriptionStatus]` before creating a book.
- Stripe Checkout is used for new subscriptions.
- Stripe Billing Portal is used for managing/canceling subscriptions.
- Stripe webhooks are handled in `apps/api/src/api/stripe-webhooks.ts`.
- The webhook route must use `express.raw()` body parser (not `express.json()`).
- Always verify the Stripe webhook signature with `stripe.webhooks.constructEvent()`.

---

## 10. Web App (`apps/web`) Conventions

- Pages live in `src/pages/`. One file per route.
- Shared components live in `src/components/`.
- The tRPC client is initialised in `src/lib/trpc.ts`.
- Auth state is managed by `src/providers/AuthProvider.tsx` → `useAuth()` hook.
- Use `@storyforge/ui` components (Button, Input, Card, Badge, Spinner) before creating new ones.
- Use `cn()` from `@storyforge/utils/cn` for conditional Tailwind classes.
- Protected routes use the `<ProtectedRoute>` wrapper in `App.tsx`.
- Environment variables must be prefixed with `VITE_` to be accessible in the browser.
- Never hardcode API URLs — use `import.meta.env.VITE_API_URL`.

### Routing
```
/           → Home (public)
/login      → Login (public)
/register   → Register (public)
/pricing    → Pricing (public)
/library    → Library (protected)
/book/:id   → BookDetail (protected)
/account    → Account (protected)
```

---

## 11. Mobile App (`apps/mobile`) Conventions

- Uses Expo Router (file-based routing). Route files live in `app/`.
- Tab screens live in `app/tabs/`.
- The tRPC client is in `src/lib/trpc.ts` — uses `AsyncStorage` for session token.
- Never use DOM APIs (`window`, `document`, `localStorage`) — use React Native equivalents.
- Use `AsyncStorage` for persistence, not `localStorage`.
- Use `expo-router`'s `useRouter()` for navigation, not `react-navigation` directly.
- Environment variables must be prefixed with `EXPO_PUBLIC_` to be bundled.
- Never hardcode API URLs — use `process.env.EXPO_PUBLIC_API_URL`.

### Tab routes
```
app/tabs/index.tsx   → Home screen
app/tabs/create.tsx  → Create story screen
app/tabs/library.tsx → My stories screen
app/tabs/account.tsx → Account / subscription screen
```

---

## 12. Shared Packages Usage

### `@storyforge/types`
- Import domain types from here, never redefine them locally.
- `SubscriptionStatus`, `BookStatus`, `BookTheme`, `BOOK_LIMITS` — always use these.
- `ERROR_CODES` — use for consistent error code strings.

### `@storyforge/utils`
- `cn(...classes)` — Tailwind class merging (web only).
- `formatDate()`, `formatRelativeTime()` — date formatting.
- `truncate()`, `toSlug()`, `capitalize()` — string helpers.
- `requireEnv()`, `getEnv()` — env var access in Node.js (API only).
- Zod schemas: `registerSchema`, `loginSchema`, `createBookSchema` — use these in both API routers and web forms.

### `@storyforge/ui`
- Web-only. Never import in `apps/api` or `apps/mobile`.
- Components: `Button`, `Input`, `Card`, `Badge`, `Spinner`, `PageSpinner`.
- Hooks: `useLocalStorage`, `useDebounce`, `useDisclosure`.
- `SubscriptionBadge` — renders subscription status with correct colour.

### `@storyforge/api-client`
- `trpc` — the tRPC React instance (used in both web and mobile).
- `TRPCProvider` — wrap your app root with this.
- Once `apps/api` is fully migrated, update `router-type.ts` to import the real `AppRouter`.

---

## 13. Environment Variables

All required env vars are documented in `.env.example` at the monorepo root.
Copy `.env.example` to `apps/api/.env` and fill in real values.

| Variable | Used by | Required |
|----------|---------|----------|
| `DATABASE_URL` | api | ✅ |
| `SUPABASE_URL` | api | ✅ |
| `SUPABASE_ANON_KEY` | api | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | api | ✅ |
| `JWT_SECRET` | api | ✅ |
| `STRIPE_SECRET_KEY` | api | ✅ |
| `STRIPE_WEBHOOK_SECRET` | api | ✅ |
| `STRIPE_PRICE_ID_MONTHLY` | api | ✅ |
| `STRIPE_PRICE_ID_YEARLY` | api | ✅ |
| `GEMINI_API_KEY` | api | ✅ |
| `ALLOWED_ORIGINS` | api | ✅ |
| `VITE_API_URL` | web | prod only |
| `VITE_STRIPE_PUBLISHABLE_KEY` | web | ✅ |
| `EXPO_PUBLIC_API_URL` | mobile | ✅ |

The API server validates all env vars at startup via `apps/api/src/env.ts` (Zod schema).
It will **refuse to start** if any required variable is missing.

---

## 14. Git & Branch Conventions

- Default branch: `main`
- Feature branches: `feature/<short-description>`
- Bug fix branches: `fix/<short-description>`
- Commit messages: short, imperative, descriptive (e.g. `add book deletion endpoint`)
- Never commit `.env` files.
- Never commit `node_modules/`, `dist/`, `.turbo/`, `.expo/`.
- Always run `pnpm lint` and `pnpm typecheck` before pushing.

---

## 15. Common Commands

```bash
# Install all dependencies
pnpm install

# Start all apps in dev mode (parallel)
pnpm dev

# Start only the API
pnpm turbo run dev --filter=@storyforge/api

# Start only the web app
pnpm turbo run dev --filter=@storyforge/web

# Build everything
pnpm build

# Type-check everything
pnpm typecheck

# Lint everything
pnpm lint

# Run database migrations
pnpm db:push

# Open Drizzle Studio (DB GUI)
pnpm db:studio

# Format all files
pnpm format
```

---

## 16. What NOT to Do

- ❌ Do not use `npm` or `yarn` — use `pnpm` only.
- ❌ Do not import `@storyforge/ui` in `apps/api` or `apps/mobile`.
- ❌ Do not use `localStorage` in `apps/mobile` — use `AsyncStorage`.
- ❌ Do not use `window` or `document` in `apps/api` or `apps/mobile`.
- ❌ Do not write raw SQL — use Drizzle's query builder.
- ❌ Do not throw raw `Error` in tRPC routers — use `TRPCError`.
- ❌ Do not hardcode API URLs — use env vars.
- ❌ Do not commit `.env` files.
- ❌ Do not add new packages to the root `package.json` — add them to the specific app/package.
- ❌ Do not create circular dependencies between packages.
- ❌ Do not duplicate Zod schemas — import from `@storyforge/utils/validation`.
- ❌ Do not duplicate domain types — import from `@storyforge/types`.
- ❌ Do not use `npm ci` in Vercel config — use `pnpm install`.
- ❌ Do not use `any` without a comment explaining why.