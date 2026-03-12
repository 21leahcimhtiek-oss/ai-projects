// ─── tRPC Initialisation ───────────────────────────────────────────────────────
// TODO: Migrate from my-projects/src/server/lib/trpc.ts

import { initTRPC, TRPCError } from "@trpc/server";

import type { Context, ContextUser } from "../middleware/context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Protected procedure that ensures user is logged in
// Using type assertion to satisfy TypeScript's type inference requirements
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }
  return next({ ctx: { ...ctx, user: ctx.user as ContextUser } });
}) as typeof t.procedure;