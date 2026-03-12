// AppRouter Type Stub
// This file re-exports the AppRouter TYPE ONLY from the API package.
// It contains zero runtime code — it's purely for TypeScript inference.

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AnyRouter } from "@trpc/server/unstable-core-do-not-import";

// Use AnyRouter as the placeholder type for tRPC v11
// Will be replaced with real AppRouter once apps/api is wired
export type AppRouter = AnyRouter;

/** Inferred input types for all tRPC procedures */
export type RouterInputs = inferRouterInputs<AppRouter>;

/** Inferred output types for all tRPC procedures */
export type RouterOutputs = inferRouterOutputs<AppRouter>;