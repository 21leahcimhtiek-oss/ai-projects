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

## Step 2: App Scaffolds ✅
- [x] `apps/web` — Vite + React fresh scaffold
- [x] `apps/api` — Express + tRPC fresh scaffold with Zod env validation
- [x] `apps/mobile` — Expo 54 + React Native fresh scaffold
- [x] Fix `vercel.json` — changed `npm ci` → `npm install`

## Step 3: Infrastructure & Tooling ✅
- [x] Root `.env.example` — all required env vars documented
- [x] `apps/api/src/env.ts` — validated env with Zod at startup (fails fast on missing vars)
- [x] `apps/web/vercel.json` — fixed deployment config (pnpm install)

## Step 4: GitHub & CI ✅
- [x] `monorepo/.github/copilot-instructions.md` — full architecture guide (16 sections)
- [x] Pushed branch `feature/monorepo-scaffold` to 21leahcimhtiek-oss/my-projects
- [x] PR #83 created: https://github.com/21leahcimhtiek-oss/my-projects/pull/83