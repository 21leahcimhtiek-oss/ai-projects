// tRPC client for apps/web
// Wires up the shared @storyforge/api-client to this app's env var for the API URL.

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";

// Import the actual AppRouter type from the API
import type { AppRouter } from "@storyforge/api/routers";

export const trpc = createTRPCReact<AppRouter>();

const API_URL = import.meta.env.VITE_API_URL ?? "";

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
        return fetch(url, {
          ...options,
          credentials: "include",
        } as RequestInit);
      },
    }),
  ],
});