# StoryForge Monorepo Rebuild — Task Tracker

## Step 1: Foundational Shared Packages ✅
- [x] `packages/tsconfig` — base.json, react.json, node.json, react-native.json
- [x] `packages/eslint-config` — base, react, react-native, node configs
- [x] `packages/prettier-config` — shared Prettier config
- [x] `packages/types` — User, Book, Subscription, API domain types
- [x] `packages/utils` — cn, date, string, validation (Zod schemas), env helpers
- [x] `packages/ui` — Button, Input, Card, Badge, Spinner + hooks
- [x] `packages/api-client` — tRPC client factory + React Query provider
- [x] Root `package.json` — updated name, engines, turbo v2
- [x] `turbo.json` — migrated to v2 `tasks` syntax, all env vars declared
- [x] `pnpm-workspace.yaml` — apps/*, packages/*, tooling/*

**✅ APPROVED — proceeding to Step 2**

## Step 2: App Scaffolds (IN PROGRESS)
- [ ] `apps/web` — Vite + React app (migrated from my-projects/src web code)
- [ ] `apps/api` — Express + tRPC server (migrated from my-projects/src/server)
- [ ] `apps/mobile` — Expo + React Native (migrated from my-projects/app)
- [ ] Fix `vercel.json` — change `npm ci` → `npm install` in installCommand

## Step 3: Infrastructure & Tooling (PENDING APPROVAL)
- [ ] `tooling/scripts` — build, deploy, db migration scripts
- [ ] Root `.env.example` — all required env vars documented
- [ ] `apps/api/src/env.ts` — validated env with Zod at startup
- [ ] `apps/web/vercel.json` — fixed deployment config

## Step 4: GitHub & CI (PENDING APPROVAL)
- [ ] `.github/copilot-instructions.md` — monorepo architecture guide
- [ ] `.github/workflows/ci.yml` — lint, typecheck, test on PR
- [ ] `.github/workflows/deploy-web.yml` — Vercel deploy on main merge
- [ ] Push to GitHub on branch `feature/monorepo-scaffold`