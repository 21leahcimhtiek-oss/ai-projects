// ─── tRPC client for apps/web ─────────────────────────────────────────────────
// Wires up the shared @storyforge/api-client to this app's env var for the API URL.

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";

// TODO: Replace `any` with the real AppRouter type once apps/api is wired:
//   import type { AppRouter } from "@storyforge/api/router";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpc = createTRPCReact<any>();

const API_URL = import.meta.env["VITE_API_URL"] ?? "";

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        import.meta.env.DEV ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      // In dev, Vite proxies /api → localhost:3000 (see vite.config.ts)
      // In prod, VITE_API_URL points to the deployed API
      url: API_URL ? `${API_URL}/api/trpc` : "/api/trpc",
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
});