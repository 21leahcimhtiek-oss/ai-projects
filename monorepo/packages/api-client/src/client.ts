// ─── tRPC HTTP Client (framework-agnostic) ────────────────────────────────────
// Used by both the web app and the React Native app.
// The React Query integration is in hooks.ts.

import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";

import type { AppRouter } from "./router-type.ts";

export { type AppRouter };

// ─── Config ───────────────────────────────────────────────────────────────────

export interface TRPCClientConfig {
  /** Base URL of the API server, e.g. "https://api.storyforge.app" */
  baseUrl: string;
  /** Returns the auth token (or null) for the current session */
  getToken: () => string | null | Promise<string | null>;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createApiClient(config: TRPCClientConfig) {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env["NODE_ENV"] === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: `${config.baseUrl}/api/trpc`,
        async headers() {
          const token = await config.getToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });
}

export type ApiClient = ReturnType<typeof createApiClient>;