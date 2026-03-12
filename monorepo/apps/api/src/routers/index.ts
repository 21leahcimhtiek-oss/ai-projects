// ─── App Router ───────────────────────────────────────────────────────────────
// TODO: Migrate routers from my-projects/src/server/routers/

import { router } from "../lib/trpc";
import { authRouter }         from "./auth";
import { booksRouter }        from "./books";
import { subscriptionRouter } from "./subscription";

export const appRouter = router({
  auth:         authRouter,
  books:        booksRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;