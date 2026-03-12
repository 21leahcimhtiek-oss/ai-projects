// ─── App Router ───────────────────────────────────────────────────────────────
// TODO: Migrate routers from my-projects/src/server/routers/

import { router } from "../lib/trpc.ts";
import { authRouter }         from "./auth.ts";
import { booksRouter }        from "./books.ts";
import { subscriptionRouter } from "./subscription.ts";

export const appRouter = router({
  auth:         authRouter,
  books:        booksRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;