// ─── AppRouter Type Stub ──────────────────────────────────────────────────────
// This file re-exports the AppRouter TYPE ONLY from the API package.
// It contains zero runtime code — it's purely for TypeScript inference.
//
// When the monorepo is fully wired up, this will be:
//   export type { AppRouter } from "@storyforge/api/router";
//
// For now it provides the type shape so the client compiles independently.

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Placeholder — will be replaced with the real AppRouter once apps/api is scaffolded
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppRouter = any;

/** Inferred input types for all tRPC procedures */
export type RouterInputs = inferRouterInputs<AppRouter>;

/** Inferred output types for all tRPC procedures */
export type RouterOutputs = inferRouterOutputs<AppRouter>;